const API_URL = "http://localhost:8000/api";
let currentSort = "default"; // Méthode de tri active
let task_id = ""; // ID de la tâche en cours d'édition
const editInput = document.getElementById("textTaskModif");

/* ==========================================================================
   UTILITAIRES (Thème, Clavier, Valeurs radio)
   ========================================================================== */

// Bascule du mode sombre/clair et sauvegarde locale
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Permet de valider un input en appuyant sur "Entrée"
function enterKey(inputId, btnId) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) return;
  inputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(btnId).click();
    }
  });
}

enterKey("myInput", "addBtn");
enterKey("textTaskModif", "modifBtn");

// Récupère la valeur du niveau d'importance (Radio boutons)
function impLevels() {
  let importanceLevels = 1; // Valeur par défaut
  const impRadio = document.querySelector('input[name="importance"]:checked');
  if (impRadio) {
    importanceLevels = Number(impRadio.value);
  }
  return importanceLevels;
}

// Transforme une date "JJ/MM/AAAA" en objet Date (utilisé pour le tri)
function parseDate(str) {
  if (!str || str === "00/00/00") return null;
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/* ==========================================================================
   MOTEUR API
   ========================================================================== */

// Fonction générique pour toutes les requêtes API (fetch)
async function apiCall(endpoint, method = "GET", body = null) {
  const options = { method: method };

  if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(API_URL + endpoint, options);
    if (!response.ok) {
      console.error("API error :", response.status);
      const errorData = await response.json();
      alert(errorData.error || "Error...");
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}

/* ==========================================================================
   GESTION DES TÂCHES (CRUD)
   ========================================================================== */

// 1. Lire (GET)
async function getTasks() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return []; // Retourne vide si non connecté
  return await apiCall("/users/" + userId + "/tasks");
}

// 2. Créer (POST)
async function addTask() {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();
  const userId = localStorage.getItem("currentUserId");

  if (inputValue === "") {
    alert("You must write something!");
    return;
  }
  if (!userId) {
    alert("You must be logged in to add a task...");
    return;
  }

  // Formatage de la date du jour: DD/MM/YYYY
  const today = new Date();
  const formatedToday = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  const newTaskData = {
    name: inputValue,
    startDate: formatedToday,
    endDate: "",
    importance: 1,
  };

  const response = await apiCall(
    "/users/" + userId + "/tasks",
    "POST",
    newTaskData,
  );

  if (response) {
    input.value = "";
    await render(); // Rafraîchit l'affichage
  }
}

// 3. Supprimer (DELETE)
async function deleteTaskAPI(task_id) {
  await apiCall("/tasks/" + task_id, "DELETE");
  render();
}

// 4. Modifier (PUT)
async function changeTaskPropretys(
  taskId,
  newTask,
  importance,
  startDates,
  endDates,
) {
  const newTaskProprety = {
    name: newTask,
    importance: importance,
    startDate: startDates,
    endDate: endDates,
  };

  const response = await apiCall("/tasks/" + taskId, "PUT", newTaskProprety);

  if (response) {
    alert("Task modified successfully!");
    closeModifTask();
    await render();
  }
}

// Déclencheur du bouton de modification
const btnModif = document.getElementById("modifBtn");
btnModif.onclick = (e) => {
  e.preventDefault();
  const newTask = document.getElementById("textTaskModif").value;
  const importance = impLevels();
  const startDates = document.getElementById("startDate").value;
  const endDates = document.getElementById("endDate").value;

  changeTaskPropretys(task_id, newTask, importance, startDates, endDates);
};

/* ==========================================================================
   AFFICHAGE ET TRI (RENDER)
   ========================================================================== */

// Affiche les tâches et gère les interactions (Cocher, Editer, Supprimer)
async function render() {
  const container = document.getElementById("AddTache");
  container.innerHTML = ""; // Vide le conteneur avant de reconstruire
  const tasks = await getTasks();

  // ----- Logique de Tri -----
  switch (currentSort) {
    case "lastAdded":
      tasks.sort((a, b) => b.id - a.id);
      break;
    case "importance":
      tasks.sort((a, b) => b.importance - a.importance);
      break;
    case "date":
      tasks.sort((a, b) => {
        const dateA = parseDate(a.start_date);
        const dateB = parseDate(b.start_date);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA - dateB;
      });
      break;
    default:
      tasks.sort((a, b) => a.id - b.id);
  }

  // ----- Génération du DOM -----
  tasks.forEach((task) => {
    if (!task.name) return;

    // Conteneur principal de la tâche
    const taskBox = document.createElement("div");
    taskBox.className = "task-box";
    if (task.checked == 1) taskBox.classList.add("checked");

    // Texte de la tâche
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.name;

    // Bouton Édition (Crayon)
    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.textContent = "\u270E";
    editBtn.style.display = task.checked == 1 ? "none" : "inline-block"; // Caché si coché

    editBtn.onclick = function () {
      document.getElementById("popupEdit").style.display = "block";
      document.getElementById("bkgPopUpBlur").style.display = "block";
      document.getElementById("closePopUpsTasks").style.display = "block";

      editInput.value = task.name;
      task_id = task.id;

      // Coche le bon niveau d'importance
      document.getElementById("highLVL").checked =
        Number(task.importance) === 3;
      document.getElementById("midLVL").checked = Number(task.importance) === 2;
      document.getElementById("lowLVL").checked = Number(task.importance) === 1;

      // Gère les dates existantes
      const startInput = document.getElementById("startDate");
      const endInput = document.getElementById("endDate");
      startInput.value = task.start_date || "";
      endInput.value = task.end_date || "";

      if (task.start_date) {
        const parts = task.start_date.split("/");
        minEndDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        minEndDate = null;
      }
    };

    // Bouton Suppression (Croix)
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = "\u00D7";
    closeBtn.onclick = function () {
      deleteTaskAPI(task.id);
      taskBox.remove();
    };

    // Toggle état complété (Cocher la tâche)
    taskBox.onclick = async function (e) {
      if (e.target === taskText) {
        taskBox.classList.toggle("checked");
        task.checked = taskBox.classList.contains("checked");

        const checkedStatusAPI = task.checked ? 1 : 0;
        const response = await apiCall("/tasks/" + task.id, "PATCH", {
          checked: checkedStatusAPI,
        });

        if (response) {
          editBtn.style.display = task.checked ? "none" : "inline-block"; // Cache ou montre le crayon
          await render();
        }
      }
    };

    // Assemblage
    taskBox.appendChild(taskText);
    taskBox.appendChild(editBtn);
    taskBox.appendChild(closeBtn);
    container.appendChild(taskBox);
  });
}

/* ==========================================================================
   INITIALISATION ET EVENT LISTENERS GLOBAUX
   ========================================================================== */

// S'exécute quand la page a fini de charger
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

  render(); // Charge les tâches
});

// Écouteurs pour le bouton de tri (Sort)
document.querySelectorAll(".sort-option").forEach((btn) => {
  btn.addEventListener("click", function () {
    currentSort = this.getAttribute("data-sort");
    render();
  });
});

document.getElementById("sortBtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});
