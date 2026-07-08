import OpenAI from 'openai';
import { initDb, migrateDb, getDb } from './db.js';

const BATCH_SIZE = 5;
const CONCURRENCY = 3;
const MODEL = 'gpt-4o-mini';

const openai = new OpenAI();

const SYSTEM_PROMPT = `你是一位资深技术教育专家，正在为软件开发者编写知识点的详细学习资料。
对于每个知识点，你需要生成以下结构化内容：

1. **summary** (1-2句话的精确定义，50-100字)
2. **keyPoints** (4-6个关键学习要点，每个15-40字，JSON数组)
3. **codeExample** (一个简短的代码/配置示例，如果知识点不涉及代码则给yaml配置或命令行示例，200字以内)
4. **bestPractices** (2-3条最佳实践，每条15-40字，JSON数组)
5. **commonMistakes** (2-3条常见错误或误区，每条15-40字，JSON数组)
6. **difficulty** (beginner/intermediate/advanced 三选一)
7. **estimatedTime** (学习时间估算，如 "15min", "30min", "1h", "2h")

你必须严格返回JSON格式，不要返回任何其他内容。格式如下：
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "codeExample": "...",
  "bestPractices": ["...", "..."],
  "commonMistakes": ["...", "..."],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": "..."
}

要求：
- summary 要精确定义概念，不是描述性的话语
- keyPoints 要涵盖：是什么、为什么、怎么用、注意事项
- codeExample 要实用、可直接参考
- bestPractices 要有指导意义
- commonMistakes 要指出实际工作中容易犯的错
- 内容要与已有的 desc 描述保持一致并扩展`;

async function enrichOne(db, kp, skill) {
  const userPrompt = `知识点: ${kp.name}
所属技能: ${skill.name} (${skill.name_en})
技能分类: ${skill.category}
已有描述: ${kp.desc || '无'}

请生成该知识点的详细学习资料。`;

  try {
    const resp = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = resp.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    const parsed = JSON.parse(content);

    const updateStmt = db.prepare(`
      UPDATE knowledge_points SET
        summary = ?,
        key_points = ?,
        code_example = ?,
        best_practices = ?,
        common_mistakes = ?,
        difficulty = ?,
        estimated_time = ?,
        enriched = 1
      WHERE id = ?
    `);

    updateStmt.run(
      parsed.summary || null,
      JSON.stringify(parsed.keyPoints || []),
      parsed.codeExample || null,
      JSON.stringify(parsed.bestPractices || []),
      JSON.stringify(parsed.commonMistakes || []),
      parsed.difficulty || 'intermediate',
      parsed.estimatedTime || '30min',
      kp.id
    );

    return { ok: true, id: kp.id, name: kp.name };
  } catch (err) {
    return { ok: false, id: kp.id, name: kp.name, error: err.message };
  }
}

async function enrichBatch(db, kps, skillMap) {
  const promises = kps.map(kp => enrichOne(db, kp, skillMap.get(kp.skill_id)));
  return Promise.all(promises);
}

async function main() {
  initDb();
  migrateDb();

  const db = getDb();

  const skillRows = db.prepare('SELECT * FROM skills').all();
  const skillMap = new Map(skillRows.map(s => [s.id, s]));

  const unenriched = db.prepare('SELECT * FROM knowledge_points WHERE enriched = 0 OR enriched IS NULL').all();
  console.log(`[enrich] ${unenriched.length} knowledge points to enrich`);

  if (unenriched.length === 0) {
    console.log('[enrich] All knowledge points are already enriched');
    return;
  }

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < unenriched.length; i += BATCH_SIZE) {
    const batch = unenriched.slice(i, i + BATCH_SIZE);
    const results = await enrichBatch(db, batch, skillMap);

    for (const r of results) {
      if (r.ok) {
        processed++;
      } else {
        failed++;
        console.error(`  [FAIL] ${r.name}: ${r.error}`);
      }
    }

    const pct = ((i + batch.length) / unenriched.length * 100).toFixed(1);
    console.log(`[enrich] Progress: ${i + batch.length}/${unenriched.length} (${pct}%) - OK: ${processed}, Fail: ${failed}`);

    if (i + BATCH_SIZE < unenriched.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`[enrich] Done. Enriched: ${processed}, Failed: ${failed}`);
}

main().catch(err => {
  console.error('[enrich] Fatal error:', err);
  process.exit(1);
});
