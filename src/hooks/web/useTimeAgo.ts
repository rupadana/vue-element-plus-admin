import { useTimeAgo as useTimeAgoCore, UseTimeAgoMessages } from '@vueuse/core'
import { computed, unref } from 'vue'
import { useLocaleStoreWithOut } from '@/store/modules/locale'

const TIME_AGO_MESSAGE_MAP: {
  'zh-CN': UseTimeAgoMessages
  en: UseTimeAgoMessages
} = {
  'zh-CN': {
    justNow: '刚刚',
    invalid: 'No效When间',
    past: (n) => (n.match(/\d/) ? `${n}Before` : n),
    future: (n) => (n.match(/\d/) ? `${n}After` : n),
    month: (n, past) => (n === 1 ? (past ? 'Last month' : 'Next month') : `${n} months`),
    year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n} 年`),
    day: (n, past) => (n === 1 ? (past ? '昨Day' : '明Day') : `${n} Day`),
    week: (n, past) => (n === 1 ? (past ? 'Last week' : 'Next week') : `${n} 周`),
    hour: (n) => `${n} 小When`,
    minute: (n) => `${n} 分钟`,
    second: (n) => `${n} 秒`
  },
  en: {
    justNow: '刚刚',
    invalid: 'Invalid Date',
    past: (n) => (n.match(/\d/) ? `${n} ago` : n),
    future: (n) => (n.match(/\d/) ? `in ${n}` : n),
    month: (n, past) =>
      n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`,
    year: (n, past) =>
      n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`,
    day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`),
    week: (n, past) =>
      n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`,
    hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
    minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
    second: (n) => `${n} second${n > 1 ? 's' : ''}`
  }
}

export const useTimeAgo = (time: Date | number | string) => {
  const localeStore = useLocaleStoreWithOut()

  const currentLocale = computed(() => localeStore.getCurrentLocale)

  const timeAgo = useTimeAgoCore(time, {
    messages: TIME_AGO_MESSAGE_MAP[unref(currentLocale).lang]
  })

  return timeAgo
}
