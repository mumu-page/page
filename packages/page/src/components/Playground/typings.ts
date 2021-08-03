export interface PreviewInstanceProps {
  open: () => void
  close: () => void
  setIndexCode: React.Dispatch<React.SetStateAction<string>>
  setLessCode?: React.Dispatch<React.SetStateAction<string>>
  run: () => void
}

export interface PreviewProps {}
