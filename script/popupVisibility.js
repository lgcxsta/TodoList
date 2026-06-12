/* ==========================================================================
   FONCTION UTILITAIRE
   ========================================================================== */
// Applique un objet de styles à un élément HTML via son ID
function setStyles(id, styles) {
  const el = document.getElementById(id);
  if (el) Object.assign(el.style, styles);
}

/* ==========================================================================
   POPUPS : TÂCHES ET LOGIN (GENERAL)
   ========================================================================== */

// Affiche la popup de connexion principale
function hideShow() {
  setStyles("loginBtn", { visibility: "hidden" });
  setStyles("hideShow", { visibility: "visible", display: "block" });
  setStyles("zIndexBetweeenLoginTodo", { display: "block" });
}

// Ferme la popup de connexion (croix)
function croix() {
  setStyles("loginBtn", { visibility: "visible" });
  setStyles("hideShow", { visibility: "hidden" });
  setStyles("zIndexBetweeenLoginTodo", { display: "none" });
}

// Ferme les popups si on clique sur l'arrière-plan flou
function zIndexBetweeenLoginTodo() {
  croix();
  setStyles("boxFormCreateAcc", { display: "none" });
}

// Réinitialise l'affichage pour revenir à l'écran principal
function fermeLoginBox() {
  setStyles("hideShow", { visibility: "hidden" });
  setStyles("loginBtn", { visibility: "visible" });
  setStyles("loginZindexCreateAccount", { display: "none" });
}

/* ==========================================================================
   POPUPS : EDITION DE TÂCHE ET DROPDOWN
   ========================================================================== */

// Ferme la popup de modification de tâche
function closeModifTask() {
  setStyles("popupEdit", { display: "none" });
  setStyles("bkgPopUpBlur", { display: "none" });

  // Cache aussi le calendrier s'il était ouvert
  const cal = document.querySelector(".Calendar");
  if (cal) cal.style.display = "none";
}

// Ferme les popups liées aux tâches via le background
function closePopUpsTasks() {
  setStyles("closePopUpsTasks", { display: "none" });
  setStyles("popupEdit", { display: "none" });
}

// Affiche le menu déroulant de tri (Sort)
function dropdownVisualisation() {
  setStyles("dropdown", { display: "block" });
  setStyles("belowDropdown", { display: "block" });
}

// Ferme le menu déroulant de tri
function closeDropdown() {
  setStyles("belowDropdown", { display: "none" });
  setStyles("dropdownContent", { display: "none" });
}

/* ==========================================================================
   POPUPS : CRÉATION DE COMPTE (CREATE ACCOUNT)
   ========================================================================== */

// Ferme la popup de création de compte
function croixCreateAcc() {
  setStyles("loginZindexCreateAccount", { display: "none" });
  setStyles("hideShow", { display: "none" });
  setStyles("zIndexBetweeenLoginTodo", { display: "none" });
  setStyles("loginBtn", { visibility: "visible" });
}

// Passe de l'écran principal à la création de compte
function createAccountPopUp() {
  setStyles("loginZindexCreateAccount", { display: "block" });
  setStyles("boxFormCreateAcc", { display: "block", visibility: "visible" });
  setStyles("hideShow", { display: "none" });
}

// Bascule de "Créer un compte" à "Se connecter"
function creatToLoginPopup() {
  setStyles("loginZindexCreateAccount", { display: "none" });
  setStyles("hideShow", { display: "block" });
}
