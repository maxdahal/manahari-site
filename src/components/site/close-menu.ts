/* If the phone menu is open, close it first (the menu button toggles it). */
export function closeMenu() {
  const menu = document.getElementById("menu")
  if (menu?.classList.contains("is-open")) {
    document.querySelector<HTMLButtonElement>(".menu-button")?.click()
  }
}
