export let canChosen = {
  value: true,
  set(val: boolean) {
    this.value = val
  },
} // 能否选择，解决点击右上角按钮和列表选中的冲突
