import request from '@/axios'

// GetAllDictionary
export const getDictApi = () => {
  return request.get({ url: '/mock/dict/list' })
}

// MockGet某个Dictionary
export const getDictOneApi = async () => {
  return request.get({ url: '/mock/dict/one' })
}
