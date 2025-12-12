<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? 'Enable' : 'Disable'}</ElTag>
}

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'type',
    label: 'MenuClass型',
    span: 24,
    slots: {
      default: (data) => {
        const type = data.type
        return <>{type === 1 ? 'Menu' : 'Directory'}</>
      }
    }
  },
  {
    field: 'parentName',
    label: 'ParentLevelMenu'
  },
  {
    field: 'meta.title',
    label: 'Menu名称'
  },
  {
    field: 'component',
    label: 'Group件',
    slots: {
      default: (data) => {
        const component = data.component
        return (
          <>
            {component === '#'
              ? 'TopLevelDirectory'
              : component === '##'
                ? '子Directory'
                : component}
          </>
        )
      }
    }
  },
  {
    field: 'name',
    label: 'Group件名称'
  },
  {
    field: 'meta.icon',
    label: 'Icon',
    slots: {
      default: (data) => {
        const icon = data.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'path',
    label: 'Path'
  },
  {
    field: 'meta.activeMenu',
    label: '高亮Menu'
  },
  {
    field: 'permissionList',
    label: 'By钮权限',
    span: 24,
    slots: {
      default: (data: any) => (
        <>
          {data?.permissionList?.map((v) => {
            return (
              <ElTag class="mr-1" key={v.value}>
                {v.label}
              </ElTag>
            )
          })}
        </>
      )
    }
  },
  {
    field: 'menuState',
    label: 'MenuStatus',
    slots: {
      default: (data) => {
        return renderTag(data.menuState)
      }
    }
  },
  {
    field: 'meta.hidden',
    label: 'Is否Hide',
    slots: {
      default: (data) => {
        return renderTag(data.enableHidden)
      }
    }
  },
  {
    field: 'meta.alwaysShow',
    label: 'Is否一直Show',
    slots: {
      default: (data) => {
        return renderTag(data.enableDisplay)
      }
    }
  },
  {
    field: 'meta.noCache',
    label: 'Is否ClearCache',
    slots: {
      default: (data) => {
        return renderTag(data.enableCleanCache)
      }
    }
  },
  {
    field: 'meta.breadcrumb',
    label: 'Is否Show面包屑',
    slots: {
      default: (data) => {
        return renderTag(data.enableShowCrumb)
      }
    }
  },
  {
    field: 'meta.affix',
    label: 'Is否固定TagPage',
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'meta.noTagsView',
    label: 'Is否HideTagPage',
    slots: {
      default: (data) => {
        return renderTag(data.enableHiddenTab)
      }
    }
  },
  {
    field: 'meta.canTo',
    label: 'Is否可Jump',
    slots: {
      default: (data) => {
        return renderTag(data.enableSkip)
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
