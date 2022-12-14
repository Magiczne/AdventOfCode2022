const intersection = <T>(array1: Array<T>, array2: Array<T>): Array<T> => {
  return array1.filter(value => {
    return array2.includes(value)
  })
}

const windows = <T>(array: Array<T>, windowLength: number): Array<Array<T>> => {
  return array
    .map((_, index) => {
      if (index <= array.length - windowLength) {
        return array.slice(index, index + windowLength)
      }

      return []
    })
    .filter(window => window.length > 0)
}

export {
  intersection,
  windows
}
