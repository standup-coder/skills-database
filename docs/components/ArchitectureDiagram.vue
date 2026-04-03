<template>
  <div class="architecture-diagram">
    <!-- Role Layer -->
    <div class="layer role-layer">
      <div class="layer-header">
        <span class="layer-icon">🎯</span>
        <h3>Role (岗位)</h3>
        <span class="layer-badge">JD = Skills 集合</span>
      </div>
      <div class="layer-content">
        <div class="item-group">
          <div class="item">Senior Frontend Dev</div>
          <div class="item">Backend Architect</div>
          <div class="item">QA Engineer</div>
          <div class="item">SRE</div>
        </div>
      </div>
    </div>

    <!-- Arrow -->
    <div class="arrow-container">
      <div class="arrow">↓</div>
      <span class="arrow-label">组合调用</span>
    </div>

    <!-- Skills Layer -->
    <div class="layer skill-layer">
      <div class="layer-header">
        <span class="layer-icon">🧩</span>
        <h3>Composite Skills</h3>
        <span class="layer-badge">可复用模块</span>
      </div>
      <div class="layer-content">
        <div class="item-group">
          <div class="item">Code Review</div>
          <div class="item">API Design</div>
          <div class="item">Architecture</div>
          <div class="item">Testing</div>
        </div>
      </div>
    </div>

    <!-- Arrow -->
    <div class="arrow-container">
      <div class="arrow">↓</div>
      <span class="arrow-label">编排执行</span>
    </div>

    <!-- Atomic Layer -->
    <div class="layer atomic-layer">
      <div class="layer-header">
        <span class="layer-icon">⚡</span>
        <h3>Atomic Skills</h3>
        <span class="layer-badge">基础操作</span>
      </div>
      <div class="layer-content">
        <div class="item-group">
          <div class="item">read_file</div>
          <div class="item">write_code</div>
          <div class="item">run_tests</div>
          <div class="item">git_commit</div>
        </div>
      </div>
    </div>

    <!-- Multi-Agent -->
    <div class="multi-agent-banner">
      <span class="banner-icon">🤖</span>
      <span class="banner-text">Multi-Agent 协作 = 专业团队完成复杂项目</span>
    </div>
  </div>
</template>

<style scoped>
.architecture-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
}

.layer {
  width: 100%;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.layer:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.layer-icon {
  font-size: 28px;
}

.layer h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.layer-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
}

.role-layer {
  background: linear-gradient(135deg, #326CE5 0%, #5c8af5 100%);
  color: white;
  border: 2px solid #326CE5;
}

.skill-layer {
  background: linear-gradient(135deg, #00B4D8 0%, #5ce1e6 100%);
  color: white;
  border: 2px solid #00B4D8;
}

.atomic-layer {
  background: linear-gradient(135deg, #FF6B35 0%, #ff8c61 100%);
  color: white;
  border: 2px solid #FF6B35;
}

.item-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.item {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.arrow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.arrow {
  font-size: 24px;
  color: #64748b;
  font-weight: 700;
}

.arrow-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.multi-agent-banner {
  margin-top: 24px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #326CE5 0%, #00B4D8 50%, #FF6B35 100%);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(50, 108, 229, 0.3);
}

.banner-icon {
  font-size: 24px;
}

@media (max-width: 640px) {
  .layer-header {
    flex-wrap: wrap;
  }
  
  .layer-badge {
    width: 100%;
    margin-top: 8px;
  }
  
  .item {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
