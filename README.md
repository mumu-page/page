<div align='center'>
    <h1>React Visual Editor</h1>
    <p>基于Ant Design的表单可视化编辑器</p>
</div>

[在线设计](https://resonances.gitee.io/react-visual-editor)

## 特性
- 通过简单的拖拽即可实现页面布局(所见即所得)
- 支持控件80%的配置功能
- 支持代码生成、复制、下载功能(做表单从此So Easy)

## TODO
- [ ] 控件属性设置完善
- [ ] 代码文件下载功能
- [ ] 代码复制功能
- [ ] 拖拽栅格布局(行容器)
- [ ] 切换日期类组件前时特殊处理值
- [x] 基于useReducer状态持久化hook

## 遇到问题
- [ ] 首次拖动到编辑区时有明显的卡顿?
- [ ] 编辑器需要支持Typescript XML, 可以安装插件吗？
- [ ] 多个代码模块(tsx、scss)怎么展示在页面上呢？
- [ ] 代码下载时怎么把多个文件整合成一个压缩包呢？
- [x] 如果当前拖拽数据中有默认值, 则拖拽一个级联控件会报错?  
    - 已解决: 级联控件的displayRender方法导致
    

