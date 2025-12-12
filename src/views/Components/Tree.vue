<script setup lang="tsx">
import { Icon } from '@/components/Icon'
import { Tree } from '@/components/Tree'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const { t } = useI18n()
const treeData = ref([
  {
    id: 1,
    name: '北京',
    children: [
      {
        id: 5,
        name: '朝阳',
        children: [
          {
            id: 17,
            name: '双塔',
            children: []
          },
          {
            id: 18,
            name: '龙城',
            children: []
          }
        ]
      },
      {
        id: 6,
        name: '丰台',
        children: [
          {
            id: 19,
            name: '新村',
            children: []
          },
          {
            id: 20,
            name: '大红门',
            children: []
          },
          {
            id: 21,
            name: '长辛店',
            children: [
              {
                id: 22,
                name: '东山坡',
                children: []
              },
              {
                id: 23,
                name: '北关',
                children: []
              },
              {
                id: 24,
                name: '光明里',
                children: []
              },
              {
                id: 25,
                name: '赵辛店',
                children: []
              },
              {
                id: 26,
                name: '西峰寺',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 7,
        name: '海淀',
        children: []
      },
      {
        id: 8,
        name: '房山',
        children: []
      },
      {
        id: 10,
        name: '顺义',
        children: []
      }
    ]
  },
  {
    id: 2,
    name: '上海',
    children: [
      {
        id: 11,
        name: '黄埔',
        children: []
      },
      {
        id: 12,
        name: '徐汇',
        children: []
      }
    ]
  },
  {
    id: 3,
    name: '广州',
    children: [
      {
        id: 13,
        name: '荔湾',
        children: []
      },
      {
        id: 14,
        name: '白云',
        children: []
      },
      {
        id: 15,
        name: '越秀',
        children: []
      },
      {
        id: 16,
        name: '南沙',
        children: []
      }
    ]
  }
])

const handleNodeClick = (data: any) => {
  console.log('Node clicked:', data)
}

const addOrg = (node: any) => {
  ElMessageBox.prompt('PleaseInputGroup名称', '添加子Group', {
    confirmButtonText: '确定',
    cancelButtonText: 'Cancel',
    inputPattern: /\S/,
    inputErrorMessage: 'Group名称不能Is empty'
  }).then(({ value }) => {
    node.children.push({
      id: node.children.length + 1,
      name: value,
      children: []
    })
    ElMessage.success('添加Success')
  })
}
const editOrg = (node: any) => {
  ElMessageBox.prompt('PleaseInput新ofGroup名称', 'ModifyGroup名称', {
    confirmButtonText: '确定',
    cancelButtonText: 'Cancel',
    inputValue: node.name,
    inputPattern: /\S/,
    inputErrorMessage: 'Group名称不能Is empty'
  }).then(({ value }) => {
    node.name = value
    ElMessage.success('ModifySuccess')
  })
}

const deleteOrg = (node: any) => {
  ElMessageBox.confirm(`Delete [${node.name}] Group、Subordinate subgroup <br>Is否继续?`, 'Tip', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    cancelButtonText: 'Cancel',
    type: 'warning',
    center: true
  }).then(() => {
    const id = node.id
    // Find treeData Corresponding node in，并Delete
    const deleteNode = (data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data.splice(i, 1)
          return
        }
        if (data[i].children) {
          deleteNode(data[i].children)
        }
      }
    }
    deleteNode(treeData.value)
    ElMessage.success('DeleteSuccess')
  })
}
</script>

<template>
  <ContentWrap :title="t('treeDemo.treeTitle')" :message="t('qrcodeDemo.qrcodeDes')">
    <Tree
      :data="treeData"
      :tree-props="{
        highlightCurrent: true,
        nodeKey: 'id',
        props: {
          children: 'children',
          label: 'name'
        }
      }"
      width="300px"
      height="400px"
      @node-click="handleNodeClick"
    >
      <!-- 自Define右KeyMenu -->
      <template #context-menu="{ node }">
        <div class="menuItem" @click="addOrg(node)">
          <Icon icon="ep:plus" style="color: #1e9fff" />
          <span>添加子Group</span>
        </div>
        <div class="menuItem" @click="editOrg(node)">
          <Icon icon="ep:edit-pen" style="color: #1e9fff" />
          ModifyGroup名称
        </div>
        <div class="menuItem" @click="deleteOrg(node)">
          <Icon icon="ep:delete" style="color: #1e9fff" />
          DeleteGroup及子Group
        </div>
      </template>

      <!-- 自DefineNodeShow -->
      <!-- <template #render-node="{ node }">
      <span v-if="node.isLeaf">[FILE] {{ node.label }}</span>
      <span v-else>[FOLDER] {{ node.label }}</span>
    </template> -->
    </Tree>
  </ContentWrap>
</template>
<style lang="less" scoped>
.menuItem {
  display: flex;
  padding: 2px 10px;
  text-align: left;
  box-sizing: border-box;
  align-items: center; /* 垂直居中 */
  gap: 5px; /* IconAnd文字之间of间距，可According to需WantAdjust */
}

.menuItem:hover {
  cursor: pointer;
  background-color: #eee;
}
</style>
