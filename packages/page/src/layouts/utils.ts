import { IActionType, IMode } from '../../../stores/dist'

export const handleColor = (val: IActionType, type: IActionType) => {
  return {
    color: type !== val ? '#fff' : '',
    fontSize: 18,
  }
}

export const handleBtnType = (val: IActionType, type: IActionType) => {
  return type === val ? 'primary' : 'text'
}

export const isDisabled = (val: IMode) => {
  return val === 'draw'
}
