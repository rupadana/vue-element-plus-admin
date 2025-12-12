import { reactive } from 'vue'
import { eachTree, treeMap, filter } from '@/utils/tree'
import { FormSchema } from '@/components/Form'
import { TableColumn } from '@/components/Table'
import { DescriptionsSchema } from '@/components/Descriptions'

export type CrudSchema = Omit<TableColumn, 'children'> & {
  search?: CrudSearchParams
  table?: CrudTableParams
  form?: CrudFormParams
  detail?: CrudDescriptionsParams
  children?: CrudSchema[]
}

interface CrudSearchParams extends Omit<FormSchema, 'field'> {
  // Is否HideInQueryItem
  hidden?: boolean
}

interface CrudTableParams extends Omit<TableColumn, 'field'> {
  // Is否HideTable头
  hidden?: boolean
}

interface CrudFormParams extends Omit<FormSchema, 'field'> {
  // Is否HideTable单Item
  hidden?: boolean
}

interface CrudDescriptionsParams extends Omit<DescriptionsSchema, 'field'> {
  // Is否HideTable单Item
  hidden?: boolean
}

interface AllSchemas {
  searchSchema: FormSchema[]
  tableColumns: TableColumn[]
  formSchema: FormSchema[]
  detailSchema: DescriptionsSchema[]
}

/**
 * @deprecated Not recommended，感觉过于繁琐，Not very flexible May会In某个版本中Delete
 */
export const useCrudSchemas = (
  crudSchema: CrudSchema[]
): {
  allSchemas: AllSchemas
} => {
  // AllStructureData
  const allSchemas = reactive<AllSchemas>({
    searchSchema: [],
    tableColumns: [],
    formSchema: [],
    detailSchema: []
  })

  const searchSchema = filterSearchSchema(crudSchema)
  // @ts-ignore
  allSchemas.searchSchema = searchSchema || []

  const tableColumns = filterTableSchema(crudSchema)
  allSchemas.tableColumns = tableColumns || []

  const formSchema = filterFormSchema(crudSchema)
  allSchemas.formSchema = formSchema

  const detailSchema = filterDescriptionsSchema(crudSchema)
  allSchemas.detailSchema = detailSchema

  return {
    allSchemas
  }
}

// Filter Search Structure
const filterSearchSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
  const searchSchema: FormSchema[] = []
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    const schemaItem = crudSchema[i]
    if (schemaItem.search?.hidden === true) {
      continue
    }
    // 判断Is否Hide
    const searchSchemaItem = {
      component: schemaItem?.search?.component || 'Input',
      ...schemaItem.search,
      field: schemaItem.field,
      label: schemaItem.search?.label || schemaItem.label
    }

    searchSchema.push(searchSchemaItem)
  }

  return searchSchema
}

// Filter table Structure
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
  const tableColumns = treeMap<CrudSchema>(crudSchema, {
    conversion: (schema: CrudSchema) => {
      if (!schema?.table?.hidden) {
        return {
          ...schema,
          ...schema.table
        }
      }
    }
  })

  // 第一次Filter会Have undefined 所以需Want二次Filter
  return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
    if (data.children === void 0) {
      delete data.children
    }
    return !!data.field
  })
}

// Filter form Structure
const filterFormSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
  const formSchema: FormSchema[] = []
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    const formItem = crudSchema[i]
    const formSchemaItem = {
      component: formItem?.form?.component || 'Input',
      ...formItem.form,
      field: formItem.field,
      label: formItem.form?.label || formItem.label
    }

    formSchema.push(formSchemaItem)
  }

  return formSchema
}

// Filter descriptions Structure
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
  const descriptionsSchema: FormSchema[] = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // 判断Is否Hide
    if (!schemaItem?.detail?.hidden) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail,
        field: schemaItem.field,
        label: schemaItem.detail?.label || schemaItem.label
      }

      // Delete不必WantofField
      delete descriptionsSchemaItem.hidden

      descriptionsSchema.push(descriptionsSchemaItem)
    }
  })

  return descriptionsSchema
}
