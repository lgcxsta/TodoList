const API_URL = "http://localhost:8000/api";

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
      console.error("Erreur API :", response.status);
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

let currentSort = "default"; // Valeur par défaut du tri

// Event listeners for sorting options (SORTIS DE LA FONCTION RENDER)
document.querySelector(".sortP1").addEventListener("click", function () {
  currentSort = "default";
  render();
});

document.querySelector(".sortP2").addEventListener("click", function () {
  currentSort = "lastAdded";
  render();
});

document.querySelector(".sortP3").addEventListener("click", function () {
  currentSort = "importance";
  render();
});

document.querySelector(".sortP4").addEventListener("click", function () {
  currentSort = "date";
  render();
});

// Event listener pour le btn d'organiser des tâches
document.getElementById("sortBtn").addEventListener("click", function () {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// ! ==================== FONCTIONS POUR LES POPUPS ====================

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

// ! ==================== CALENDRIER ====================
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
      alert("Please select a start date first.");
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

// ! ==================== ACCOUNT POPUPS ====================
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

// !  ==================== USER ====================

// CREATE ACCOUNT
const btnInscrire = document.getElementById("createAccBTN");
btnInscrire.onclick = () => {
  const username = document.getElementById("usernameCreate").value.trim();
  const email = document.getElementById("userCreate").value.trim();
  const password = document.getElementById("pwdCreate").value.trim();

  if (!username || !password) {
    // Vérifie que le nom d'utilisateur et le mot de passe ne sont pas vides
    alert("A username and password are required!");
    return;
  }

  creatAccountFunction(username, email, password); // Appel de la fonction de création de compte
};

async function creatAccountFunction(username, email, password) {
  const newAccount = {
        username: username,
        email: email,
        password: password,
  };

  const response = await apiCall("/users", "POST", newAccount);

  if (response) {
    creatToLoginPopup();
    alert("Account created :)");
  }
}

// ! ==================== LOGIN ====================
const btnLog = document.getElementById("logAccountBTN");
btnLog.onclick = () => {
  const UserMail = document.getElementById("userMailLOG").value;
  const passwordLOG = document.getElementById("pwdLOG").value;
  loginAccountFunction(UserMail, passwordLOG);
};

async function loginAccountFunction(UserMail, passwordLOG) {
  const loginAPI = {
        username: UserMail,
        password: passwordLOG,
  };

  const response = await apiCall("/login", "POST", loginAPI);

  if (response) {
    localStorage.setItem("currentUserId", response.user.id); // Stocker le id dans le localStorage
      // data attent les données du fichier json, et user.id as été crée dans index.php
    localStorage.setItem("currentUsername", response.user.username);

      window.onload(); // Met à jour le label utilisateur dès le login - recharge la page

    console.log("Login réussi :", response);
      alert("You have successfully connected!");

      document.getElementById("pwdLOG").value = ""; // On vide le champ mot de passe après connexion
      document.getElementById("logoutS").style.display = "block";
      document.getElementById("loginBtn").style.display = "none"; // Cache le bouton de login/créé un compte après connexion

      render(); // raffraichit
      croixCreateAcc(); // Ferme le popup de login
    } else {
      alert("Incorrect login details. Please try again.");
      document.getElementById("pwdLOG").value = "";
    }
}

// ! ==================== LOG OUT ====================
const logoutBtn = document.getElementById("logoutS");
logoutBtn.onclick = () => {
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("currentUsername");
  window.onload(); // Met à jour le label utilisateur dès le logout - recharge la page
  alert("You have been disconnected");
  render(); // raffraichit
  document.getElementById("logoutS").style.display = "none";
};

// Si n'est pas connecter
window.onload = () => {
  const userlabelTest = document.getElementById("userLabel");
  const logoutBtn = document.getElementById("logoutS"); // On récupère le bouton logout

  if (localStorage.getItem("currentUserId")) {
    // Si un utilisateur est connecté
    if (userlabelTest)
      userlabelTest.innerHTML = `User: ${localStorage.getItem("currentUsername")}`; // Affiche le nom de l'utilisateur connecté
    if (logoutBtn) logoutBtn.style.display = "block"; // Affiche Logout si connecté
  } else {
    if (userlabelTest) userlabelTest.innerHTML = "Please log in...";
    if (logoutBtn) logoutBtn.style.display = "none"; // Cache Logout si invité
    document.getElementById("loginBtn").style.display = "block";
  }
};

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
