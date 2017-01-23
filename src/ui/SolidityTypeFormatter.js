'use strict'
var yo = require('yo-yo')
var BN = require('ethereumjs-util').BN

module.exports = {
  formatData: formatData,
  extractData: extractData
}

function formatData (key, data) {
  var style = fontColor(data)
  var keyStyle = data.isProperty ? 'color:#847979' : ''
  if (data.type === 'string') {
    data.self = JSON.stringify(data.self)
  }
  return yo`<label style=${keyStyle}>${key}: <label style=${style}>${data.self}</label><label style='font-style:italic'> ${data.isProperty ? '' : data.type}</label></label>`
}

function extractData (item, parent, key) {
  var ret = {}
  if (item.isProperty) {
    return item
  }
  if (item.type.lastIndexOf(']') === item.type.length - 1) {
    ret.children = (item.value || []).map(function (item, index) {
      return {key: index, value: item}
    })
    ret.children.unshift({
      key: 'length',
      value: {
        self: (new BN(item.length.replace('0x', ''), 16)).toString(10),
        type: 'uint',
        isProperty: true
      }
    })
    ret.isArray = true
    ret.self = parent.isArray ? 'Array' : item.type
  } else if (item.type.indexOf('struct') === 0) {
    ret.children = Object.keys((item.value || {})).map(function (key) {
      return {key: key, value: item.value[key]}
    })
    ret.self = item.type
    ret.isStruct = true
  } else {
    ret.children = []
    ret.self = item.value
    ret.type = item.type
  }
  return ret
}

function fontColor (data) {
  var color = '#124B46'
  if (data.isArray || data.isStruct) {
    color = '#847979'
  } else if (data.type.indexOf('uint') === 0 ||
              data.type.indexOf('int') === 0 ||
              data.type.indexOf('bool') === 0 ||
              data.type.indexOf('enum') === 0) {
    color = '#0F0CE9'
  } else if (data.type === 'string') {
    color = '#E91E0C'
  }
  return 'color:' + color
}

