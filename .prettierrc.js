// Prettier配置文件
// 详细配置项说明：https://prettier.io/docs/en/options.html

export default {
  // 是否在语句末尾添加分号，false表示不添加
  semi: false,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 多行时尽可能打印尾随逗号，"all"表示对象、数组等场景都尽可能使用尾随逗号
  trailingComma: 'all',
  // 每行代码最大长度，超出会自动换行
  printWidth: 130,
  // 缩进空格数
  tabWidth: 2,
  // 行尾使用 LF（换行）而不是 CRLF（回车加换行）
  endOfLine: 'lf',
  // 箭头函数的参数是否加括号，"avoid"表示尽可能省略括号（如单参数时）
  arrowParens: 'avoid',
  // HTML空白敏感度，"ignore"表示忽略HTML文件中的空格
  htmlWhitespaceSensitivity: 'ignore',
  // 是否缩进Vue文件中的<script>和<style>标签内容
  vueIndentScriptAndStyle: true,
}
