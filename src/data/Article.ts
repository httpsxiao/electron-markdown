// import marked from 'marked'

export default class Artical {
  id: string
  filePath: string
  created: string
  updated: string
  content: string
  change: boolean

  constructor (content = '', filePath = '', id = '') {
    const time = '' + Date.now()
    this.id = id || time
    this.created = time
    this.updated = time
    this.change = false
    this.content = content
    this.filePath = filePath
  }
}
