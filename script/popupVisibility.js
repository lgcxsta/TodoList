// ! ==================== FONCTION LOGIQUE ====================
// ! Applique les styles donnés
function setStyles(id, styles) {
  // prend le id de l'element et le style
  const el = document.getElementById(id); // constante el = id de l'element
  if (el) Object.assign(el.style, styles); // Verifie que l'id existe et copie tous les styles de l'objet "styles" dans el.style
}

// ! ==================== POPUPS ====================

function hideShow() {
  setStyles("loginBtn", { visibility: "hidden" });
  setStyles("hideShow", { visibility: "visible", display: "block" });
  setStyles("zIndexBetweeenLoginTodo", { display: "block" });
}

function croix() {
  setStyles("loginBtn", { visibility: "visible" });
  setStyles("hideShow", { visibility: "hidden" });
  setStyles("zIndexBetweeenLoginTodo", { display: "none" });
}

function zIndexBetweeenLoginTodo() {
  croix();
  setStyles("boxFormCreateAcc", { display: "none" });
}

function fermeLoginBox() {
  setStyles("hideShow", { visibility: "hidden" });
  setStyles("loginBtn", { visibility: "visible" });
  setStyles("loginZindexCreateAccount", { display: "none" });
}

function closeModifTask() {
  setStyles("popupEdit", { display: "none" });
  setStyles("bkgPopUpBlur", { display: "none" });
  const cal = document.querySelector(".Calendar");
  if (cal) cal.style.display = "none";
}

function closePopUpsTasks() {
  setStyles("closePopUpsTasks", { display: "none" });
  setStyles("popupEdit", { display: "none" });
}

function dropdownVisualisation() {
  setStyles("dropdown", { display: "block" });
  setStyles("belowDropdown", { display: "block" });
}

function closeDropdown() {
  setStyles("belowDropdown", { display: "none" });
  setStyles("dropdownContent", { display: "none" });
}

// ? ==================== ACCOUNT POPUPS ====================

function croixCreateAcc() {
  setStyles("loginZindexCreateAccount", { display: "none" });
  setStyles("hideShow", { display: "none" });
  setStyles("zIndexBetweeenLoginTodo", { display: "none" });
  setStyles("loginBtn", { visibility: "visible" });
}

function createAccountPopUp() {
  setStyles("loginZindexCreateAccount", { display: "block" });
  setStyles("boxFormCreateAcc", { display: "block", visibility: "visible" });
  setStyles("hideShow", { display: "none" });
}

function creatToLoginPopup() {
  setStyles("loginZindexCreateAccount", { display: "none" });
  setStyles("hideShow", { display: "block" });
}
