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

function impLevels() {
  let importanceLevels = 1;


  var highEdit = document.getElementById("highLVL");
  var midEdit = document.getElementById("midLVL");
  var lowEdit = document.getElementById("lowLVL");

  if (
    window.getComputedStyle(document.getElementById("popupEdit")).display ===
    "block"
  ) {
    if (highEdit.checked) {importanceLevels = 3}
    else if (midEdit.checked) {importanceLevels = 2}
    else if (lowEdit.checked) {importanceLevels = 1}
    else {importanceLevels = 1}
  } else {importanceLevels = 1}

  return importanceLevels;
}

function editPriority() {
  const importance = impLevels();
  updateTaskInLocalStorage(task_id, editInput.value, false, importance);
  closeModifTask();
  render();
}

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
  tasks.push({ id: id, text: task, checked: false, importance: 1 });
  setTasks(tasks); // Sauvegarder la nouvelle liste mise à jour
}

function updateTask() {
  const importance = impLevels();
  updateTaskInLocalStorage(task_id, editInput.value, false, importance);
  closeModifTask();
  render();
}

// Fonction pour mettre à jour une tâche dans le localStorage
function updateTaskInLocalStorage(
  task_id,
  updatedTask,
  checkedStatus,
  importanceStatus,
) {
  let tasks = getTasks();
  tasks = tasks.map((task) =>
    task.id == task_id
      ? {
          id: task_id,
          text: updatedTask,
          checked: checkedStatus,
          importance: importanceStatus,
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

      document.getElementById("highLVL").checked = task.importance === 3;
      document.getElementById("midLVL").checked = task.importance === 2;
      document.getElementById("lowLVL").checked = task.importance === 1;
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
        ); // Sauvegarde le nouvel état
      }
    };

    // Ajouter les éléments à la boîte
    taskBox.appendChild(taskText);
    // taskBox.appendChild(importanceBtn);
    // taskBox.appendChild(dateBtn);
    taskBox.appendChild(editBtn);
    taskBox.appendChild(closeBtn);

    // Ajouter la boîte dans le conteneur
    document.getElementById("AddTâche").appendChild(taskBox);
  });

  function sortTasks(criteria) {
    let tasks = getTasks();

    switch (criteria) {
      case "lastAdded":
        tasks.sort((a, b) => b.id - a.id); // Organise les task ( dernier -> premier) (id d'une task - id d'une autre = x)
        // x negatif = plus bas. x positif = plus haut
        // Task 5 (id 5) ;;; Task 4 (id 4) ;; 5-4= 1 ; 4-5 = -1 ==== task 5 plus en haut, task 4 plus en bas
        break;

      case "importance":
        tasks.sort((a, b) => b.importance - a.importance); // Organise les task ( high -> mid -> low) (importance atsk (3,2 ou 1) - importance autre task)
        // high=3; mid=2; low=1
        // Task 1(imp = 3), task 2 (imp = 2)  ;; 3-2 = 1; 2-3= -1 ==== task 1 plus haut que task 2
        break;

      // case "date":
      //   tasks.sort((a, b) => {
      //     const startDateA = new Date(a.startDate);
      //     const startDateB = new Date(b.startDate);
      //     return startDateA - startDateB; // Sort by Start Date (ascending)
      //   });
      //   break;

      default:
        // Default (no sorting, or sorted by task ID)
        tasks.sort((a, b) => a.id - b.id);
    }

    setTasks(tasks); // Update the tasks in localStorage
  }

  // Event listener for the Sort button
  document.getElementById("sortBtn").addEventListener("click", function () {
    const dropdownContent = document.querySelector(".dropdownContent");
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

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
}

function closePopUpsTasks() {
  document.getElementById("closePopUpsTasks").style.display = "none";
  document.getElementById("bkgPopUpBlur").style.display = "none";
  document.getElementById("popupEdit").style.display = "none";
}
