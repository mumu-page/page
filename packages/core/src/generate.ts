import { ICommonState, PoolItem, ICommonProps } from '@r-generator/stores'
// import { ALL_FORM_TYPES } from '@r-generator/mapping'
import { getAllType } from '@r-generator/mapping/src/utils'
import { cloneDeep } from 'lodash'

/**
 * 只兼容ANTD的组件
 * 后续考虑抽离通用的
 */
export default class Generator {
  state: ICommonState
  componentList: PoolItem[]
  target: PoolItem
  commonProps: ICommonProps
  code: string = ''
  constructor(state: ICommonState) {
    this.state = state
    this.componentList = state.componentList
    this.commonProps = state.commonProps
    this.target = state.target
  }

  getAllType(componentList: PoolItem[], types = new Set()) {
    return getAllType(componentList, types)
  }

  replaceFirstUpperCase($1: string) {
    return $1.toLocaleUpperCase().replace('-', '')
  }

  getComponentName(type: string) {
    if (type.indexOf('/') !== -1) {
      return type.split('/').map((name) => {
        return name
          .replace(/-([a-z]{1})/, this.replaceFirstUpperCase)
          .replace(/^([a-z]{1})/, this.replaceFirstUpperCase)
      })
    }
    return type
      .replace(/-([a-z]{1})/, this.replaceFirstUpperCase)
      .replace(/^([a-z]{1})/, this.replaceFirstUpperCase)
  }

  getDependency() {
    const { layoutType } = this.state
    const types = this.getAllType(this.componentList)
    const antNames = Array.from(types).map((name) => {
      if (typeof name === 'string') {
        let cname = this.getComponentName(name)
        if (Array.isArray(cname)) {
          // return `${cname[0]}/${cname[1]}`
          return cname[0]
        }
        return cname
      }
      return ''
    })
    if (layoutType === 'flexible') {
      antNames.push('Row')
      antNames.push('Col')
    }
    antNames.push('Form')

    const deps = {
      react: { default: 'React', names: [] },
      antd: {
        default: null,
        names: Array.from(new Set(antNames)),
      },
    }
    return deps
  }

  parseProp(key: string, value: any, result = '') {
    if (!value) return ''
    if (typeof value === 'undefined') return ''
    if (['{}', 'null'].includes(value)) return ''
    try {
      result = JSON.parse(value)
      if (result !== null && ['object', 'number'].includes(typeof result)) {
        result = ` ${key}={${value}}`
      } else if (typeof result === 'boolean') {
        if (result === true) {
          result = ` ${key}`
        } else {
          result = ` ${key}={${value}}`
        }
      } else if (typeof result === 'string') {
        if (value?.indexOf('<') !== -1) {
          result = ` ${key}={${value?.replace?.(/"/g, '')}}`
        } else {
          result = ` ${key}=${value}`
        }
      }
    } catch (e) {
      result = ''
    }
    return result
  }

  generateProps(props: Record<string, any>, result = '') {
    Object.keys(props).forEach((key) => {
      const value = JSON.stringify(props[key])
      result += `${this.parseProp(key, value)}`
    })
    return result
  }

  generateImport() {
    const deps = this.getDependency()
    return Object.entries(deps)
      .map((item) => {
        const [key, value] = item
        let flag = ''
        if (value.default) {
          flag = `${value.default}`
          if (value.names?.length) {
            flag += `,{${value.names}}`
          }
        } else if (value.names?.length) {
          flag += `{${value.names}}`
        }
        return `import ${flag} from '${key}'`
      })
      .join('\n')
  }

  generateComponent(
    componentList = this.componentList,
    isChild: boolean = false
  ): any {
    const { layoutType } = this.state
    const { layout: _layout } = this.commonProps
    let layout = _layout
    // 删除无关属性colNum
    if (!isChild) {
      layout = cloneDeep(_layout)
      Reflect.deleteProperty(layout?.row || {}, 'colNum')
    }
    const code = componentList.map((item, index) => {
      let cname = this.getComponentName(item.type)
      if (Array.isArray(cname)) {
        cname = `${cname[0]}.${cname[1]}`
      }
      const props = this.generateProps(item.props || {})
      let code = [`<${cname}${props}>`, `</${cname}>`]
      // 递归生成子组件
      if (Array.isArray(item.children)) {
        code.splice(1, 0, this.generateComponent(item.children, true))
      } else {
        code = [`<${cname}${props} />`]
      }
      // 如果是弹性布局，给每项组件套一层Col组件
      if (layoutType === 'flexible' && !isChild) {
        code.splice(0, 0, `<Col {...layoutConfig.col}>`)
        code.push(`</Col>`)
      }
      return code.join('\n')
    })
    // 弹性布局模式下 外部套一层Row
    if (layoutType === 'flexible' && !isChild) {
      code.splice(0, 0, `<Row {...layoutConfig.row}>`)
      code.push(`</Row>`)
    }
    if (!isChild) {
      code.splice(0, 0, `return <Form>`)
      code.push(`</Form>`)
      code.splice(0, 0, `export default function Index() {`)
      code.splice(0, 0, `const layoutConfig = ${JSON.stringify(layout)}`)
      code.push(`}`)
    }
    return code.join('\n')
  }

  run() {
    this.code = [this.generateImport(), '', this.generateComponent()].join('\n')
    return this.code
  }
}
