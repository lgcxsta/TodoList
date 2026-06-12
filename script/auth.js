/* ==========================================================================
   CRÉATION DE COMPTE (SIGN UP)
   ========================================================================== */
const btnInscrire = document.getElementById("createAccBTN");

btnInscrire.onclick = () => {
  const username = document.getElementById("usernameCreate").value.trim();
  const email = document.getElementById("userCreate").value.trim();
  const password = document.getElementById("pwdCreate").value.trim();

  // Vérification de base
  if (!username || !password) {
    showAlert("A username and password are required!");
    return;
  }

  creatAccountFunction(username, email, password);
};

// Requête API pour créer l'utilisateur
async function creatAccountFunction(username, email, password) {
  const newAccount = {
    username: username,
    email: email,
    password: password,
  };

  const response = await apiCall("/users", "POST", newAccount);

  if (response) {
    creatToLoginPopup(); // Renvoie vers l'écran de login
    showAlert("Account created!");
  } else {
    const errorData = await response;
    showAlert("Error creating account: " + (errorData.error || "Retry..."));
  }
}

/* ==========================================================================
   CONNEXION (LOGIN)
   ========================================================================== */
const btnLog = document.getElementById("logAccountBTN");

btnLog.onclick = () => {
  const userMail = document.getElementById("userMailLOG").value;
  const passwordLOG = document.getElementById("pwdLOG").value;
  loginAccountFunction(userMail, passwordLOG);
};

// Requête API pour se connecter
async function loginAccountFunction(userMail, passwordLOG) {
  const loginAPI = {
    username: userMail,
    password: passwordLOG,
  };

  const response = await apiCall("/login", "POST", loginAPI);

  if (response) {
    // Sauvegarde de la session dans le navigateur
    localStorage.setItem("currentUserId", response.user.id);
    localStorage.setItem("currentUsername", response.user.username);

    // Recharge l'état de la page
    window.onload();

    showAlert("You have successfully connected!");

    // Nettoyage et mise à jour de l'UI
    document.getElementById("pwdLOG").value = "";
    document.getElementById("logoutS").style.display = "block";
    document.getElementById("loginBtn").style.display = "none";

    render(); // Rafraîchit les tâches
    croixCreateAcc(); // Ferme les popups
  } else {
    showAlert("Incorrect login details. Please try again.");
    document.getElementById("pwdLOG").value = "";
  }
}

/* ==========================================================================
   DÉCONNEXION (LOG OUT)
   ========================================================================== */
const logoutBtn = document.getElementById("logoutS");

logoutBtn.onclick = () => {
  // Suppression de la session
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("currentUsername");

  window.onload(); // Actualise l'interface
  showAlert("You have been disconnected");

  render(); // Vide la liste de tâches
  document.getElementById("logoutS").style.display = "none";
};

/* ==========================================================================
   INITIALISATION (Vérification de session au chargement)
   ========================================================================== */
window.onload = () => {
  const userLabelTest = document.getElementById("userLabel");
  const logoutBtn = document.getElementById("logoutS");

  if (localStorage.getItem("currentUserId")) {
    // Utilisateur connecté
    if (userLabelTest) {
      userLabelTest.innerHTML = `User: ${localStorage.getItem("currentUsername")}`;
    }
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    // Visiteur non connecté
    if (userLabelTest) userLabelTest.innerHTML = "Please log in...";
    if (logoutBtn) logoutBtn.style.display = "none";
    document.getElementById("loginBtn").style.display = "block";
  }
};
