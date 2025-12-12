<script lang="tsx" setup>
import { propTypes } from '@/utils/propTypes'
import { computed, getCurrentInstance, onMounted, unref, useAttrs, useSlots } from 'vue'
import Dialog from './Dialog.vue'
import { useResize } from '../hooks/useResize'

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  initWidth: propTypes.number.def(window.innerWidth / 2),
  initHeight: propTypes.number.def(200),
  minResizeWidth: propTypes.number.def(window.innerWidth / 2),
  minResizeHeight: propTypes.number.def(200)
})
const { maxHeight, minWidth, setupDrag } = useResize({
  minHeightPx: props.minResizeHeight,
  minWidthPx: props.minResizeWidth,
  initHeight: props.initHeight,
  initWidth: props.initWidth
})

const vResize = {
  mounted(el) {
    const observer = new MutationObserver(() => {
      const elDialog = el.querySelector('.el-dialog')

      if (elDialog) {
        // In确认 `elDialog` 已RenderAfterPerformProcess
        setupDrag(elDialog, el)
        // observer.disconnect() // Once the element is obtained，停止观察
      }
    })
    // Start观察子Nodeof变化
    observer.observe(el, { childList: true, subtree: true })
  }
}

const attrs = useAttrs()
const slots = useSlots()
const getBindValue = computed(() => {
  const delArr: string[] = ['maxHeight', 'width']
  const obj = Object.assign({}, { ...unref(attrs), ...props })
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})
const instance = getCurrentInstance()
const initDirective = () => {
  const directives = instance?.appContext?.app._context?.directives

  // Check指令Is否已经Register
  if (!directives || !directives['resize']) {
    instance?.appContext?.app.directive('resize', vResize)
  }
}
onMounted(() => {
  initDirective()
})
</script>
<template>
  <div v-resize>
    <Dialog v-bind="getBindValue" :maxHeight="maxHeight" :width="minWidth">
      <slot></slot>
      <template v-if="slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </Dialog>
  </div>
</template>
