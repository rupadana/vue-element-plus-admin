import { ref, unref, nextTick } from 'vue'
import { FormSchema, FormSetProps } from '@/components/Form'
import { SearchExpose, SearchProps } from '@/components/Search'

export const useSearch = () => {
  // SearchInstance
  const searchRef = ref<SearchExpose>()

  /**
   * @param ref SearchInstance
   * @param elRef ElFormInstance
   */
  const register = (ref: SearchExpose) => {
    searchRef.value = ref
  }

  const getSearch = async () => {
    await nextTick()
    const search = unref(searchRef)
    if (!search) {
      console.error('The Search is not registered. Please use the register method to register')
    }
    return search
  }

  // Some built-in methods
  const methods = {
    /**
     * @description SettingsearchGroup件ofprops
     * @param field FormItemoffield
     */
    setProps: async (props: SearchProps = {}) => {
      const search = await getSearch()
      search?.setProps(props)
      if (props.model) {
        search?.setValues(props.model)
      }
    },

    /**
     * @description SettingformofValue
     * @param data 需WantSettingofData
     */
    setValues: async (data: Recordable) => {
      const search = await getSearch()
      search?.setValues(data)
    },

    /**
     * @description Settingschema
     * @param schemaProps 需WantSettingofschemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const search = await getSearch()
      search?.setSchema(schemaProps)
    },

    /**
     * @description 新增schema
     * @param formSchema 需Want新增Data
     * @param index In哪里新增
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const search = await getSearch()
      search?.addSchema(formSchema, index)
    },

    /**
     * @description Deleteschema
     * @param field Delete哪个Data
     */
    delSchema: async (field: string) => {
      const search = await getSearch()
      search?.delSchema(field)
    },

    /**
     * @description GetTable单Data
     * @returns form data
     */
    getFormData: async <T = Recordable>(): Promise<T> => {
      const search = await getSearch()
      return search?.getFormData() as T
    }
  }

  return {
    searchRegister: register,
    searchMethods: methods
  }
}
