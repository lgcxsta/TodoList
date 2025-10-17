function myFunction() {
  document.body.classList.toggle("dark-mode");
}

//Enter funcionar
document.addEventListener("DOMContentLoaded", function () {
  addsaved(); // Affiche les tâches sauvegardées dès que la page est chargée
  var input = document.getElementById("myInput");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("addBtn").click();
    }
  });
});

// Fonction pour afficher les tâches sauvegardées
function addsaved() {
  const savedTasks = JSON.parse(localStorage.getItem("TasksList")) || [];

  savedTasks.forEach(function (task) {
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
      const newTask = prompt("Modifier la tâche:", taskText.textContent);
      if (newTask !== null && newTask.trim() !== "") {
        taskText.textContent = newTask;
        updateTaskInLocalStorage(task.text, newTask, task.checked); // Met à jour dans le localStorage
      }
    };

    // Btn Remove
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = "\u00D7";
    closeBtn.onclick = function () {
      deleteTaskFromLocalStorage(task.text); // Supprimer du localStorage
      taskBox.remove(); // Supprime du DOM
    };

    // Task complete (Marquer comme terminé)
    taskBox.onclick = function (e) {
      if (e.target === taskText) {
        taskBox.classList.toggle("checked");
        task.checked = taskBox.classList.contains("checked"); // Met à jour l'état de la tâche
        updateTaskInLocalStorage(task.text, task.text, task.checked); // Sauvegarde le nouvel état
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

// Fonction pour mettre à jour une tâche dans le localStorage
function updateTaskInLocalStorage(oldTask, updatedTask, checkedStatus) {
  let tasks = JSON.parse(localStorage.getItem("TasksList")) || [];
  tasks = tasks.map(task => task.text === oldTask ? { text: updatedTask, checked: checkedStatus } : task);
  localStorage.setItem("TasksList", JSON.stringify(tasks)); // Sauvegarder la nouvelle liste mise à jour
}

// Fonction pour supprimer une tâche du localStorage
function deleteTaskFromLocalStorage(taskToDelete) {
  let tasks = JSON.parse(localStorage.getItem("TasksList")) || [];
  tasks = tasks.filter(task => task.text !== taskToDelete); // Filtrer la tâche à supprimer
  localStorage.setItem("TasksList", JSON.stringify(tasks)); // Sauvegarder la nouvelle liste mise à jour
}

// Fonction pour ajouter une nouvelle tâche
function newElement() {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  if (inputValue === "") {
    alert("Vous devez écrire quelque chose!");
    return;
  }

  // Créer la boîte de tâche
  const taskBox = document.createElement("div");
  taskBox.className = "task-box";

  // Span pour le texte de la tâche
  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = inputValue;

  // Sauvegarder la tâche dans le localStorage
  saveTasksToLocalStorage(inputValue);

  // Btn Edit
  const editBtn = document.createElement("span");
  editBtn.className = "edit";
  editBtn.textContent = "\u270E";
  editBtn.onclick = function () {
    const newTask = prompt("Modifier la tâche:", taskText.textContent);
    if (newTask !== null && newTask.trim() !== "") {
      taskText.textContent = newTask;
      updateTaskInLocalStorage(inputValue, newTask, false); // Met à jour dans le localStorage
    }
  };

  // Btn Remove
  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.textContent = "\u00D7";
  closeBtn.onclick = function () {
    deleteTaskFromLocalStorage(taskText.textContent); // Supprimer du localStorage
    taskBox.remove(); // Supprimer du DOM
  };

  // Task complete (Marquer comme terminé)
  taskBox.onclick = function (e) {
    if (e.target === taskText) {
      taskBox.classList.toggle("checked");
      // Sauvegarder l'état de la tâche dans le localStorage
      updateTaskInLocalStorage(inputValue, inputValue, taskBox.classList.contains("checked"));
    }
  };

  // Ajouter les éléments à la boîte
  taskBox.appendChild(taskText);
  taskBox.appendChild(editBtn);
  taskBox.appendChild(closeBtn);

  // Ajouter la boîte dans le conteneur
  document.getElementById("AddTâche").appendChild(taskBox);

  // Vider l'input
  input.value = "";
}

// Fonction pour sauvegarder une tâche dans le localStorage
function saveTasksToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("TasksList")) || [];
  tasks.push({ text: task, checked: false }); // Ajoute la tâche comme non cochée
  localStorage.setItem("TasksList", JSON.stringify(tasks)); // Sauvegarder la nouvelle liste mise à jour
}