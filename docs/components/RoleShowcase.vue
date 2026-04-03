<template>
  <div class="role-showcase">
    <div class="role-grid">
      <a href="/roles/frontend-dev" class="role-card">
        <div class="role-icon">💻</div>
        <div class="role-title">Frontend Dev</div>
        <div class="role-desc">React, Vue, Angular</div>
        <div class="role-tags">
          <span class="tag">UI/UX</span>
          <span class="tag">TypeScript</span>
        </div>
      </a>

      <a href="/roles/backend-dev" class="role-card">
        <div class="role-icon">⚙️</div>
        <div class="role-title">Backend Dev</div>
        <div class="role-desc">API, Database, Microservices</div>
        <div class="role-tags">
          <span class="tag">Node.js</span>
          <span class="tag">Python</span>
        </div>
      </a>

      <a href="/roles/solution-architect" class="role-card">
        <div class="role-icon">🏗️</div>
        <div class="role-title">Architect</div>
        <div class="role-desc">System Design, Tech Stack</div>
        <div class="role-tags">
          <span class="tag">Cloud</span>
          <span class="tag">Security</span>
        </div>
      </a>

      <a href="/roles/qa-engineer" class="role-card">
        <div class="role-icon">🧪</div>
        <div class="role-title">QA Engineer</div>
        <div class="role-desc">Automation, Testing Strategy</div>
        <div class="role-tags">
          <span class="tag">E2E</span>
          <span class="tag">CI/CD</span>
        </div>
      </a>

      <a href="/roles/sre" class="role-card">
        <div class="role-icon">🔧</div>
        <div class="role-title">SRE</div>
        <div class="role-desc">Reliability, Monitoring</div>
        <div class="role-tags">
          <span class="tag">K8s</span>
          <span class="tag">Observability</span>
        </div>
      </a>

      <a href="/roles/" class="role-card view-all">
        <div class="role-icon">→</div>
        <div class="role-title">查看全部</div>
        <div class="role-desc">20+ 预定义 Roles</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.role-showcase {
  max-width: 1000px;
  margin: 0 auto;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.role-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.role-card.view-all {
  background: var(--vp-c-bg-soft);
  border-style: dashed;
}

.role-card.view-all:hover {
  background: var(--vp-c-brand-soft);
}

.role-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.role-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.role-desc {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
  line-height: 1.5;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .role-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
