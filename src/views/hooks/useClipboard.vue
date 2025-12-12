<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useClipboard } from '@/hooks/web/useClipboard'
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const { copy, copied, text, isSupported } = useClipboard()

const source = ref('')
</script>

<template>
  <ContentWrap title="useClipboard">
    <ElInput v-model="source" placeholder="PleaseInputWantCopyofContent" />
    <div v-if="isSupported">
      <BaseButton @click="copy(source)" type="primary" class="mt-20px">
        <span v-if="!copied">Copy</span>
        <span v-else>已Copy</span>
      </BaseButton>
      <p>
        WhenBefore已Copy: <code>{{ text || 'none' }}</code>
      </p>
    </div>
    <p v-else> 你of浏览器Not supported Clipboard API </p>
  </ContentWrap>
</template>
