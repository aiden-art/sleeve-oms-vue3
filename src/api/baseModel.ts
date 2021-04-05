export interface BaseListModel<T> {
  total: number
  items: T[]
  page: number
  count: number
}
