<script setup>
  import { ref } from 'vue'
  import ComponentPanel from './components/ComponentPanel.vue'
  import Canvas from './components/Canvas.vue'
  import ConfigPanel from './components/ConfigPanel.vue'
  import { User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'

  // 存储画布上的组件
  const canvasComponents = ref([])

  // 当前选中的组件
  const selectedComponent = ref(null)

  // 处理组件选中
  const handleSelectComponent = component => {
    selectedComponent.value = component
  }

  // 处理组件添加到画布
  const handleAddComponent = component => {
    // 检查组件是否有效
    if (!component || !component.type) {
      console.error('Cannot add invalid component to canvas:', component)
      return
    }

    // 创建新组件，确保结构完整
    const newComponent = {
      id: Date.now(),
      type: component.type,
      props: {},
      style: {},
    }

    // 复制默认属性
    if (component.defaultProps) {
      Object.keys(component.defaultProps).forEach(key => {
        newComponent.props[key] = component.defaultProps[key]
      })
    }

    // 复制默认样式
    if (component.defaultStyle) {
      Object.keys(component.defaultStyle).forEach(key => {
        newComponent.style[key] = component.defaultStyle[key]
      })
    }

    console.log('Adding new component to canvas:', newComponent)
    canvasComponents.value.push(newComponent)
  }

  // 处理组件配置更新
  const handleUpdateComponent = (id, updates) => {
    console.log('Update component:', id, updates)

    // 如果是整个组件列表的更新
    if (id === null && updates.components) {
      console.log('Updating entire component list:', updates.components)
      canvasComponents.value = [...updates.components]
      return
    }

    // 如果是单个组件的更新
    const index = canvasComponents.value.findIndex(comp => comp.id === id)
    if (index !== -1) {
      canvasComponents.value[index] = {
        ...canvasComponents.value[index],
        ...updates,
      }
    }
  }
</script>

<template>
  <div class="low-code-generator">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <img src="./assets/logo.svg" alt="Logo" />
        <h2>Element Plus 低代码生成器</h2>
      </div>
      <div class="user-info">
        <el-dropdown trigger="click">
          <div class="user-profile">
            <div class="avatar">
              <img
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                alt="Avatar"
              />
            </div>
            <div class="user-details">
              <span class="username">饶安琪</span>
            </div>
            <el-icon class="dropdown-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon>
                  <User />
                </el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon>
                  <Setting />
                </el-icon>
                账号设置
              </el-dropdown-item>
              <el-dropdown-item divided>
                <el-icon>
                  <SwitchButton />
                </el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- Container -->
    <div class="container">
      <!-- 左侧组件面板 -->
      <ComponentPanel @add-component="handleAddComponent" />

      <!-- 中间画布 -->
      <Canvas
        :components="canvasComponents"
        :selected-component="selectedComponent"
        @select-component="handleSelectComponent"
        @update-component="handleUpdateComponent"
      />

      <!-- 右侧配置面板 -->
      <ConfigPanel
        :selected-component="selectedComponent"
        @update-component="handleUpdateComponent"
      />
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>
        ©2025 Element Plus 低代码生成器 |
        <span class="footer-link">隐私政策</span>
        |
        <span class="footer-link">使用条款</span>
        | 联系邮箱：
        <a href="mailto:1518014096@qq.com">1518014096@qq.com</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
  .low-code-generator {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }

  .header {
    height: 60px;
    background-color: #409eff;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo img {
    height: 40px;
    margin-right: 10px;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .user-profile {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .user-profile:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    border: 2px solid rgba(255, 255, 255, 0.8);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }

  .username {
    font-size: 14px;
    font-weight: 500;
  }

  .dropdown-icon {
    margin-left: 5px;
    font-size: 12px;
  }

  .container {
    flex: 1;
    display: flex;
    overflow: hidden;
    width: 100%;
  }

  .footer {
    height: 40px;
    background-color: #2c3e50;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .footer p {
    margin: 0;
    opacity: 0.8;
  }

  .footer a {
    color: #409eff;
    text-decoration: none;
    margin-left: 5px;
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .footer-link {
    cursor: pointer;
    transition: color 0.3s;
  }

  .footer-link:hover {
    color: #409eff;
    text-decoration: underline;
  }
</style>
