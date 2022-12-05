const isUpperCase = (value: string): boolean => {
  return value === value.toUpperCase()
}

const isUpperCaseLetter = (value: string): boolean => {
  return value === value.toUpperCase() && value !== value.toLowerCase()
}

export {
  isUpperCase,
  isUpperCaseLetter
}
