export const navigateToElement = (elementId: string): void => {
  const element = document.querySelector(`#${elementId}`)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
