type Optional<T, K extends string> = {
  [Key in Exclude<keyof T, K> as undefined extends T[Key] ? never : Key]: T[Key]
} & {
  [Key in keyof T as undefined extends T[Key]
    ? Key
    : Key extends K
      ? Key
      : never]?: T[Key]
}
