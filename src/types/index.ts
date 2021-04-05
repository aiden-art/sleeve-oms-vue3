//列表分页
export interface paginationOption {
  pageSize: number
  currentPage: number
  total: number
}

//列表操作
type buttonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

export type operateFunc = (index: number, row: Record<string, unknown>) => any

export interface operateType {
  type: buttonType
  name: string
  func: operateFunc
}
