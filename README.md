<div align='center'>
    <h1>React Visual Editor</h1>
    <p>基于Ant Design的表单可视化编辑器</p>
</div>

[开始设计](https://resonances.gitee.io/react-visual-editor)

## 是什么
一款组件可视化编辑器，旨在提升开发项目的效率，它支持生成可以直接使用的模板代码。

最近很忙，一有时间就会更新哒～^～

## 支持在项目中嵌入
### 1.安装
```sh
yarn add react-visual-editor
```
### 2.使用组件
```tsx
import ReactVisualEditor from 'react-visual-editor'
import 'react-visual-editor/dist/index.css'

export default function Home() {
  return <ReactVisualEditor />
}

```
  
## Preview

![alt 属性文本](./docs/imgs/截屏2021-03-11%20下午7.24.33.png "预览")

![alt 属性文本](./docs/imgs/截屏2021-03-11%20下午7.24.58.png "首页")

![alt 属性文本](./docs/imgs/截屏2021-03-11%20下午7.25.09.png "控件面板")

![alt 属性文本](./docs/imgs/截屏2021-03-11%20下午7.25.31.png "设计区")

## TODO
- [ ] 控件属性完善
- [ ] 表单常见CRUD模板生成
- [ ] 支持其他自定义组件的代码生成
- [ ] 表单分割区标题、表单列表输入支持
- [ ] 页面生成独立预览链接(考虑使用服务端渲染)

## 关于
[如何提升开发与设计表单类页面时的效率](https://www.yuque.com/docs/share/74964a3f-2290-4958-b9a4-26fb137fd6f3?#%20)

[awesome-lowcode](https://github.com/taowen/awesome-lowcode)

## no code / low code / pro code

一切的改进都是源自于人类的缺陷

no code：自己编程给自己用，给用户的感觉是一个更强大的办公/实用软件。主要的手段是用图形化操作等方式降低学习曲线。no code 一定要面向非常固定的领域才能做到好用。

low code：编程给其他人用，为此创造了一个 citizen developer 的概念。主要的手段是平台预制好常见的需求，减少需要从头写的代码。low code 也要面向指定的领域才能让平台提前预测需求，但相比 no code 可以不把使用场景限定得那么死。

pro code：low code 的平台自己不会选择 low code 来创建这个平台本身，因为 low code 并没有降低从头构建一个系统的成本。但是 pro code 的平台自己会选择 pro code 来创建这个平台本身，比如 react 开发者会选择用 react 来创建自己的开发工具，因为 pro code 的工具和平台都是以从根本上降低从头构建一个系统的复杂度为目标的。