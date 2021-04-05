export interface BannerItemModel {
  id: number
  name: string
  img: string
  keyword: string
  type: number
  banner_id: number
}

export interface BannerModel {
  id: number
  name: string
  title: string
  description: string
  img: string
  items?: BannerItemModel[]
}
