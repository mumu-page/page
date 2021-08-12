import { shortid } from '@r-generator/shared'
import { ICommonState } from './types'

export const INITAL_STATE: ICommonState = {
  target: {
    id: shortid(),
    type: '',
    label: '',
  },
  componentList: [],
  moveableOptions: {
    elClassName: null,
    frame: { translate: [0, 0] },
  },
  mode: 'assemble',
  actionType: 'form-pool',
  layoutType: 'flexible',
  commonProps: {
    layout: {
      row: { gutter: 20, colNum: '3' },
      col: {},
    },
    form: {},
  },
  setGlobal: (arg) => {},
}
