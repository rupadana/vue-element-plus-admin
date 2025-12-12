import { ref } from 'vue'

export const useResize = (props?: {
  minHeightPx?: number
  minWidthPx?: number
  initHeight?: number
  initWidth?: number
}) => {
  const {
    minHeightPx = 400,
    minWidthPx = window.innerWidth / 2,
    initHeight = 400,
    initWidth = window.innerWidth / 2
  } = props || {}
  // 屏幕宽度of 50% 作为Minimum宽度
  //   const minWidthPx = window.innerWidth / 2
  // 固定ofMinimum高度 400px
  //   const minHeightPx = 400
  // Initial高度Limit为 400px
  const maxHeight = ref(initHeight + 'px')
  // Initial宽度Limit为 50%
  const minWidth = ref(initWidth + 'px')
  const setupDrag = (elDialog: any, el: any) => {
    // Get对话BoxElement
    // Is否正InAdjustSizeof标志
    let isResizing = false
    // WhenBeforeAdjustof方向
    let currentResizeDirection = ''

    // 鼠标MoveWhenof事件Process器，Used forDetect鼠标Position并SettingCorrespondingof光标Style
    const handleMouseMove = (e: any) => {
      const rect = elDialog.getBoundingClientRect()
      // 鼠标相For对话Box左侧of偏移Amount
      const offsetX = e.clientX - rect.left
      // 鼠标相For对话BoxTop部of偏移Amount
      const offsetY = e.clientY - rect.top
      const width = elDialog.clientWidth
      const height = elDialog.clientHeight

      // Get对话Boxof内边距
      const computedStyle = window.getComputedStyle(elDialog)
      const paddingLeft = parseFloat(computedStyle.paddingLeft)
      const paddingRight = parseFloat(computedStyle.paddingRight)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)
      const paddingTop = parseFloat(computedStyle.paddingTop)

      // According to鼠标PositionSettingCorrespondingof光标StyleAndAdjust方向
      if (!isResizing) {
        if (offsetX < paddingLeft && offsetY > paddingTop && offsetY < height - paddingBottom) {
          elDialog.style.cursor = 'ew-resize' // 左右箭头
          currentResizeDirection = 'left'
        } else if (
          offsetX > width - paddingRight &&
          offsetY > paddingTop &&
          offsetY < height - paddingBottom
        ) {
          elDialog.style.cursor = 'ew-resize' // 左右箭头
          currentResizeDirection = 'right'
        } else if (
          offsetY < paddingTop &&
          offsetX > paddingLeft &&
          offsetX < width - paddingRight
        ) {
          elDialog.style.cursor = 'ns-resize' // Up and down arrows
          currentResizeDirection = 'top'
        } else if (
          offsetY > height - paddingBottom &&
          offsetX > paddingLeft &&
          offsetX < width - paddingRight
        ) {
          elDialog.style.cursor = 'ns-resize' // Up and down arrows
          currentResizeDirection = 'bottom'
        } else if (offsetX < paddingLeft && offsetY < paddingTop) {
          elDialog.style.cursor = 'nwse-resize' // 左上右下箭头
          currentResizeDirection = 'top-left'
        } else if (offsetX > width - paddingRight && offsetY < paddingTop) {
          elDialog.style.cursor = 'nesw-resize' // 右上左下箭头
          currentResizeDirection = 'top-right'
        } else if (offsetX < paddingLeft && offsetY > height - paddingBottom) {
          elDialog.style.cursor = 'nesw-resize' // 右上左下箭头
          currentResizeDirection = 'bottom-left'
        } else if (offsetX > width - paddingRight && offsetY > height - paddingBottom) {
          elDialog.style.cursor = 'nwse-resize' // 左上右下箭头
          currentResizeDirection = 'bottom-right'
        } else {
          elDialog.style.cursor = 'default'
          currentResizeDirection = ''
        }
      }
    }

    // 鼠标By下Whenof事件Process器，StartAdjust对话BoxSize
    const handleMouseDown = (e) => {
      if (currentResizeDirection) {
        isResizing = true

        const initialX = e.clientX
        const initialY = e.clientY
        const initialWidth = elDialog.clientWidth
        const initialHeight = el.querySelector('.el-dialog__body').clientHeight

        // AdjustSizeof事件Process器
        const handleResizing = (e: any) => {
          if (!isResizing) return

          let newWidth = initialWidth
          let newHeight = initialHeight

          // According toWhenBeforeAdjust方向Calculate新of宽度And高度
          if (currentResizeDirection.includes('right')) {
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
          }

          if (currentResizeDirection.includes('left')) {
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
          }

          if (currentResizeDirection.includes('bottom')) {
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }

          if (currentResizeDirection.includes('top')) {
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }

          if (currentResizeDirection === 'top-left') {
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }

          if (currentResizeDirection === 'top-right') {
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }

          if (currentResizeDirection === 'bottom-left') {
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }

          if (currentResizeDirection === 'bottom-right') {
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px`
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px`
          }
        }
        // 停止AdjustSizeof事件Process器
        const stopResizing = () => {
          isResizing = false
          document.removeEventListener('mousemove', handleResizing)
          document.removeEventListener('mouseup', stopResizing)
        }

        document.addEventListener('mousemove', handleResizing)
        document.addEventListener('mouseup', stopResizing)
      }
    }
    elDialog.addEventListener('mousemove', handleMouseMove)
    elDialog.addEventListener('mousedown', handleMouseDown)
  }

  return {
    setupDrag,
    maxHeight,
    minWidth
  }
}
