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
  setTitle(`分析Page-${new Date().getTime().toString()}`, '/dashboard/analysis')
}
</script>

<template>
  <ContentWrap title="useTagsView">
    <BaseButton type="primary" @click="closeAllTabs"> CloseAllTagPage </BaseButton>
    <BaseButton type="primary" @click="closeLeftTabs"> Close左侧TagPage </BaseButton>
    <BaseButton type="primary" @click="closeRightTabs"> Close右侧TagPage </BaseButton>
    <BaseButton type="primary" @click="closeOtherTabs"> Close其他TagPage </BaseButton>
    <BaseButton type="primary" @click="closeCurrentTab"> CloseWhenBeforeTagPage </BaseButton>
    <BaseButton type="primary" @click="refresh"> 刷新WhenBeforeTagPage </BaseButton>
    <BaseButton type="primary" @click="setTabTitle"> ModifyWhenBeforeTitle </BaseButton>
    <BaseButton type="primary" @click="setAnalysisTitle"> Modify分析PageTitle </BaseButton>
  </ContentWrap>
</template>
