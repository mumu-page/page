import { ICommonState } from './types'

export const INITAL_STATE: ICommonState = {
  target: {
    layout: {
      frame: { translate: [0, 0] },
    },
  },
  componentList: [],
  moveableOptions: {
    elClassName: null,
    frame: { translate: [0, 0] },
  },
  mode: 'assemble',
  actionType: 'form-pool',
  setGlobal: (arg) => {},
}
