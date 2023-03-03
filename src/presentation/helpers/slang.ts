export function slang(data: string): string {
  return data.toLowerCase().replace(/\s/g, '-')
}
