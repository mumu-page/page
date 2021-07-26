export interface PreviewInstanceProps {
  open: () => void
  close: () => void
  tsxEditor: any
  lessEditor: any
  setTsxCode: React.Dispatch<React.SetStateAction<string>>
  setLessCode?: React.Dispatch<React.SetStateAction<string>>
  run: () => void
}

export interface PreviewProps {}
