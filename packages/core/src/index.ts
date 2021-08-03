import * as Store from './stores'
import * as Generate from './generate'
import * as Utils from './share'

export { Store, Generate, Utils }

// Export Type
import {
  ISetGlobal,
  IComponentKeys,
  IFormComProp,
  IMoveableOptions,
  ICommonState,
} from './stores/types'

export type {
  ISetGlobal,
  IComponentKeys,
  IFormComProp,
  IMoveableOptions,
  ICommonState,
}
