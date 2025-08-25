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
    let undoBtn = document.querySelector(".undo");
    let timerSec = document.querySelector(".timer__sec");
    let targetRemove = event.target.closest(".note-item");
    let noteId = targetRemove.getAttribute("id");

    // Ẩn note khỏi UI
    targetRemove.classList.add("is-hidden");

    // Hiện popup undo
    undoBtn.style.display = "flex"

    let sec = 5;
    timerSec.textContent = sec; // reset số giây

    const stopTimer = setInterval(() => {
      sec--;
      timerSec.textContent = sec;

      if (sec < 0) {
        clearInterval(stopTimer);

        // Xoá khỏi localStorage
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes = notes.filter((note) => note.id != noteId);
        localStorage.setItem("notes", JSON.stringify(notes));

        // Ẩn popup undo
         undoBtn.style.display = "none"
      }
    }, 1000);

    // Undo click chỉ cần add 1 lần thôi
    const undoHandler = () => {
      clearInterval(stopTimer);
      targetRemove.classList.remove("is-hidden"); // hiện lại note
      undoBtn.style.display = "none"; // ẩn popup
      undoBtn.removeEventListener("click", undoHandler); // tránh gắn nhiều lần
    };
    undoBtn.addEventListener("click", undoHandler);
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

window.addEventListener("load", function () {
  if (notes.length === 0) {
    document.querySelector(".note-empty").classList.add("is-empty");
  } else {
  }
});

const searchField = document.querySelector(".input-search");
searchField.addEventListener("input", () => {
  let textSearch = searchField.value.toLowerCase(); // thêm toLowerCase để tìm kiếm ko phân biệt hoa/thường
  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  for (let item of notes) {
    let noteElement = document.getElementById(item.id);
    if (!item.info.toLowerCase().includes(textSearch)) {
      noteElement.classList.add("is-hidden");
    } else {
      noteElement.classList.remove("is-hidden");
    }
  }
});
