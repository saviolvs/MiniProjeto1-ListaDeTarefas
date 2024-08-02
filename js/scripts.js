// Seleção de elementos
const SListForm = document.querySelector("#SList-form");
const SListInput = document.querySelector("#SList-input");
const SList = document.querySelector("#SList-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveSList = (text, done = 0, save = 1) => {
  const SListItem = document.createElement("div");
  SListItem.classList.add("SList");

  const SListTitle = document.createElement("h3");
  SListTitle.innerText = text;
  SListItem.appendChild(SListTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-SList");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  SListItem.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-SList");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  SListItem.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-SList");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  SListItem.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    SListItem.classList.add("done");
  }

  if (save) {
    saveSListLocalStorage({ text, done: 0 });
  }

  SList.appendChild(SListItem);

  SListInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  SListForm.classList.toggle("hide");
  SList.classList.toggle("hide");
};

const updateSList = (text) => {
  const SLists = document.querySelectorAll(".SList");

  SLists.forEach((SListItem) => {
    let SListTitle = SListItem.querySelector("h3");

    if (SListTitle.innerText === oldInputValue) {
      SListTitle.innerText = text;

      // Utilizando dados da localStorage
      updateSListLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedSLists = (search) => {
  const SLists = document.querySelectorAll(".SList");

  SLists.forEach((SListItem) => {
    const SListTitle = SListItem.querySelector("h3").innerText.toLowerCase();

    SListItem.style.display = "flex";

    if (!SListTitle.includes(search)) {
      SListItem.style.display = "none";
    }
  });
};

const filterSLists = (filterValue) => {
  const SLists = document.querySelectorAll(".SList");

  switch (filterValue) {
    case "all":
      SLists.forEach((SListItem) => (SListItem.style.display = "flex"));
      break;

    case "done":
      SLists.forEach((SListItem) =>
        SListItem.classList.contains("done")
          ? (SListItem.style.display = "flex")
          : (SListItem.style.display = "none")
      );
      break;

    case "SList":
      SLists.forEach((SListItem) =>
        !SListItem.classList.contains("done")
          ? (SListItem.style.display = "flex")
          : (SListItem.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
SListForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = SListInput.value;

  if (inputValue) {
    saveSList(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let SListTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    SListTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-SList")) {
    parentEl.classList.toggle("done");

    updateSListStatusLocalStorage(SListTitle);
  }

  if (targetEl.classList.contains("remove-SList")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeSListLocalStorage(SListTitle);
  }

  if (targetEl.classList.contains("edit-SList")) {
    toggleForms();

    editInput.value = SListTitle;
    oldInputValue = SListTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateSList(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedSLists(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterSLists(filterValue);
});

// Local Storage
const getSListsLocalStorage = () => {
  const SLists = JSON.parse(localStorage.getItem("SLists")) || [];

  return SLists;
};

const loadSLists = () => {
  const SLists = getSListsLocalStorage();

  SLists.forEach((SListItem) => {
    saveSList(SListItem.text, SListItem.done, 0);
  });
};

const saveSListLocalStorage = (SListItem) => {
  const SLists = getSListsLocalStorage();

  SLists.push(SListItem);

  localStorage.setItem("SLists", JSON.stringify(SLists));
};

const removeSListLocalStorage = (SListText) => {
  const SLists = getSListsLocalStorage();

  const filteredSLists = SLists.filter((SListItem) => SListItem.text != SListText);

  localStorage.setItem("SLists", JSON.stringify(filteredSLists));
};

const updateSListStatusLocalStorage = (SListText) => {
  const SLists = getSListsLocalStorage();

  SLists.map((SListItem) =>
    SListItem.text === SListText ? (SListItem.done = !SListItem.done) : null
  );

  localStorage.setItem("SLists", JSON.stringify(SLists));
};

const updateSListLocalStorage = (SListOldText, SListNewText) => {
  const SLists = getSListsLocalStorage();

  SLists.map((SListItem) =>
    SListItem.text === SListOldText ? (SListItem.text = SListNewText) : null
  );

  localStorage.setItem("SLists", JSON.stringify(SLists));
};

loadSLists();
