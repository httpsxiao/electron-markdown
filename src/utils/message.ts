import { ipcRenderer } from 'electron'
import Vue from 'vue'

export function ipcSend (name?: string) {
  return function (target: Vue, key: string, descriptor: any) {
    const hyphenate = key.replace(/\B([A-Z])/g, '-$1').toLowerCase()
    const eventName = name || hyphenate
    const original = descriptor.value

    descriptor.value = function (...args: any[]) {
      const result = original.apply(this, args)

      ipcRenderer.send(eventName, result)
    }
  }
}
