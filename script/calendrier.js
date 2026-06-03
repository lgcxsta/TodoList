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
