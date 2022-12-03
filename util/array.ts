const intersection = <T>(array1: Array<T>, array2: Array<T>): Array<T> => {
  return array1.filter(value => {
    return array2.includes(value)
  })
}

export {
  intersection
}
