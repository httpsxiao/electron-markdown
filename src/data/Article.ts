// import marked from 'marked'

export default class Artical {
  id: string
  filePath: string
  created: string
  updated: string
  content: string

  constructor (content = '', filePath = '', id = '') {
    const time = '' + Date.now()
    this.id = id || time
    this.created = time
    this.updated = time
    this.content = content
    this.filePath = filePath
  }
}
