// import marked from 'marked'

export default class Artical {
  id: string
  filePath: string
  created: string
  updated: string
  private _content = ''

  constructor (content = '', filePath = '') {
    const time = '' + Date.now()
    this.id = time
    this.created = time
    this.updated = time
    this._content = content
    this.filePath = filePath
  }

  get content () {
    return this._content
  }

  set content (value) {
    this.updated = '' + Date.now()
    this._content = value
  }
}
