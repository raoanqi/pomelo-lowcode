<script setup>
  import { ref, onMounted, computed } from 'vue'
  import draggable from 'vuedraggable'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Delete, Edit, Star } from '@element-plus/icons-vue'

  // 发送组件到画布
  const emit = defineEmits(['add-component'])

  // 已保存的组件列表
  const savedComponents = ref([])

  // 当前正在拖拽的组件索引
  const draggingIndex = ref(-1)

  // 加载已保存的组件
  const loadSavedComponents = () => {
    try {
      const saved = localStorage.getItem('saved-components')
      if (saved) {
        savedComponents.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载已保存组件失败:', error)
      ElMessage.error('加载已保存组件失败')
    }
  }

  // 组件初始化时加载已保存的组件
  onMounted(() => {
    loadSavedComponents()
  })

  // 删除组件
  const deleteComponent = index => {
    ElMessageBox.confirm(`确定要删除组件 "${savedComponents.value[index].name}" 吗？`, '删除组件', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        savedComponents.value.splice(index, 1)
        localStorage.setItem('saved-components', JSON.stringify(savedComponents.value))
        ElMessage.success('组件已删除')
      })
      .catch(() => {
        // 用户取消操作
      })
  }

  // 重命名组件
  const renameComponent = index => {
    const component = savedComponents.value[index]
    ElMessageBox.prompt('请输入新的组件名称', '重命名组件', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: component.name,
      inputPattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_-]*$/,
      inputErrorMessage: '组件名称格式不正确（只能包含字母、数字、中文、下划线和连字符，且必须以字母或中文开头）',
    })
      .then(({ value }) => {
        component.name = value
        localStorage.setItem('saved-components', JSON.stringify(savedComponents.value))
        ElMessage.success(`组件已重命名为 "${value}"`)
      })
      .catch(() => {
        // 用户取消操作
      })
  }

  // 拖拽开始事件
  const onDragStart = evt => {
    draggingIndex.value = evt.oldIndex
  }

  // 拖拽结束事件
  const onDragEnd = () => {
    draggingIndex.value = -1
  }

  // 添加组件到画布
  const addToCanvas = component => {
    if (!component || !component.elements || component.elements.length === 0) {
      ElMessage.warning('组件内容为空，无法添加到画布')
      return
    }

    // 遍历组件中的所有元素，添加到画布
    component.elements.forEach(element => {
      // 创建新的ID以避免冲突
      const newElement = {
        ...element,
        id: Date.now() + Math.floor(Math.random() * 1000),
      }
      emit('add-component', newElement)
    })

    ElMessage.success(`组件 "${component.name}" 已添加到画布`)
  }

  // 格式化日期
  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // 计算组件中的元素数量
  const getElementCount = component => {
    return component.elements ? component.elements.length : 0
  }
</script>

<template>
  <div class="saved-components-panel">
    <div class="panel-header">
      <h3>我的组件库</h3>
    </div>

    <div class="component-list" v-if="savedComponents.length > 0">
      <div v-for="(component, index) in savedComponents" :key="index" class="component-item">
        <div class="component-info">
          <div class="component-name">
            <el-icon>
              <Star />
            </el-icon>
            <span>{{ component.name }}</span>
          </div>
          <div class="component-meta">
            <span>{{ getElementCount(component) }}个元素</span>
            <span>{{ formatDate(component.createdAt) }}</span>
          </div>
        </div>
        <div class="component-actions">
          <el-button type="primary" size="small" @click="addToCanvas(component)">使用</el-button>
          <el-button type="info" size="small" @click="renameComponent(index)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="deleteComponent(index)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <div class="empty-list" v-else>
      <el-icon>
        <Star />
      </el-icon>
      <p>暂无已保存的组件</p>
      <p class="tip">在画布中设计组件后，点击"保存为组件"按钮保存</p>
    </div>
  </div>
</template>

<style scoped>
  .saved-components-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
  }

  .panel-header {
    padding: 15px;
    border-bottom: 1px solid #e4e7ed;
    background-color: #fff;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }

  .component-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .component-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .component-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .component-info {
    display: flex;
    flex-direction: column;
  }

  .component-name {
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .component-name .el-icon {
    color: #f7ba2a;
    margin-right: 5px;
  }

  .component-meta {
    display: flex;
    font-size: 12px;
    color: #909399;
  }

  .component-meta span {
    margin-right: 10px;
  }

  .component-actions {
    display: flex;
    gap: 5px;
  }

  .empty-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #909399;
  }

  .empty-list .el-icon {
    font-size: 48px;
    margin-bottom: 10px;
    color: #dcdfe6;
  }

  .empty-list .tip {
    font-size: 12px;
    margin-top: 5px;
  }
</style>
