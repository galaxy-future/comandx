/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor', 'root']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}

export function validInputCount(str) {
  let count = 0
  str.split('').forEach((i) => {
    if (/[\u4E00-\u9FA5]/.test(i) || /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]/.test(i)) {
      count += 2
    } else {
      count++
    }
  })
  return count
}

export function validInput(str) {
  let count = 0
  let type = true
  str.split('').forEach((i) => {
    if (/[0-9a-zA-Z]/.test(i)) {
      count++
    } else if (/[\u4E00-\u9FA5]/.test(i)) {
      count += 2
    } else {
      type = false
    }
  })
  return {
    count,
    type
  }
}

export function validInputEnglishAndNumberCount(str) {
  let count = 0
  let type = true
  str.split('').forEach((i) => {
    if (/[0-9a-zA-Z]/.test(i)) {
      count++
    } else {
      type = false
    }
  })
  return {
    count,
    type
  }
}
