export const canChosen = {
  value: true,
  set(val: boolean) {
    this.value = val;
  },
}; // 能否选择，解决点击右上角按钮和列表选中的冲突

export const canAddCol = {
  value: true,
  set(val: boolean) {
    this.value = val;
  },
}; // 能否添加行容器
