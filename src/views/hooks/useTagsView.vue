<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useTagsView } from '@/hooks/web/useTagsView'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage, setTitle } =
  useTagsView()

const closeAllTabs = () => {
  closeAll(() => {
    push('/dashboard/analysis')
  })
}

const closeLeftTabs = () => {
  closeLeft()
}

const closeRightTabs = () => {
  closeRight()
}

const closeOtherTabs = () => {
  closeOther()
}

const refresh = () => {
  refreshPage()
}

const closeCurrentTab = () => {
  closeCurrent(undefined, () => {
    push('/dashboard/analysis')
  })
}

const setTabTitle = () => {
  setTitle(new Date().getTime().toString())
}

const setAnalysisTitle = () => {
  setTitle(`Analysis Page-${new Date().getTime().toString()}`, '/dashboard/analysis')
}
</script>

<template>
  <ContentWrap title="useTagsView">
    <BaseButton type="primary" @click="closeAllTabs"> Close All Tabs </BaseButton>
    <BaseButton type="primary" @click="closeLeftTabs"> Close Left Tabs </BaseButton>
    <BaseButton type="primary" @click="closeRightTabs"> Close Right Tabs </BaseButton>
    <BaseButton type="primary" @click="closeOtherTabs"> Close Other Tabs </BaseButton>
    <BaseButton type="primary" @click="closeCurrentTab"> Close Current Tab </BaseButton>
    <BaseButton type="primary" @click="refresh"> Refresh Current Tab </BaseButton>
    <BaseButton type="primary" @click="setTabTitle"> Modify Current Title </BaseButton>
    <BaseButton type="primary" @click="setAnalysisTitle"> Modify Analysis Page Title </BaseButton>
  </ContentWrap>
</template>
