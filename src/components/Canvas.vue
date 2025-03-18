<script setup>
  import { ref, computed, h } from 'vue'
  import draggable from 'vuedraggable'
  import {
    ElButton,
    ElInput,
    ElSelect,
    ElOption,
    ElSwitch,
    ElRadio,
    ElRadioGroup,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElTimePicker,
    ElSlider,
    ElRate,
  } from 'element-plus'
  import { Plus, Download, Star } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const props = defineProps({
    components: {
      type: Array,
      required: true,
    },
    selectedComponent: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['select-component', 'update-component'])

  // 使用计算属性处理组件列表
  const componentList = computed({
    get: () => props.components,
    set: newValue => {
      console.log('Canvas componentList updated:', newValue)
      emit('update-component', null, { components: newValue })
    },
  })

  // 选择组件
  const selectComponent = component => {
    emit('select-component', component)
  }

  // 是否选中
  const isSelected = component => {
    return props.selectedComponent && props.selectedComponent.id === component.id
  }

  // 渲染组件
  const renderComponent = component => {
    // 检查组件是否有效
    if (!component || !component.type) {
      console.error('Invalid component:', component)
      return null
    }

    // 确保 props 和 style 存在
    const props = component.props || {}
    const style = component.style || {}

    console.log('Rendering component:', component.type, props, style)

    switch (component.type) {
      case 'el-button':
        return h(
          ElButton,
          {
            type: props.type || 'default',
            size: props.size || 'default',
            round: props.round || false,
            plain: props.plain || false,
            disabled: props.disabled || false,
            style: style,
          },
          () => props.text || 'Button',
        )
      case 'el-input':
        return h(ElInput, {
          placeholder: props.placeholder || '请输入内容',
          clearable: props.clearable !== undefined ? props.clearable : true,
          disabled: props.disabled || false,
          type: props.type || 'text',
          size: props.size || 'default',
          style: style,
        })
      case 'el-select':
        return h(
          ElSelect,
          {
            placeholder: props.placeholder || '请选择',
            clearable: props.clearable !== undefined ? props.clearable : true,
            disabled: props.disabled || false,
            size: props.size || 'default',
            style: style,
          },
          () =>
            (props.options || []).map(option =>
              h(ElOption, {
                key: option.value,
                label: option.label,
                value: option.value,
              }),
            ),
        )
      case 'el-switch':
        return h(ElSwitch, {
          'active-text': props.activeText || '',
          'inactive-text': props.inactiveText || '',
          disabled: props.disabled || false,
          style: style,
        })
      case 'el-radio-group':
        return h(
          ElRadioGroup,
          {
            disabled: props.disabled || false,
            style: style,
            modelValue: props.value || '',
          },
          () =>
            (props.options || []).map(option =>
              h(
                ElRadio,
                {
                  key: option.value,
                  label: option.value,
                },
                () => option.label,
              ),
            ),
        )
      case 'el-checkbox-group':
        return h(
          ElCheckboxGroup,
          {
            disabled: props.disabled || false,
            style: style,
          },
          () =>
            (props.options || []).map(option =>
              h(
                ElCheckbox,
                {
                  key: option.value,
                  label: option.value,
                },
                () => option.label,
              ),
            ),
        )
      case 'el-date-picker':
        return h(ElDatePicker, {
          type: props.type || 'date',
          placeholder: props.placeholder || '选择日期',
          format: props.format || 'YYYY-MM-DD',
          disabled: props.disabled || false,
          style: style,
        })
      case 'el-slider':
        return h(ElSlider, {
          min: props.min !== undefined ? props.min : 0,
          max: props.max !== undefined ? props.max : 100,
          step: props.step !== undefined ? props.step : 1,
          'show-stops': props.showStops || false,
          disabled: props.disabled || false,
          style: style,
        })
      case 'el-rate':
        return h(ElRate, {
          max: props.max !== undefined ? props.max : 5,
          disabled: props.disabled || false,
          'allow-half': props.allowHalf || false,
          'show-text': props.showText || false,
          style: style,
        })
      default:
        console.warn('Unknown component type:', component.type)
        return null
    }
  }

  // 处理组件位置更新
  const handlePositionUpdate = evt => {
    // 可以在这里处理组件位置的更新
    console.log('Position updated', evt)
    // 确保更新后的组件列表被保存
    if (evt.moved) {
      emit('update-component', null, { components: [...componentList.value] })
    }
  }

  // 记录拖拽变化事件
  const handleDraggableChange = e => {
    console.log('Draggable change event:', e)
  }

  // 记录添加组件事件
  const handleDraggableAdd = e => {
    console.log('Draggable add event:', e)
  }

  // 导出画布内容为JSON
  const exportToJSON = () => {
    try {
      // 创建一个包含画布组件的对象
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        components: props.components,
      }

      // 将对象转换为JSON字符串，并格式化
      const jsonString = JSON.stringify(exportData, null, 2)

      // 创建Blob对象
      const blob = new Blob([jsonString], { type: 'application/json' })

      // 创建下载链接
      const url = URL.createObjectURL(blob)

      // 创建a标签并模拟点击下载
      const link = document.createElement('a')
      link.href = url
      link.download = `low-code-export-${new Date().getTime()}.json`
      document.body.appendChild(link)
      link.click()

      // 清理
      URL.revokeObjectURL(url)
      document.body.removeChild(link)

      // 提示用户
      ElMessage.success('JSON文件导出成功')
    } catch (error) {
      console.error('导出JSON失败:', error)
      ElMessage.error('导出JSON失败')
    }
  }

  // 保存为组件
  const saveAsComponent = () => {
    if (props.components.length === 0) {
      ElMessage.warning('画布为空，无法保存组件')
      return
    }

    ElMessageBox.prompt('请输入组件名称', '保存为我的组件', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_-]*$/,
      inputErrorMessage:
        '组件名称格式不正确（只能包含字母、数字、中文、下划线和连字符，且必须以字母或中文开头）',
    })
      .then(({ value }) => {
        // 创建组件对象
        const componentData = {
          name: value,
          createdAt: new Date().toISOString(),
          elements: [...props.components],
        }

        // 获取已保存的组件列表
        let savedComponents = localStorage.getItem('saved-components')
        if (savedComponents) {
          savedComponents = JSON.parse(savedComponents)
        } else {
          savedComponents = []
        }

        // 检查是否已存在同名组件
        const existingIndex = savedComponents.findIndex(comp => comp.name === value)
        if (existingIndex >= 0) {
          // 更新已存在的组件
          savedComponents[existingIndex] = componentData
          ElMessage.success(`组件 "${value}" 已更新`)
        } else {
          // 添加新组件
          savedComponents.push(componentData)
          ElMessage.success(`组件 "${value}" 已保存`)
        }

        // 保存到本地存储
        localStorage.setItem('saved-components', JSON.stringify(savedComponents))
      })
      .catch(() => {
        // 用户取消操作
      })
  }
</script>

<template>
  <div class="canvas-container">
    <div class="canvas-header">
      <h3>画布</h3>
      <div class="canvas-actions">
        <el-tooltip content="导出当前画布内容为JSON" placement="top">
          <ElButton @click="exportToJSON" type="success" size="small">
            <el-icon>
              <Download />
            </el-icon>
            导出JSON
          </ElButton>
        </el-tooltip>
        <el-tooltip content="保存为我的组件" placement="top">
          <ElButton @click="saveAsComponent" type="primary" size="small">
            <el-icon>
              <Star />
            </el-icon>
            保存为我的组件
          </ElButton>
        </el-tooltip>
      </div>
    </div>

    <div class="canvas">
      <draggable
        v-model="componentList"
        group="components"
        item-key="id"
        class="canvas-content"
        @end="handlePositionUpdate"
        @change="handleDraggableChange"
        @add="handleDraggableAdd"
      >
        <template #item="{ element }">
          <div
            v-if="element && element.type"
            class="canvas-item"
            :class="{ selected: isSelected(element) }"
            @click="selectComponent(element)"
          >
            <component :is="renderComponent(element)" v-if="renderComponent(element)" />
            <el-alert v-else title="组件渲染失败" type="warning" :closable="false" show-icon />
          </div>
          <div v-else class="canvas-item invalid-component">
            <el-alert title="无效组件" type="error" :closable="false" show-icon />
          </div>
        </template>
      </draggable>

      <div v-if="componentList.length === 0" class="empty-canvas">
        <el-icon>
          <Plus />
        </el-icon>
        <p>从左侧拖入组件到此处</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .canvas-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e4e7ed;
    background-color: #fff;
    min-width: 0;
    /* 防止内容溢出 */
  }

  .canvas-header {
    padding: 15px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .canvas-header h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }

  .canvas {
    flex: 1;
    position: relative;
    overflow: auto;
    padding: 20px;
    background-color: #f5f7fa;
  }

  .canvas-content {
    min-height: 100%;
    background-color: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    padding: 20px;
  }

  .canvas-item {
    position: relative;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px dashed transparent;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .canvas-item:hover {
    border-color: #409eff;
  }

  .canvas-item.selected {
    border-color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }

  .empty-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #909399;
  }

  .empty-canvas .el-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  .invalid-component {
    border: 1px dashed #f56c6c;
    background-color: rgba(245, 108, 108, 0.1);
    padding: 10px;
    text-align: center;
  }
</style>
