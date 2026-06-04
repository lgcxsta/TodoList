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
  } else {
    const errorData = await response;
    alert("Error creating account : " + (errorData.error || "Retry..."));
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
