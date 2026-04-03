<template>
  <div class="feature-comparison">
    <div class="comparison-table">
      <div class="table-header">
        <div class="header-cell feature-col">特性</div>
        <div class="header-cell traditional-col">传统 AI</div>
        <div class="header-cell s4c-col">Skills4Coder</div>
      </div>
      
      <div class="table-row">
        <div class="cell feature-col">
          <span class="feature-icon">🎯</span>
          <span class="feature-name">专业化</span>
        </div>
        <div class="cell traditional-col">
          <span class="negative">单一助手试图万能</span>
        </div>
        <div class="cell s4c-col">
          <span class="positive">专业 Agent 分工协作</span>
        </div>
      </div>
      
      <div class="table-row">
        <div class="cell feature-col">
          <span class="feature-icon">🧩</span>
          <span class="feature-name">复用性</span>
        </div>
        <div class="cell traditional-col">
          <span class="negative">Prompt 内嵌，无法复用</span>
        </div>
        <div class="cell s4c-col">
          <span class="positive">Skill 外置，一次定义处处使用</span>
        </div>
      </div>
      
      <div class="table-row">
        <div class="cell feature-col">
          <span class="feature-icon">✅</span>
          <span class="feature-name">可评估</span>
        </div>
        <div class="cell traditional-col">
          <span class="negative">黑盒操作，无法评估</span>
        </div>
        <div class="cell s4c-col">
          <span class="positive">原子技能可测试，能力可量化</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-comparison {
  max-width: 800px;
  margin: 0 auto;
}

.comparison-table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr;
  background: var(--vp-c-bg-soft);
  border-bottom: 2px solid var(--vp-c-divider);
}

.header-cell {
  padding: 16px 20px;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
}

.header-cell.s4c-col {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr;
  border-bottom: 1px solid var(--vp-c-divider);
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.feature-col {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}

.feature-icon {
  font-size: 20px;
  margin-right: 8px;
}

.traditional-col {
  color: var(--vp-c-text-3);
}

.s4c-col {
  background: var(--vp-c-brand-soft);
}

.positive {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.negative {
  color: var(--vp-c-text-3);
  text-decoration: line-through;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
  
  .header-cell:not(.feature-col),
  .cell:not(.feature-col) {
    border-top: 1px solid var(--vp-c-divider);
  }
}
</style>
