<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useNetwork } from '@/hooks/web/useNetwork'

const { online } = useNetwork()
</script>

<template>
  <ContentWrap title="useNetwork">
    WhenBeforeNetworkStatus: <code>{{ online ? '已Connect' : '已断开' }}</code>
  </ContentWrap>
</template>
