const addNoteBTN = document.querySelector(".add-note__btn");
const mainMenu = document.querySelector(".main-menu");
const overlay = document.querySelector(".overlay");
addNoteBTN.addEventListener("click", () => {
  mainMenu.classList.add("active");
  overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  overlay.classList.remove("active");
});
