<script setup>
  import { ref, computed } from 'vue'
  import {
    ElButton,
    ElInput,
    ElSelect,
    ElSwitch,
    ElRadio,
    ElCheckbox,
    ElDatePicker,
    ElTimePicker,
    ElSlider,
    ElRate,
  } from 'element-plus'
  import draggable from 'vuedraggable'
  import SavedComponentsPanel from './SavedComponentsPanel.vue'

  // 定义可用的Element Plus组件
  const componentList = ref([
    {
      type: 'el-button',
      name: '按钮',
      icon: 'Pointer',
      defaultProps: {
        type: 'primary',
        size: 'default',
        text: '按钮',
        round: false,
        plain: false,
        disabled: false,
      },
      defaultStyle: {
        width: '80px',
        height: '40px',
        fontSize: '14px',
      },
    },
    {
      type: 'el-input',
      name: '输入框',
      icon: 'Edit',
      defaultProps: {
        placeholder: '请输入内容',
        clearable: true,
        disabled: false,
        type: 'text',
        size: 'default',
      },
      defaultStyle: {
        width: '200px',
        height: '40px',
      },
    },
    {
      type: 'el-select',
      name: '选择器',
      icon: 'Select',
      defaultProps: {
        placeholder: '请选择',
        clearable: true,
        disabled: false,
        size: 'default',
        options: [
          { value: 'option1', label: '选项1' },
          { value: 'option2', label: '选项2' },
          { value: 'option3', label: '选项3' },
        ],
      },
      defaultStyle: {
        width: '200px',
        height: '40px',
      },
    },
    {
      type: 'el-switch',
      name: '开关',
      icon: 'Switch',
      defaultProps: {
        activeText: '开启',
        inactiveText: '关闭',
        disabled: false,
      },
      defaultStyle: {
        width: '80px',
        height: '40px',
      },
    },
    {
      type: 'el-radio-group',
      name: '单选框组',
      icon: 'CircleCheck',
      defaultProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
        disabled: false,
      },
      defaultStyle: {
        width: '300px',
        height: '40px',
      },
    },
    {
      type: 'el-checkbox-group',
      name: '复选框组',
      icon: 'Check',
      defaultProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
        disabled: false,
      },
      defaultStyle: {
        width: '300px',
        height: '40px',
      },
    },
    {
      type: 'el-date-picker',
      name: '日期选择器',
      icon: 'Calendar',
      defaultProps: {
        type: 'date',
        placeholder: '选择日期',
        format: 'YYYY-MM-DD',
        disabled: false,
      },
      defaultStyle: {
        width: '200px',
        height: '40px',
      },
    },
    {
      type: 'el-slider',
      name: '滑块',
      icon: 'Operation',
      defaultProps: {
        min: 0,
        max: 100,
        step: 1,
        showStops: false,
        disabled: false,
      },
      defaultStyle: {
        width: '200px',
        height: '40px',
      },
    },
    {
      type: 'el-rate',
      name: '评分',
      icon: 'Star',
      defaultProps: {
        max: 5,
        disabled: false,
        allowHalf: false,
        showText: false,
      },
      defaultStyle: {
        width: '200px',
        height: '40px',
      },
    },
  ])

  // 组件分类
  const categories = [
    { name: '基础组件', components: ['el-button', 'el-input'] },
    {
      name: '表单组件',
      components: ['el-select', 'el-switch', 'el-radio-group', 'el-checkbox-group', 'el-date-picker', 'el-slider', 'el-rate'],
    },
  ]

  // 当前选中的分类
  const activeCategory = ref('全部组件')

  // 当前选中的面板
  const activePanel = ref('components') // 'components' 或 'saved'

  // 根据分类筛选组件
  const filteredComponents = computed(() => {
    if (activeCategory.value === '全部组件') {
      return componentList.value
    }

    const category = categories.find(c => c.name === activeCategory.value)
    if (category) {
      return componentList.value.filter(comp => category.components.includes(comp.type))
    }

    return componentList.value
  })

  // 当前正在拖拽的组件索引
  const draggingIndex = ref(-1)

  // 拖拽开始事件
  const onDragStart = evt => {
    draggingIndex.value = evt.oldIndex
  }

  // 拖拽结束事件
  const onDragEnd = () => {
    draggingIndex.value = -1
  }

  // 克隆组件
  const cloneComponent = component => {
    if (!component) {
      console.error('Cannot clone undefined component')
      return null
    }

    try {
      const cloned = JSON.parse(JSON.stringify(component))
      // 确保克隆的组件具有所有必要的属性
      if (!cloned.type) {
        console.error('Cloned component missing type:', cloned)
      }
      if (!cloned.defaultProps) {
        console.error('Cloned component missing defaultProps:', cloned)
        cloned.defaultProps = {}
      }
      if (!cloned.defaultStyle) {
        console.error('Cloned component missing defaultStyle:', cloned)
        cloned.defaultStyle = {}
      }
      return cloned
    } catch (error) {
      console.error('Error cloning component:', error)
      return null
    }
  }

  // 发送组件到画布
  const emit = defineEmits(['add-component'])

  const onDragAdd = evt => {
    console.log('Drag add event:', evt)
    if (evt.oldIndex !== undefined && componentList.value[evt.oldIndex]) {
      const component = cloneComponent(componentList.value[evt.oldIndex])
      console.log('Adding component to canvas:', component)
      emit('add-component', component)
      // 阻止实际添加到列表中
      evt.preventDefault()
    }
  }
</script>

<template>
  <div class="component-panel">
    <div class="panel-header">
      <h3>组件库</h3>
    </div>

    <div class="panel-tabs">
      <el-radio-group v-model="activePanel" size="small">
        <el-radio-button value="components" label="组件库" />
        <el-radio-button value="saved" label="我的组件" />
      </el-radio-group>
    </div>

    <!-- 标准组件库面板 -->
    <div v-if="activePanel === 'components'" class="standard-components">
      <div class="category-tabs">
        <el-radio-group v-model="activeCategory" size="small">
          <el-radio-button value="全部组件" label="全部组件" />
          <el-radio-button v-for="category in categories" :key="category.name" :value="category.name" :label="category.name" />
        </el-radio-group>
      </div>

      <div class="component-list">
        <draggable
          :list="filteredComponents"
          :group="{ name: 'components', pull: 'clone', put: false }"
          item-key="type"
          :clone="cloneComponent"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          @add="onDragAdd"
          :sort="false"
        >
          <template #item="{ element, index }">
            <div class="component-item" :class="{ dragging: index === draggingIndex }">
              <el-icon>
                <component :is="element.icon"></component>
              </el-icon>
              <span>{{ element.name }}</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 已保存组件面板 -->
    <div v-else-if="activePanel === 'saved'" class="saved-components">
      <SavedComponentsPanel @add-component="$emit('add-component', $event)" />
    </div>
  </div>
</template>

<style scoped>
  .component-panel {
    width: 250px;
    height: 100%;
    border-right: 1px solid #e4e7ed;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .panel-header {
    padding: 15px;
    border-bottom: 1px solid #e4e7ed;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }

  .panel-tabs {
    padding: 10px 15px;
    border-bottom: 1px solid #e4e7ed;
    background-color: #fff;
  }

  .category-tabs {
    padding: 10px 15px;
    border-bottom: 1px solid #e4e7ed;
  }

  .standard-components {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .saved-components {
    flex: 1;
    display: flex;
  }

  .component-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .component-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: move;
    transition: all 0.3s;
  }

  .component-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .component-item .el-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #409eff;
  }

  .dragging {
    opacity: 0.5;
  }
</style>
