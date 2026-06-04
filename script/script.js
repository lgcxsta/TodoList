const API_URL = "http://localhost:8000/api";
let currentSort = "default"; // Valeur par défaut du tri

// ! ==================== TOGGLE THEME  ====================

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ! ==================== ENTER ====================

function enterKey(inputId, btnId) {
  const inputElement = document.getElementById(inputId);
  inputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(btnId).click();
    }
  });
}
enterKey("myInput", "addBtn");
enterKey("textTaskModif", "modifBtn");

// ! ==================== IMPORTANCE DES TÂCHES ====================

function impLevels() {
  let importanceLevels = 1;
  const impRadio = document.querySelector('input[name="importance"]:checked');
  if (impRadio) {
    // if (impRadio != null)
    importanceLevels = Number(impRadio.value);
  }
  return importanceLevels;
}

// ! ==================== API FUNCTION ====================

async function apiCall(endpoint, method = "GET", body = null) {
  // endpoint = fin de URL (/login, /tasks/, etc)
  // methode = GET, DELETE, ... Par défaut GET
  // body = données  envoyer, par défaut null

  const options = {
    method: method,
  };

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
    console.error("error: ", error);
  }
}

// ! ==================== EDITION DES TÂCHES ====================
//Recupere les tâches
async function getTasks() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) {
    return [];
  }
  return await apiCall("/users/" + userId + "/tasks");
}

function parseDate(str) {
  if (!str || str === "00/00/00") return null;
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// Fonction pour supprimer une tâche du localStorage
async function deleteTaskAPI(task_id) {
  await apiCall("/tasks/" + task_id, "DELETE");
  render();
}

// ! ==================== AJOUT DE TÂCHES ====================
//Ajoute une nouv. tâche
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

  const today = new Date(); // Date actuelle
  const formatedToday = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  // Formatage de la date au format "dd/mm/yyyy"

  const newTaskData = {
    name: inputValue,
    startDate: formatedToday,
    endDate: "",
    importance: 1,
  };

  const response = await apiCall(
    "/users/" + userId + "/tasks", // endpoint
    "POST", // body
    newTaskData, // données de la tâche
  );

  if (response) {
    input.value = ""; // On vide le champ texte
    await render(); // On rafraîchit la liste depuis la DB
  }
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

// ! ==================== AFFICHAGE DES TÂCHES ====================
// affiche les tâches + crée le conteuneur avec les spans
async function render() {
  var container = document.getElementById("AddTâche");
  container.innerHTML = "";

  //console.log(await getTasks());
  const tasks = await getTasks();

  // Fonction pour organiser les tâches
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

  tasks.forEach(function (task) {
    if (!task.name) {
      console.error("Unnamed task ignored ", task);
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

      document.getElementById("highLVL").checked =
        Number(task.importance) === 3;
      document.getElementById("midLVL").checked = Number(task.importance) === 2;
      document.getElementById("lowLVL").checked = Number(task.importance) === 1;

      // Mettre les dates de cette tâche
      const startInput = document.getElementById("startDate");
      const endInput = document.getElementById("endDate");

      startInput.value = task.startDate || ""; // vide si aucune date
      endInput.value = task.endDate || ""; // vide si aucune date

      //Mettre à jour minEndDate
      if (task.start_date) {
        const parts = task.start_date.split("/");
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

        const renderAPI = {
          checked: checkedStatusAPI,
        };

        const response = await apiCall("/tasks/" + task.id, "PATCH", renderAPI);

        if (response) {
          ediBtnVisibility(task);
          await render();
        }
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

// ! ==================== TRI DES TÂCHES ====================
// ! Une partie de la fonction de trie est dans render() pour trier les tâches selon différents critères (dernier ajouté, importance, date)

document.querySelectorAll(".sort-option").forEach((btn) => {
  btn.addEventListener("click", function () {
    currentSort = this.getAttribute("data-sort");
    render();
  });
});

// Event listener pour le btn d'organiser des tâches
document.getElementById("sortBtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// ! ==================== MODIF TASKS ====================
// Modif Task
const btnModif = document.getElementById("modifBtn");
btnModif.onclick = (e) => {
  e.preventDefault();
  const newTask = document.getElementById("textTaskModif").value;
  const importance = impLevels(); // Récupère le niveau d'importance sélectionné
  const startDates = document.getElementById("startDate").value;
  const endDates = document.getElementById("endDate").value;
  const updated_at = Date.now(); // Date de modification actuelle
  changeTaskPropretys(task_id, newTask, importance, startDates, endDates);
};

async function changeTaskPropretys(
  taskId,
  newTask,
  importance,
  startDates,
  endDates,
  updated_at,
) {
  const newTaskProprety = {
    name: newTask,
    importance: importance,
    startDate: startDates,
    endDate: endDates,
  };

  const response = await apiCall(
    "/tasks/" + taskId, // endpoint
    "PUT", // method
    newTaskProprety, // données de la tâche - body
  );

  if (response) {
    alert("Task modified successfully!");
    closeModifTask();
    await render(); // On rafraîchit la liste depuis la DB
  }
}

// TODO: remplacer calendrie js par html?
// TODO: créé fonct generique pour ouvrir/fermer les popups
// TODO: simplifier btn importance (mm attribut)
