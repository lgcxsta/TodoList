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

function getTasks() {
  return JSON.parse(localStorage.getItem("TasksList")) || [];
}

function setTasks(tasks) {
  localStorage.setItem("TasksList", JSON.stringify(tasks));
  render();
}

// Fonction pour sauvegarder une tâche dans le localStorage
function saveTasksToLocalStorage(task) {
  let tasks = getTasks();
  let id = tasks.length > 0 ? tasks.toReversed()[0].id + 1 : 1;
  tasks.push({ id: id, text: task, checked: false }); // Ajoute la tâche comme non cochée
  setTasks(tasks); // Sauvegarder la nouvelle liste mise à jour
}

function updateTask() {
  updateTaskInLocalStorage(task_id, editInput.value, false);
  closeModifTask();
}

// Fonction pour mettre à jour une tâche dans le localStorage
function updateTaskInLocalStorage(task_id, updatedTask, checkedStatus = true) {
  let tasks = getTasks();
  tasks = tasks.map((task) =>
    task.id == task_id
      ? { id: task_id, text: updatedTask, checked: checkedStatus }
      : task
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

    //   Btn  Calendario -> "\u{1F4C6}\uFE0E"
    const dateBtn = document.createElement("span");
    dateBtn.className = "date";
    dateBtn.textContent = "\u{1F4C6}\uFE0E";
    dateBtn.onclick = function () {
      document.getElementById("calendrierPopup").style.display = "block";
      document.getElementById("closePopUpsTasks").style.display = "block";
      document.getElementById("bkgPopUpBlur").style.display = "block";
    };

    // Btn imporance -> "\u{26A0}\uFE0E"; "\u{2757}\uFE0E"; "\u{203C}\uFE0E"
    const importanceBtn = document.createElement("span");
    importanceBtn.className = "importance";
    importanceBtn.textContent = "\u{26A0}\uFE0E";
    importanceBtn.onclick = function () {
      document.getElementById("closePopUpsTasks").style.display = "block";
      document.getElementById("importancePopup").style.display = "block";
      document.getElementById("bkgPopUpBlur").style.display = "block";
    };

    // Btn Edit
    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.textContent = "\u270E";
    editBtn.onclick = function () {
      document.getElementById("popupEdit").style.display = "block";
      document.getElementById("bkgPopUpBlur").style.display = "block";
      document.getElementById("closePopUpsTasks").style.display = "block";
      editInput.value = task.text;
      task_id = task.id;
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
    importanceBtn.style.display = task.checked ? "none" : "inline-block";
    dateBtn.style.display = task.checked ? "none" : "inline-block";

    // Task complete (Marquer comme terminé)
    taskBox.onclick = function (e) {
      if (e.target === taskText) {
        taskBox.classList.toggle("checked");
        task.checked = taskBox.classList.contains("checked"); // Met à jour l'état de la tâche
        updateTaskInLocalStorage(task.id, task.text, task.checked); // Sauvegarde le nouvel état
      }
    };

    // Ajouter les éléments à la boîte
    taskBox.appendChild(taskText);
    taskBox.appendChild(importanceBtn);
    taskBox.appendChild(dateBtn);
    taskBox.appendChild(editBtn);
    taskBox.appendChild(closeBtn);

    // Ajouter la boîte dans le conteneur
    document.getElementById("AddTâche").appendChild(taskBox);
  });
}

// Hide/show = le login
function hideShow() {
  document.getElementById("loginBtn").style.visibility = "hidden";
  document.getElementById("hideShow").style.visibility = "visible";
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "block";
}

//fonction pour montrer les btn login et dark mode
function croix() {
  document.getElementById("loginBtn").style.visibility = "visible";
  document.getElementById("hideShow").style.visibility = "hidden";
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "none";
}

function zIndexBetweeenLoginTodo() {
  croix();
  document.getElementById("zIndexBetweeenLoginTodo").style.display = "none";
}

function fermeLoginBox() {
  document.getElementById("hideShow").style.visibility = "hidden";
  document.getElementById("loginBtn").style.visibility = "visible";
}

function closeModifTask() {
  document.getElementById("popupEdit").style.display = "none";
  document.getElementById("bkgPopUpBlur").style.display = "none";
  document.getElementById("importancePopup").style.display = "none";
  document.getElementById("calendrierPopup").style.display = "none";
}

function closePopUpsTasks() {
  document.getElementById("calendrierPopup").style.display = "none";
  document.getElementById("closePopUpsTasks").style.display = "none";
  document.getElementById("importancePopup").style.display = "none";
  document.getElementById("bkgPopUpBlur").style.display = "none";
  document.getElementById("popupEdit").style.display = "none";
}
