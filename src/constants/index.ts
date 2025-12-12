/**
 * Request success status code
 */
export const SUCCESS_CODE = 0

/**
 * Request content type
 */
export const CONTENT_TYPE: AxiosContentType = 'application/json'

/**
 * Request timeout
 */
export const REQUEST_TIMEOUT = 60000

/**
 * No redirect whitelist
 */
export const NO_REDIRECT_WHITE_LIST = ['/login']

/**
 * No reset route whitelist
 */
export const NO_RESET_WHITE_LIST = ['Redirect', 'RedirectWrap', 'Login', 'NoFind', 'Root']

/**
 * Table default filter column setting field
 */
export const DEFAULT_FILTER_COLUMN = ['expand', 'selection']

/**
 * Whether to automatically convert data format according to headers->content-type
 */
export const TRANSFORM_REQUEST_DATA = true

/**
 * Global icon prefix
 */
export const ICON_PREFIX = 'vi-'
