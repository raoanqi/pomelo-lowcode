<script setup>
  import { ref, computed, watch } from 'vue'
  import { Setting } from '@element-plus/icons-vue'

  const props = defineProps({
    selectedComponent: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['update-component'])

  // 当前编辑的组件属性
  const currentProps = ref({})
  // 当前编辑的组件样式
  const currentStyle = ref({})

  // 监听选中组件变化
  watch(
    () => props.selectedComponent,
    newComponent => {
      if (newComponent) {
        currentProps.value = { ...newComponent.props }
        currentStyle.value = { ...newComponent.style }
      } else {
        currentProps.value = {}
        currentStyle.value = {}
      }
    },
    { immediate: true },
  )

  // 更新组件属性
  const updateProps = (key, value) => {
    currentProps.value[key] = value
    updateComponent()
  }

  // 更新组件样式
  const updateStyle = (key, value) => {
    currentStyle.value[key] = value
    updateComponent()
  }

  // 发送更新事件
  const updateComponent = () => {
    if (props.selectedComponent) {
      emit('update-component', props.selectedComponent.id, {
        props: { ...currentProps.value },
        style: { ...currentStyle.value },
      })
    }
  }

  // 根据组件类型获取可配置的属性
  const getConfigurableProps = computed(() => {
    if (!props.selectedComponent) return []

    const type = props.selectedComponent.type

    switch (type) {
      case 'el-button':
        return [
          { key: 'text', label: '按钮文本', type: 'input' },
          {
            key: 'type',
            label: '类型',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
              { label: '信息', value: 'info' },
            ],
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '大', value: 'large' },
              { label: '小', value: 'small' },
            ],
          },
          { key: 'round', label: '圆角', type: 'switch' },
          { key: 'plain', label: '朴素', type: 'switch' },
          { key: 'disabled', label: '禁用', type: 'switch' },
        ]
      case 'el-input':
        return [
          { key: 'placeholder', label: '占位文本', type: 'input' },
          { key: 'clearable', label: '可清空', type: 'switch' },
          { key: 'disabled', label: '禁用', type: 'switch' },
          {
            key: 'type',
            label: '类型',
            type: 'select',
            options: [
              { label: '文本', value: 'text' },
              { label: '密码', value: 'password' },
              { label: '数字', value: 'number' },
              { label: '文本域', value: 'textarea' },
            ],
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '大', value: 'large' },
              { label: '小', value: 'small' },
            ],
          },
        ]
      case 'el-select':
        return [
          { key: 'placeholder', label: '占位文本', type: 'input' },
          { key: 'clearable', label: '可清空', type: 'switch' },
          { key: 'disabled', label: '禁用', type: 'switch' },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '大', value: 'large' },
              { label: '小', value: 'small' },
            ],
          },
          { key: 'options', label: '选项', type: 'options' },
        ]
      // 其他组件类型的配置项...
      default:
        return []
    }
  })

  // 获取可配置的样式
  const configurableStyles = [
    { key: 'width', label: '宽度', type: 'input' },
    { key: 'height', label: '高度', type: 'input' },
    { key: 'fontSize', label: '字体大小', type: 'input' },
    { key: 'color', label: '文字颜色', type: 'color' },
    { key: 'backgroundColor', label: '背景颜色', type: 'color' },
    { key: 'borderRadius', label: '边框圆角', type: 'input' },
    { key: 'margin', label: '外边距', type: 'input' },
    { key: 'padding', label: '内边距', type: 'input' },
  ]

  // 处理选项编辑
  const handleOptionsEdit = options => {
    updateProps('options', options)
  }

  // 处理删除选项
  const handleDeleteOption = index => {
    currentProps.value.options.splice(index, 1)
    handleOptionsEdit(currentProps.value.options)
  }

  // 处理添加选项
  const handleAddOption = () => {
    currentProps.value.options.push({ label: '新选项', value: 'new' })
    handleOptionsEdit(currentProps.value.options)
  }
</script>

<template>
  <div class="config-panel">
    <div class="panel-header">
      <h3>配置面板</h3>
    </div>

    <div v-if="selectedComponent" class="config-content">
      <el-tabs>
        <el-tab-pane label="属性">
          <div class="config-section">
            <div v-for="prop in getConfigurableProps" :key="prop.key" class="config-item">
              <div class="config-label">{{ prop.label }}</div>
              <div class="config-value">
                <!-- 输入框 -->
                <el-input
                  v-if="prop.type === 'input'"
                  v-model="currentProps[prop.key]"
                  @change="updateProps(prop.key, $event)"
                  size="small"
                />

                <!-- 选择器 -->
                <el-select
                  v-else-if="prop.type === 'select'"
                  v-model="currentProps[prop.key]"
                  @change="updateProps(prop.key, $event)"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in prop.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>

                <!-- 开关 -->
                <el-switch
                  v-else-if="prop.type === 'switch'"
                  v-model="currentProps[prop.key]"
                  @change="updateProps(prop.key, $event)"
                />

                <!-- 选项编辑器 -->
                <div v-else-if="prop.type === 'options'">
                  <div
                    v-for="(option, index) in currentProps.options"
                    :key="index"
                    class="option-item"
                  >
                    <el-input
                      v-model="option.label"
                      placeholder="标签"
                      size="small"
                      @change="handleOptionsEdit(currentProps.options)"
                    />
                    <el-input
                      v-model="option.value"
                      placeholder="值"
                      size="small"
                      @change="handleOptionsEdit(currentProps.options)"
                    />
                    <el-button
                      type="danger"
                      size="small"
                      icon="Delete"
                      @click="handleDeleteOption(index)"
                    />
                  </div>
                  <el-button type="primary" size="small" @click="handleAddOption()">
                    添加选项
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="样式">
          <div class="config-section">
            <div v-for="style in configurableStyles" :key="style.key" class="config-item">
              <div class="config-label">{{ style.label }}</div>
              <div class="config-value">
                <!-- 颜色选择器 -->
                <el-color-picker
                  v-if="style.type === 'color'"
                  v-model="currentStyle[style.key]"
                  @change="updateStyle(style.key, $event)"
                  size="small"
                />

                <!-- 输入框 -->
                <el-input
                  v-else
                  v-model="currentStyle[style.key]"
                  @change="updateStyle(style.key, $event)"
                  size="small"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else class="empty-config">
      <el-icon>
        <Setting />
      </el-icon>
      <p>请先选择一个组件</p>
    </div>
  </div>
</template>

<style scoped>
  .config-panel {
    width: 300px;
    height: 100%;
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

  .config-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }

  .config-section {
    margin-bottom: 20px;
  }

  .config-item {
    margin-bottom: 15px;
  }

  .config-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 5px;
  }

  .config-value {
    width: 100%;
  }

  .option-item {
    display: flex;
    margin-bottom: 8px;
    gap: 8px;
  }

  .empty-config {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #909399;
  }

  .empty-config .el-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
</style>
