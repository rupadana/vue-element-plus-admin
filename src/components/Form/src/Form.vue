<script lang="tsx">
import { PropType, defineComponent, ref, computed, unref, watch, onMounted } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  FormRules,
  ComponentSize
  // FormItemProp
} from 'element-plus'
import { componentMap } from './helper/componentMap'
import { propTypes } from '@/utils/propTypes'
import { getSlot } from '@/utils/tsxHelper'
import {
  setTextPlaceholder,
  setGridProp,
  setComponentProps,
  setItemComponentSlots,
  initModel
} from './helper'
import { useRenderSelect } from './components/useRenderSelect'
import { useRenderRadio } from './components/useRenderRadio'
import { useRenderCheckbox } from './components/useRenderCheckbox'
import { useDesign } from '@/hooks/web/useDesign'
import { findIndex } from '@/utils'
import { get, set } from 'lodash-es'
import { FormProps } from './types'
import {
  FormSchema,
  FormSetProps,
  ComponentNameEnum,
  SelectComponentProps,
  RadioGroupComponentProps,
  CheckboxGroupComponentProps
} from './types'

const { renderSelectOptions } = useRenderSelect()
const { renderRadioOptions } = useRenderRadio()
const { renderCheckboxOptions } = useRenderCheckbox()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('form')

export default defineComponent({
  name: 'Form',
  props: {
    // Generate Form layout structure array
    schema: {
      type: Array as PropType<FormSchema[]>,
      default: () => []
    },
    // Whether grid layout is needed
    isCol: propTypes.bool.def(true),
    // Form data object
    model: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    // Whether to automatically set placeholder
    autoSetPlaceholder: propTypes.bool.def(true),
    // Whether to customize content
    isCustom: propTypes.bool.def(false),
    // Form label width
    labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({})
    },
    labelPosition: propTypes.oneOf(['left', 'right', 'top']).def('right'),
    labelSuffix: propTypes.string.def(''),
    hideRequiredAsterisk: propTypes.bool.def(false),
    requireAsteriskPosition: propTypes.oneOf(['left', 'right']).def('left'),
    showMessage: propTypes.bool.def(true),
    inlineMessage: propTypes.bool.def(false),
    statusIcon: propTypes.bool.def(false),
    validateOnRuleChange: propTypes.bool.def(true),
    size: {
      type: String as PropType<ComponentSize>,
      default: undefined
    },
    disabled: propTypes.bool.def(false),
    scrollToError: propTypes.bool.def(false),
    scrollToErrorOffset: propTypes.oneOfType([Boolean, Object]).def(undefined)
    // onValidate: {
    //   type: Function as PropType<(prop: FormItemProp, isValid: boolean, message: string) => void>,
    //   default: () => {}
    // }
  },
  emits: ['register'],
  setup(props, { slots, expose, emit }) {
    // Element form instance
    const elFormRef = ref<ComponentRef<typeof ElForm>>()

    const mergeProps = ref<FormProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // Store form instance
    const formComponents = ref({})

    // Store form-item instance
    const formItemComponents = ref({})

    // Form data
    const formModel = ref<Recordable>(props.model)

    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
    })

    // 对Table单赋Value
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data)
    }

    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }

    const delSchema = (field: string) => {
      const { schema } = unref(getProps)

      const index = findIndex(schema, (v: FormSchema) => v.field === field)
      if (index > -1) {
        schema.splice(index, 1)
      }
    }

    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps)
      if (index !== void 0) {
        schema.splice(index, 0, formSchema)
        return
      }
      schema.push(formSchema)
    }

    const setSchema = (schemaProps: FormSetProps[]) => {
      const { schema } = unref(getProps)
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          }
        }
      }
    }

    const getOptions = async (fn: Function, item: FormSchema) => {
      const options = await fn()
      if (!options || options.length == 0) return
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT ||
            item.component === ComponentNameEnum.TRANSFER
              ? 'componentProps.data'
              : 'componentProps.options',
          value: options
        }
      ])
    }

    /**
     * @description: GetTable单Group件Instance
     * @param filed Table单Field
     */
    const getComponentExpose = (filed: string) => {
      return unref(formComponents)[filed]
    }

    /**
     * @description: GetformItemInstance
     * @param filed Table单Field
     */
    const getFormItemExpose = (filed: string) => {
      return unref(formItemComponents)[filed]
    }

    const setComponentRefMap = (ref: any, filed: string) => {
      formComponents.value[filed] = ref
    }

    const setFormItemRefMap = (ref: any, filed: string) => {
      formItemComponents.value[filed] = ref
    }

    expose({
      setValues,
      formModel,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getComponentExpose,
      getFormItemExpose
    })

    // ListenTable单Structure化Array，ReGenerateformModel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel))
      },
      {
        immediate: true,
        deep: true
      }
    )

    // Render包裹Tag，Is否UseGridLayout
    const renderWrap = () => {
      const { isCol } = unref(getProps)
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
      ) : (
        renderFormItemWrap()
      )
      return content
    }

    // Is否WantRenderel-col
    const renderFormItemWrap = () => {
      // hiddenPropertyTable示Hide，No rendering
      const { schema = [], isCol } = unref(getProps)

      return schema
        .filter((v) => !v.remove)
        .map((item) => {
          // Such as果Is Divider Group件，需WantOwn占用一行
          const isDivider = item.component === 'Divider'
          const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            // Such as果需WantGrid，需Want包裹 ElCol
            <ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol>
          ) : (
            renderFormItem(item)
          )
        })
    }

    // RenderformItem
    const renderFormItem = (item: FormSchema) => {
      // Such as果HaveoptionApi，优FirstUseoptionApi, 并且optionsDoes not existOrOrIs emptyArray
      if (
        item.optionApi &&
        (!item.componentProps?.options || !item.componentProps?.options.length)
      ) {
        // 内部AutoCallInterface，Does not affect other rendering
        getOptions(item.optionApi, item)
      }
      const formItemSlots: Recordable = {
        default: () => {
          if (item?.formItemProps?.slots?.default) {
            return item?.formItemProps?.slots?.default(formModel.value)
          } else {
            const Com = componentMap[item.component as string] as ReturnType<typeof defineComponent>

            const { autoSetPlaceholder } = unref(getProps)

            const componentSlots = (item?.componentProps as any)?.slots || {}
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots)
            }
            // // Such as果IsselectGroup件，并且没Have自DefineTemplate，AutoRenderoptions
            if (item.component === ComponentNameEnum.SELECT) {
              slotsMap.default = !componentSlots.default
                ? () => renderSelectOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as SelectComponentProps)?.options)
                    )
                  }
            }

            // 虚拟ColumnTable
            if (item.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
              slotsMap.default = ({ item }) => {
                return componentSlots.default(item)
              }
            }

            // RadioBoxGroupAndBy钮Style
            if (
              item.component === ComponentNameEnum.RADIO_GROUP ||
              item.component === ComponentNameEnum.RADIO_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderRadioOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as CheckboxGroupComponentProps)?.options)
                    )
                  }
            }

            // Multiple selectBoxGroupAndBy钮Style
            if (
              item.component === ComponentNameEnum.CHECKBOX_GROUP ||
              item.component === ComponentNameEnum.CHECKBOX_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderCheckboxOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as RadioGroupComponentProps)?.options)
                    )
                  }
            }

            const Comp = () => {
              // Such as果fieldIs多层Path，需WantConvert成Object
              const itemVal = computed({
                get: () => {
                  return get(formModel.value, item.field)
                },
                set: (val) => {
                  set(formModel.value, item.field, val)
                }
              })

              return item.component === ComponentNameEnum.UPLOAD ? (
                <Com
                  vModel:file-list={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%'
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              ) : (
                <Com
                  vModel={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%'
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }

            return <>{Comp()}</>
          }
        }
      }
      if (item?.formItemProps?.slots?.label) {
        formItemSlots.label = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.label(...args)
        }
      }
      if (item?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.error(...args)
        }
      }
      return (
        <ElFormItem
          v-show={!item.hidden}
          ref={(el: any) => setFormItemRefMap(el, item.field)}
          {...(item.formItemProps || {})}
          prop={item.field}
          label={item.label || ''}
        >
          {formItemSlots}
        </ElFormItem>
      )
    }

    // FilterPass inFormGroup件ofProperty
    const getFormBindValue = () => {
      // 避免InTag上Appear多余ofProperty
      const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props as FormProps
    }

    return () => (
      <ElForm
        ref={elFormRef}
        {...getFormBindValue()}
        model={unref(getProps).isCustom ? unref(getProps).model : formModel}
        class={prefixCls}
        // @ts-ignore
        onSubmit={(e: Event) => {
          e.preventDefault()
        }}
      >
        {{
          // Such as果需Want自Define，就什么都不Render，而Is提供DefaultSlot
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderWrap()
          }
        }}
      </ElForm>
    )
  }
})
</script>

<style lang="less" scoped>
.@{elNamespace}-form.@{adminNamespace}-form .@{elNamespace}-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.@{elNamespace}-form--inline {
  :deep(.el-form-item__content) {
    & > :first-child {
      min-width: 229.5px;
    }
  }
  .@{elNamespace}-input-number {
    // 229.5pxIs兼容el-input-numberofMinimum宽度,
    min-width: 229.5px;
  }
}
</style>
