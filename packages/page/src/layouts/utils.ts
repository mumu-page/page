import { BtnTypes } from "."
import { IMode } from "../../../stores/dist"

export const handleColor = (val: BtnTypes, type: BtnTypes) => {
  return {
    color: type !== val ? '#fff' : '',
    fontSize: 18,
  }
}

export const handleBtnType = (val: BtnTypes, type: BtnTypes) => {
  return type === val ? 'primary' : 'text'
}

export const isDisabled = (val: IMode) => {
  return val === 'draw'
}
