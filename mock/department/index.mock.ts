import { toAnyString } from '@/utils'
import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const departmentList: any = []

const citys = ['Xiamen Headquarters', 'Beijing Branch', 'Shanghai Branch', 'Fuzhou Branch', 'Shenzhen Branch', 'Hangzhou Branch']

for (let i = 0; i < 5; i++) {
  departmentList.push({
    // Department name
    departmentName: citys[i],
    id: toAnyString(),
    createTime: '@datetime',
    // Status
    status: Mock.Random.integer(0, 1),
    // Remark
    remark: '@cword(10, 15)',
    children: [
      {
        // Department name
        departmentName: 'R&D Department',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      },
      {
        // Department name
        departmentName: 'Product Department',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      },
      {
        // Department name
        departmentName: 'Operations Department',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      },
      {
        // Department name
        departmentName: '市场部',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      },
      {
        // Department name
        departmentName: '销售部',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      },
      {
        // Department name
        departmentName: '客服部',
        id: toAnyString(),
        createTime: '@datetime',
        // Status
        status: Mock.Random.integer(0, 1),
        // Remark
        remark: '@cword(10, 15)'
      }
    ]
  })
}

export default [
  // List interface
  {
    url: '/mock/department/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: departmentList
        }
      }
    }
  },
  {
    url: '/mock/department/table/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: departmentList,
          total: 5
        }
      }
    }
  },
  {
    url: '/mock/department/users',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const { pageSize } = query
      // 根据pageSize来创建数据
      const mockList: any = []
      for (let i = 0; i < pageSize; i++) {
        mockList.push(
          Mock.mock({
            // 用户名
            username: '@cname',
            // 账号
            account: '@first',
            // 邮箱
            email: '@EMAIL',
            // 创建时间
            createTime: '@datetime',
            // 用户id
            id: toAnyString()
          })
        )
      }
      return {
        code: SUCCESS_CODE,
        data: {
          total: 100,
          list: mockList
        }
      }
    }
  },
  // Save interface
  {
    url: '/mock/department/user/save',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'success'
      }
    }
  },
  // Delete interface
  {
    url: '/mock/department/user/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: 500,
          message: '请选择需要删除的数据'
        }
      } else {
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  },
  // Save interface
  {
    url: '/mock/department/save',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'success'
      }
    }
  },
  // Delete interface
  {
    url: '/mock/department/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: 500,
          message: '请选择需要删除的数据'
        }
      } else {
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  }
]
