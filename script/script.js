const API_URL = "http://localhost:8000/api";

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Enter - myInput
var input = document.getElementById("myInput");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("addBtn").click();
  }
});

// Enter popup modifier la tâche
var inputEditTask = document.getElementById("textTaskModif");
inputEditTask.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("modifBtn").click();
  }
});

// Fonction importance
function impLevels() {
  let importanceLevels = 1;
  var highEdit = document.getElementById("highLVL");
  var midEdit = document.getElementById("midLVL");
  var lowEdit = document.getElementById("lowLVL");

  if (
    window.getComputedStyle(document.getElementById("popupEdit")).display ===
    "block"
  ) {
    if (highEdit.checked) {
      importanceLevels = 3;
    } else if (midEdit.checked) {
      importanceLevels = 2;
    } else if (lowEdit.checked) {
      importanceLevels = 1;
    } else {
      importanceLevels = 1;
    }
  } else {
    importanceLevels = 1;
  }

  return importanceLevels;
}

//Update importance + texte tâche dans le localStorage
function editPriority() {
  const importance = impLevels();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  updateTaskInLocalStorage(
    task_id,
    editInput.value,
    false,
    importance,
    startDate,
    endDate,
  );
  closeModifTask(); //ferme le popup
  render(); // réaffiche la liste des tâches
}

//Recupere les tâches
async function getTasks() {
  const response = await fetch(API_URL + "/tasks");
  return await response.json();

  // return JSON.parse(localStorage.getItem("TasksList")) || [];
}

// Sauvegarde les tâches
function setTasks(tasks) {
  localStorage.setItem("TasksList", JSON.stringify(tasks));
  render();
}

function parseDate(str) {
  if (!str || str === "00/00/00") return null;
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// Ajoute une tâche + crée un id + tâche (objet) + ajout au local storage
async function saveTasksToLocalStorage(task) {
  let tasks = await getTasks();
  let id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedToday = `${day}/${month}/${year}`;

  tasks.push({
    id: id,
    text: task,
    checked: 0,
    importance: 1,
    startDate: formattedToday,
    endDate: "",
  });

  setTasks(tasks);
}

// Update quand uune tâche est éditer
function updateTask() {
  const importance = impLevels();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  updateTaskInLocalStorage(
    task_id,
    editInput.value,
    false,
    importance,
    startDate,
    endDate,
  );
  closeModifTask();
  render();
}

// Fonction pour mettre à jour une tâche dans le localStorage
// Modifie/mets a jour une tâche
function updateTaskInLocalStorage(
  task_id,
  updatedTask,
  checkedStatus,
  importanceStatus,
  startDate,
  endDate,
) {
  let tasks = getTasks();
  tasks = tasks.map((task) =>
    task.id == task_id
      ? {
          ...task, //sa permet de réecrire seulement le texte qui est éditer
          text: updatedTask,
          checked: checkedStatus,
          importance: importanceStatus,
          startDate,
          endDate,
        }
      : task,
  );
  setTasks(tasks);
  // Sauvegarder la nouvelle liste mise à jour
}

// Fonction pour supprimer une tâche du localStorage
async function deleteTaskAPI(task_id) {
  let tasks = await getTasks();
  console.log(tasks);
  tasks = tasks.filter((task) => task.id !== task_id); // Filtrer la tâche à supprimer
  setTasks(tasks); // Sauvegarder la nouvelle liste mise à jour
  console.log(task_id);
  try {
    await fetch(API_URL + "/tasks/" + task_id, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Delete error", error);
  }
}

//Ajoute une nouv. tâche
async function addTask() {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();
  if (inputValue === "") {
    alert("Vous devez écrire quelque chose!");
    return;
  }

  try {
    await fetch(API_URL + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputValue,
      }),
    });
  } catch (error) {
    console.error("Delete error", error);
  }

  // Sauvegarder la tâche dans le localStorage
  saveTasksToLocalStorage(inputValue);

  input.value = "";
}

//Code executer seulement aprés que la page est totalement charger
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme");
  const toggle = document.getElementById("darkToggle");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (toggle) toggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    if (toggle) toggle.checked = false;
  }

  render();
});

const editInput = document.getElementById("textTaskModif");
let task_id = "";

// affiche les tâches + crée le conteuneur avec les spans
async function render() {
  var container = document.getElementById("AddTâche");
  container.innerHTML = "";

  console.log(await getTasks());

  (await getTasks()).forEach(function (task) {
    if (!task.name) {
      console.error("Tâche sans nom ignorée", task);
      return;
    }

    // Créer la boîte de tâche
    const taskBox = document.createElement("div");
    taskBox.className = "task-box";
    if (task.checked == 1) {
      taskBox.classList.add("checked"); // Si la tâche est cochée, on ajoute la classe "checked"
    }

    // Span pour le texte de la tâche
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.name;

    // Btn Edit
    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.textContent = "\u270E";
    editBtn.onclick = function () {
      document.getElementById("popupEdit").style.display = "block";
      document.getElementById("bkgPopUpBlur").style.display = "block";
      document.getElementById("closePopUpsTasks").style.display = "block";

      editInput.value = task.name;
      task_id = task.id;

      document.getElementById("highLVL").checked = task.importance === 3;
      document.getElementById("midLVL").checked = task.importance === 2;
      document.getElementById("lowLVL").checked = task.importance === 1;

      // Mettre les dates de cette tâche
      const startInput = document.getElementById("startDate");
      const endInput = document.getElementById("endDate");

      startInput.value = task.startDate || ""; // vide si aucune date
      endInput.value = task.endDate || ""; // vide si aucune date

      //0 Mettre à jour minEndDate
      if (task.startDate) {
        const parts = task.startDate.split("/");
        minEndDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        minEndDate = null;
      }
    };

    // Btn Remove
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = "\u00D7";
    closeBtn.onclick = function () {
      deleteTaskAPI(task.id); // Supprimer du localStorage
      taskBox.remove(); // Supprime du DOM
    };

    function ediBtnVisibility(task) {
      //editBtn.style.display = task.checked ? "none" : "inline-block";
      if (task.checked == 1) {
        editBtn.style.display = "none";
      } else {
        editBtn.style.display = "inline-block";
      }
    }
    ediBtnVisibility(task); // execute la fonction

    // Task complet (Marquer comme terminé)
    taskBox.onclick = async function (e) {
      if (e.target === taskText) {
        taskBox.classList.toggle("checked");
        task.checked = taskBox.classList.contains("checked"); // Met à jour l'état de la tâche
        const checkedStatusAPI = task.checked ? 1 : 0;

        try {
          await fetch(
            API_URL + "/tasks/" + task.id,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                checked: checkedStatusAPI,
              }),
            },
            ediBtnVisibility(task),
          );
        } catch (error) {
          console.error("Edit check status error", error);
        }

        updateTaskInLocalStorage(
          task.id,
          task.name,
          task.checked,
          task.importance,
          task.startDate,
          task.endDate,
        ); // Sauvegarde le nouv. état
      }
    };

    // Ajouter les éléments à la boîte
    taskBox.appendChild(taskText);
    taskBox.appendChild(editBtn);
    taskBox.appendChild(closeBtn);

    // Ajouter la boîte dans le conteneur
    document.getElementById("AddTâche").appendChild(taskBox);
  });
}

// ==================== TRI DES TÂCHES ====================
// Fonction pour organiser les tâches
async function sortTasks(criteria) {
  let tasks = await getTasks();

  switch (criteria) {
    case "lastAdded":
      tasks.sort((a, b) => b.id - a.id);
      break;

    case "importance":
      tasks.sort((a, b) => b.importance - a.importance);
      break;

    case "date":
      tasks.sort((a, b) => {
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);

        if (!dateA && !dateB) return 0; // les deux sans date -> même ordre
        if (!dateA) return 1; // a n'a pas de date -> après b
        if (!dateB) return -1; // b n'a pas de date -> après a

        return dateA - dateB; // sinon tri normal du plus ancien au plus récent
      });
      break;

    default:
      // Default (no sorting, or sorted by task ID)
      tasks.sort((a, b) => a.id - b.id);
  }

  setTasks(tasks); // Update the tasks in localStorage
}

// Event listeners for sorting options (SORTIS DE LA FONCTION RENDER)
document.querySelector(".sortP1").addEventListener("click", function () {
  sortTasks("default");
});

document.querySelector(".sortP2").addEventListener("click", function () {
  sortTasks("lastAdded");
});

document.querySelector(".sortP3").addEventListener("click", function () {
  sortTasks("importance");
});

document.querySelector(".sortP4").addEventListener("click", function () {
  sortTasks("date");
});

// Event listener pour le btn d'organiser des tâches
document.getElementById("sortBtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// ==================== FONCTIONS POUR LES POPUPS ====================

// Hide/show = le login
function hideShow() {
  document.getElementById("loginBtn").style.visibility = "hidden";
  document.getElementById("hideShow").style.visibility = "visible";
  document.getElementById("hideShow").style.display = "block";
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "block";
}

//fonction pour montrer les btn login et dark mode
function croix() {
  document.getElementById("loginBtn").style.visibility = "visible";
  document.getElementById("hideShow").style.visibility = "hidden";
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "none";
}

/*Close*/
function zIndexBetweeenLoginTodo() {
  croix();
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "none";
  document.getElementById("boxFormCreateAcc").style.display = "none";
}

function fermeLoginBox() {
  document.getElementById("hideShow").style.visibility = "hidden";
  document.getElementById("loginBtn").style.visibility = "visible";
  document.getElementById("loginZindexCreateAccount").style.display = "none";
}

function closeModifTask() {
  document.getElementById("popupEdit").style.display = "none";
  document.getElementById("bkgPopUpBlur").style.display = "none";
  document.querySelector(".Calendar").style.display = "none";
}

function closePopUpsTasks() {
  document.getElementById("closePopUpsTasks").style.display = "none";
  document.getElementById("popupEdit").style.display = "none";
}

function dropdownVisualisation() {
  document.getElementById("dropdown").style.display = "block";
  document.getElementById("belowDropdown").style.display = "block";
}

function closeDropdown() {
  document.getElementById("belowDropdown").style.display = "none";
  document.getElementById("dropdownContent").style.display = "none";
}

// ==================== CALENDRIER ====================
let activeDateInput = null; // L'input actif
let minEndDate = null; // Date minimale selectable pour endDate
let currentDate = new Date();

const monthYearElement = document.getElementById("monthYear");
const datesYearElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Ouvrir calendrier
function srtCal(inputId) {
  // Bloquer endDate si startDate est vide
  if (inputId === "endDate") {
    const startValue = document.getElementById("startDate").value;
    if (!startValue) {
      alert("Veuillez d'abord sélectionner une date de début");
      return;
    }

    // recalculer minEndDate UNIQUEMENT pour endDate
    const [day, month, year] = startValue.split("/");
    minEndDate = new Date(year, month - 1, day);
  }

  // ouverture normale du calendrier
  activeDateInput = document.getElementById(inputId);
  document.querySelector(".Calendar").style.display = "block";
  updateCalendar();
}

function updateCalendar() {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Creation var "aujourd'hui à minuit" (bloque le passé)
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  // Titre mois/année
  const monthYearString = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  monthYearElement.textContent = monthYearString;

  // Dernier jour du mois
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  // Premier jour du mois
  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = firstDay.getDay();
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Dernier jour du mois précédent
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevTotalDays = prevLastDay.getDate();

  let datesHTML = "";

  // Jours du mois précédent (gris)
  for (let i = paddingDays; i > 0; i--) {
    const dayNum = prevTotalDays - i + 1;
    datesHTML += `<div class="date inactive">${dayNum}</div>`;
  }

  // Jours du mois actuel
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isToday =
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear();

    let isInactive = false;

    // Bloquer les dates qui sont AVANT aujourd'hui
    if (date < todayAtMidnight) {
      isInactive = true;
    }

    // Bloquer dates avant startDate si input endDate
    if (activeDateInput && activeDateInput.id === "endDate" && minEndDate) {
      if (date < minEndDate) isInactive = true;
    }

    const activeClass = isToday ? "active" : "";
    datesHTML += `<div class="date ${
      isInactive ? "inactive" : activeClass
    }">${i}</div>`;
  }

  // Jours du mois suivant (fin de semaine)
  const totalCellsFilled = paddingDays + totalDays;
  const remainingDays = 7 - (totalCellsFilled % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      datesHTML += `<div class="date inactive">${i}</div>`;
    }
  }

  datesYearElement.innerHTML = datesHTML;
}

// Choix d'une date (dans updateCalendar et en dehors)
datesYearElement.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("date") ||
    e.target.classList.contains("inactive")
  ) {
    return;
  }

  const previousSelected = document.querySelector(".date.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  e.target.classList.add("selected");

  const day = Number(e.target.innerText);
  const selectedDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    day,
  );

  // BLOQUER endDate < startDate
  if (
    activeDateInput.id === "endDate" &&
    minEndDate &&
    selectedDate < minEndDate
  ) {
    return;
  }

  // Appliquer la date
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  if (activeDateInput) {
    activeDateInput.value = `${formattedDay}/${formattedMonth}/${year}`;

    // Si startDate change → invalider endDate ou update minEndDate
    if (activeDateInput.id === "startDate") {
      minEndDate = selectedDate;
      const endInput = document.getElementById("endDate");

      if (endInput.value) {
        const [d, m, y] = endInput.value.split("/").map(Number);
        const endDate = new Date(y, m - 1, d);

        if (endDate < minEndDate) {
          endInput.value = "";
        }
      }
    }
  }

  document.querySelector(".Calendar").style.display = "none";
});

// Navigation mois
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

// ==================== ACCOUNT POPUPS ====================
function croixCreateAcc() {
  document.getElementById("loginZindexCreateAccount").style.display = "none";
  document.getElementById("hideShow").style.display = "none";
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "none";
  document.getElementById("loginBtn").style.visibility = "visible";
}

function createAccountPopUp() {
  document.getElementById("loginZindexCreateAccount").style.display = "block";
  document.getElementById("boxFormCreateAcc").style.display = "block";
  document.getElementById("boxFormCreateAcc").style.visibility = "visible";
  document.getElementById("hideShow").style.display = "none";
}

function creatToLoginPopup() {
  document.getElementById("loginZindexCreateAccount").style.display = "none";
  document.getElementById("hideShow").style.display = "block";
}
