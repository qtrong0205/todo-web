const addNoteBTN = document.querySelector(".add-note__btn");
const mainMenu = document.querySelector(".main-menu");
const overlay = document.querySelector(".overlay");
// lấy ra phần tử cần thiết để thêm một note mới
const inputNote = document.querySelector(".main-menu__input");
const applyBtn = document.querySelector(".apply-btn");
addNoteBTN.addEventListener("click", () => {
  inputNote.focus();
  mainMenu.classList.add("active");
  overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  overlay.classList.remove("active");
});

// lấy ra nút cancel
const cancelBtn = document.querySelector(".cancel-btn");
cancelBtn.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  overlay.classList.remove("active");
});

// hàm tạo một note mới
const template = document.getElementById("note-template");

applyBtn.addEventListener("click", () => {
  addNote(inputNote.value);
  mainMenu.classList.remove("active");
  overlay.classList.remove("active");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && mainMenu.classList.contains("active")) {
    addNote(inputNote.value);
    mainMenu.classList.remove("active");
    overlay.classList.remove("active");
  }
});

// hiển thị phần tử khi mới vào trang web
// chỉ render ra màn hình, KHÔNG động đến localStorage
function renderNote(note) {
  const template = document.getElementById("note-template");
  const clone = template.content.cloneNode(true); // copy nguyên note
  clone.querySelector(".note-content__title").textContent = note.info; // chỉnh nội dung
  clone.querySelector(".note-item").setAttribute("id", note.id);

  clone
    .querySelector(".check-complete__label")
    .setAttribute("for", `note${note.id}`);
  clone.querySelector(".check-complete").setAttribute("name", `note${note.id}`);
  clone.querySelector(".check-complete").setAttribute("id", `note${note.id}`);

  // nếu đã hoàn thành thì tự động check vào checkbox
  if (note.completed) {
    clone.querySelector(".check-complete").checked = true;
  }
  document.querySelector(".note-list").appendChild(clone);
}

// thêm note mới, có lưu vào localStorage
function addNote(text) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  const newNote = {
    id: notes.length,
    info: text,
    completed: false,
  };

  notes.push(newNote);

  if (notes.length === 0) {
    document.querySelector(".note-empty").classList.add("is-empty");
  } else {
    document.querySelector(".note-empty").classList.remove("is-empty");
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNote(newNote);
  inputNote.value = "";
}

// load lại note khi mở trang
const notes = JSON.parse(localStorage.getItem("notes")) || [];
notes.forEach((noteItem) => {
  renderNote(noteItem);
});

// ấn vào icon để xoá một note
const noteList = document.querySelector(".note-list");
noteList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    let targetRemove = event.target.closest(".note-item");
    let noteId = targetRemove.getAttribute("id");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Giữ lại những note KHÁC id cần xoá
    notes = notes.filter((note) => note.id != noteId);

    // Lưu lại vào localStorage
    localStorage.setItem("notes", JSON.stringify(notes));

    if (notes.length === 0) {
      document.querySelector(".note-empty").classList.add("is-empty");
    } else {
      document.querySelector(".note-empty").classList.remove("is-empty");
    }

    // Xoá trên UI
    targetRemove.remove();
  }
});

noteList.addEventListener("change", (event) => {
  if (event.target.classList.contains("check-complete")) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    const noteItem = event.target.closest(".note-item");
    const id = parseInt(noteItem.getAttribute("id"), 10);

    notes[id].completed = event.target.checked;

    localStorage.setItem("notes", JSON.stringify(notes));
    console.log("Updated:", notes);
  }
});
