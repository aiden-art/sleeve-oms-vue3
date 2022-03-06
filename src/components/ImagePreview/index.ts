import { AppContext, createVNode, render } from 'vue'
import { ElImageViewer } from 'element-plus'
import { uniqueId } from 'lodash'

type ImagePreviewOptionType = {
  id?: string
  urlList: string[]
  zIndex?: number
  initialIndex?: number
  infinite?: boolean
  hideOnClickModal?: boolean
}

let idsMap: string[] = []
let optionMap: ImagePreviewOptionType[] = []

const clearImageViewer = (id?: string): void => {
  if (id) {
    const container = document.getElementById(id)
    optionMap = optionMap.filter((item) => item.id !== id)
    idsMap = idsMap.filter((item) => item !== id)
    if (container) {
      document.body.removeChild(container)
    }
  } else {
    idsMap.forEach((item) => {
      const container = document.getElementById(item)
      if (container) {
        document.body.removeChild(container)
      }
    })
    optionMap = []
    idsMap = []
  }
}

const updateImageViewer = (option: ImagePreviewOptionType): AppContext | undefined => {
  if (!option.id) return
  const container = document.getElementById(option.id)
  if (container) {
    const currentOpt = optionMap.find((item) => item.id === option.id)
    if (currentOpt) {
      option = { ...currentOpt, ...option }
    } else {
      option = { ...option }
    }
    const instance = createVNode(ElImageViewer, option)
    render(instance, container)
    return instance.component?.appContext
  }
}

const mountImageViewer = (option: ImagePreviewOptionType): AppContext | undefined => {
  let _id: string
  if (option.id) {
    _id = option.id
    if (idsMap.find((item) => item === option.id)) {
      return updateImageViewer(option)
    }
  } else {
    _id = uniqueId('image-viewer-')
  }
  option.id = _id
  idsMap.push(option.id)
  optionMap.push(option)
  const container = document.createElement('div')
  container.id = option.id
  const instance = createVNode(ElImageViewer, option)
  render(instance, container)
  //关闭事件绑定
  if (option.hideOnClickModal) {
    container.addEventListener('click', () => {
      clearImageViewer(option.id)
    })
  }
  //关闭按钮绑定事件
  const imageViewerCloseBtn = document.querySelector(`#${_id} .el-image-viewer__close`)
  imageViewerCloseBtn?.addEventListener('click', () => {
    clearImageViewer(option.id)
  })
  document.body.appendChild(container)
  return instance.component?.appContext
}

const ImagePreview = {
  clear: clearImageViewer,
  init: mountImageViewer,
  update: updateImageViewer,
}

export default ImagePreview
