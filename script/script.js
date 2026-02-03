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
function getTasks() {
  return JSON.parse(localStorage.getItem("TasksList")) || [];
}

// Sauvegarde les tâches
function setTasks(tasks) {
  localStorage.setItem("TasksList", JSON.stringify(tasks));
  render();
}

function parseDate(str) {
  if (!str) return null; // si vide
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// Ajoute une tâche + crée un id + tâche (objet) + ajout au local storage
function saveTasksToLocalStorage(task) {
  let tasks = getTasks();
  let id = tasks.length > 0 ? tasks.toReversed()[0].id + 1 : 1;
  tasks.push({
    id: id,
    text: task,
    checked: false,
    importance: 1,
    startDate: "",
    endDate: "",
  });
  setTasks(tasks); // Sauvegarder la nouvelle liste mise à jour
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
function deleteTaskFromLocalStorage(task_id) {
  let tasks = getTasks();
  tasks = tasks.filter((task) => task.id !== task_id); // Filtrer la tâche à supprimer
  setTasks(tasks); // Sauvegarder la nouvelle liste mise à jour
}

//Ajoute une nouv. tâche
function addTask() {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();
  if (inputValue === "") {
    alert("Vous devez écrire quelque chose!");
    return;
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
function render() {
  var container = document.getElementById("AddTâche");
  container.innerHTML = "";

  getTasks().forEach(function (task) {
    //newElement(task);
    if (typeof task.text !== "string" || typeof task.checked !== "boolean") {
      console.error("Tâche incorrecte dans localStorage", task);
      return; // Si les données sont corrompues, on passe à la suivante
    }

    // Créer la boîte de tâche
    const taskBox = document.createElement("div");
    taskBox.className = "task-box";
    if (task.checked) {
      taskBox.classList.add("checked"); // Si la tâche est cochée, on ajoute la classe "checked"
    }

    // Span pour le texte de la tâche
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Btn Edit
    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.textContent = "\u270E";
    editBtn.onclick = function () {
      editBtn.onclick = function () {
        document.getElementById("popupEdit").style.display = "block";
        document.getElementById("bkgPopUpBlur").style.display = "block";
        document.getElementById("closePopUpsTasks").style.display = "block";

        editInput.value = task.text;
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
    };

    // Btn Remove
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = "\u00D7";
    closeBtn.onclick = function () {
      deleteTaskFromLocalStorage(task.id); // Supprimer du localStorage
      taskBox.remove(); // Supprime du DOM
    };

    editBtn.style.display = task.checked ? "none" : "inline-block";

    // Task complete (Marquer comme terminé)
    taskBox.onclick = function (e) {
      if (e.target === taskText) {
        taskBox.classList.toggle("checked");
        task.checked = taskBox.classList.contains("checked"); // Met à jour l'état de la tâche
        updateTaskInLocalStorage(
          task.id,
          task.text,
          task.checked,
          task.importance,
          task.startDate,
          task.endDate,
        ); // Sauvegarde le nouvel état
      }
    };

    // Ajouter les éléments à la boîte
    taskBox.appendChild(taskText);
    taskBox.appendChild(editBtn);
    taskBox.appendChild(closeBtn);

    // Ajouter la boîte dans le conteneur
    document.getElementById("AddTâche").appendChild(taskBox);
  });

  function sortTasks(criteria) {
    let tasks = getTasks();

    switch (criteria) {
      case "lastAdded":
        tasks.sort((a, b) => b.id - a.id);
        // Organise les task ( dernier -> premier) (id d'une task - id d'une autre = x)
        // x negatif = plus bas. x positif = plus haut
        // Task 5 (id 5) ;;; Task 4 (id 4) ;; 5-4= 1 ; 4-5 = -1 ==== task 5 plus en haut, task 4 plus en bas
        break;

      case "importance":
        tasks.sort((a, b) => b.importance - a.importance);
        // Organise les task ( high -> mid -> low) (importance atsk (3,2 ou 1) - importance autre task)
        // high=3; mid=2; low=1
        // Task 1(imp = 3), task 2 (imp = 2)  ;; 3-2 = 1; 2-3= -1 ==== task 1 plus haut que task 2
        break;

      case "date":
        tasks.sort((a, b) => {
          const dateA = parseDate(a.startDate) || new Date(0); // date minimale si vide
          const dateB = parseDate(b.startDate) || new Date(0);
          return dateA - dateB; // du plus ancien au plus récent
        });
        break;

      default:
        // Default (no sorting, or sorted by task ID)
        tasks.sort((a, b) => a.id - b.id);
    }

    setTasks(tasks); // Update the tasks in localStorage
  }

  // Event listeners for sorting options
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
}

// Event listener pour le btn d'organiser des tâches
document.getElementById("sortBtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// Fonction pour les popup (display block/none)

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

// Calendrier
// ==================== Variables ====================
let activeDateInput = null; // L'input actif
let minEndDate = null; // Date minimale selectable pour endDate
let currentDate = new Date();

const monthYearElement = document.getElementById("monthYear");
const datesYearElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// ==================== Ouvrir calendrier ====================
function srtCal(inputId) {
  activeDateInput = document.getElementById(inputId);
  document.querySelector(".Calendar").style.display = "block";
  updateCalendar();
}

// ==================== Mise à jour du calendrier ====================
function updateCalendar() {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 1. Titre mois/année
  const monthYearString = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  monthYearElement.textContent = monthYearString;

  // 2. Dernier jour du mois
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  // 3. Premier jour du mois
  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = firstDay.getDay();
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // 4. Dernier jour du mois précédent
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
    // Bloquer dates avant startDate si input endDate
    if (activeDateInput && activeDateInput.id === "endDate" && minEndDate) {
      if (date < minEndDate) isInactive = true;
    }

    const activeClass = isToday ? "active" : "";
    datesHTML += `<div class="date ${isInactive ? "inactive" : activeClass}">${i}</div>`;
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

// ==================== Navigation mois ====================
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

// ==================== Choix d'une date ====================
datesYearElement.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("date") &&
    !e.target.classList.contains("inactive")
  ) {
    const previousSelected = document.querySelector(".date.selected");
    if (previousSelected) previousSelected.classList.remove("selected");
    e.target.classList.add("selected");

    const clickedDay = parseInt(e.target.innerText, 10);
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDay = clickedDay.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");
    const dateString = `${formattedDay}/${formattedMonth}/${year}`;

    if (activeDateInput) {
      activeDateInput.value = dateString;

      // Si startDate choisi, update minEndDate
      if (activeDateInput.id === "startDate") {
        minEndDate = new Date(year, month - 1, clickedDay);
      }
    }

    document.querySelector(".Calendar").style.display = "none";
  }
});

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
