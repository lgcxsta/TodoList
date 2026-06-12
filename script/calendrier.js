/* ==========================================================================
   VARIABLES GLOBALES DU CALENDRIER
   ========================================================================== */
let activeDateInput = null; // Cible l'input qui a ouvert le calendrier (Start ou End)
let minEndDate = null; // Date minimale autorisée si on choisit une Date de Fin
let currentDate = new Date();

const monthYearElement = document.getElementById("monthYear");
const datesYearElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ==========================================================================
   OUVERTURE ET ACTUALISATION DU CALENDRIER
   ========================================================================== */

// Déclenché au clic sur l'input date
function srtCal(inputId) {
  // Sécurité: Empêche de choisir une date de fin sans date de début
  if (inputId === "endDate") {
    const startValue = document.getElementById("startDate").value;
    if (!startValue) {
      showAlert("Please select a start date first.");
      return;
    }
    // Recalcule la date minimum basée sur l'input de début
    const [day, month, year] = startValue.split("/");
    minEndDate = new Date(year, month - 1, day);
  }

  // Ouvre le calendrier
  activeDateInput = document.getElementById(inputId);
  document.querySelector(".Calendar").style.display = "block";
  updateCalendar();
}

// Génère la vue (les jours) pour le mois/l'année en cours
function updateCalendar() {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Limite temporelle: On empêche de cliquer dans le passé (Aujourd'hui à minuit)
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  // Titre: Mois Année
  monthYearElement.textContent = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Calculs pour la construction de la grille
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = firstDay.getDay();
  // Décalage pour commencer lundi au lieu de dimanche
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevTotalDays = prevLastDay.getDate();

  let datesHTML = "";

  // 1. Jours du mois précédent (Grisés/Inactifs)
  for (let i = paddingDays; i > 0; i--) {
    const dayNum = prevTotalDays - i + 1;
    datesHTML += `<div class="date inactive">${dayNum}</div>`;
  }

  // 2. Jours du mois actuel
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isToday =
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear();

    let isInactive = false;

    // Désactive les dates passées
    if (date < todayAtMidnight) isInactive = true;

    // Désactive les dates antérieures à la "Date de début" si on sélectionne la fin
    if (activeDateInput && activeDateInput.id === "endDate" && minEndDate) {
      if (date < minEndDate) isInactive = true;
    }

    const activeClass = isToday ? "active" : "";
    datesHTML += `<div class="date ${isInactive ? "inactive" : activeClass}">${i}</div>`;
  }

  // 3. Jours du mois suivant pour combler la dernière ligne (Grisés/Inactifs)
  const totalCellsFilled = paddingDays + totalDays;
  const remainingDays = 7 - (totalCellsFilled % 7);

  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      datesHTML += `<div class="date inactive">${i}</div>`;
    }
  }

  // Injecte dans le DOM
  datesYearElement.innerHTML = datesHTML;
}

/* ==========================================================================
   ÉVÉNEMENTS CLICS (SÉLECTION ET NAVIGATION)
   ========================================================================== */

// Sélection d'une date dans la grille
datesYearElement.addEventListener("click", (e) => {
  // Ignore les clics hors des jours ou sur les jours grisés
  if (
    !e.target.classList.contains("date") ||
    e.target.classList.contains("inactive")
  ) {
    return;
  }

  // Gestion visuelle de la sélection
  const previousSelected = document.querySelector(".date.selected");
  if (previousSelected) previousSelected.classList.remove("selected");
  e.target.classList.add("selected");

  const day = Number(e.target.innerText);
  const selectedDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    day,
  );

  // Sécurité supplémentaire: Bloque la date si fin < début
  if (
    activeDateInput.id === "endDate" &&
    minEndDate &&
    selectedDate < minEndDate
  ) {
    return;
  }

  // Formate la date en chaîne de caractères (JJ/MM/AAAA)
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  if (activeDateInput) {
    activeDateInput.value = `${formattedDay}/${formattedMonth}/${year}`;

    // Si on a changé la date de début, on vérifie que la date de fin n'est pas cassée
    if (activeDateInput.id === "startDate") {
      minEndDate = selectedDate;
      const endInput = document.getElementById("endDate");

      if (endInput.value) {
        const [d, m, y] = endInput.value.split("/").map(Number);
        const endDate = new Date(y, m - 1, d);

        // Si la nouvelle date de début dépasse l'ancienne date de fin, on vide la fin
        if (endDate < minEndDate) endInput.value = "";
      }
    }
  }

  // Ferme le calendrier
  document.querySelector(".Calendar").style.display = "none";
});

// Boutons de navigation (Mois précédent / Mois suivant)
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});
