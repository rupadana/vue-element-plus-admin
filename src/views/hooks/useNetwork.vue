<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useNetwork } from '@/hooks/web/useNetwork'

const { online } = useNetwork()
</script>

<template>
  <ContentWrap title="useNetwork">
    Current Network Status: <code>{{ online ? 'Connected' : 'Disconnected' }}</code>
  </ContentWrap>
</template>
