// Fonction pour charger dynamiquement la page login
function chargerPageLogin() {
  fetch('login.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;

      // Ajouter style actif au bouton login
      document.getElementById('login-btn').classList.add('active');

      // Activer le formulaire de connexion
      connexionAdmin();
    });
}

// Fonction pour afficher l'interface administrateur
function afficherInterfaceAdmin() {
  const loginBtn = document.getElementById('login-btn');

  // Remplacer "login" par "logout"
  loginBtn.textContent = 'logout';
  loginBtn.style.cursor = 'pointer';

  // Créer et insérer la barre admin si elle n'existe pas
  if (!document.getElementById('admin-bar')) {
    const adminBar = document.createElement('div');
    adminBar.id = 'admin-bar';

    const iconBar = document.createElement('i');
    iconBar.className = 'fa-solid fa-pen-to-square';

    const textBar = document.createElement('p');
    textBar.textContent = 'Mode édition';

    adminBar.appendChild(iconBar);
    adminBar.appendChild(textBar);
    document.body.prepend(adminBar);
  }

  // Supprimer les filtres s'ils existent
  const filtres = document.getElementById('filtres');
  if (filtres) {
    filtres.remove();
  }

  // Rendre visible tous les éléments avec .afficher-bouton
  const boutonsModifier = document.querySelectorAll('.afficher-bouton');
  boutonsModifier.forEach(btn => {
    btn.style.display = 'flex'; // ou 'block' selon le CSS
  });

  // Gérer le bouton logout
  loginBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
  });
}

// Fonction de gestion de la soumission du formulaire de login
function connexionAdmin() {
  const loginForm = document.getElementById('login-form');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('mdp').value;

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
      const messageErreur = document.getElementById('erreur-login');
      messageErreur.textContent = "Erreur dans l'identifiant ou le mot de passe.";
      messageErreur.style.display = 'block';
      return;
      }

      // Stockage des infos en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);

      // Redirection vers page d'accueil
      window.location.href = 'index.html';

    } catch (error) {
      console.error('Erreur de connexion :', error);
    }
  });
}

// Script principal déclenché au chargement
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const token = localStorage.getItem('token');

  if (!loginBtn) return;

  if (token) {
    afficherInterfaceAdmin();
  } else {
    loginBtn.textContent = 'login';
    loginBtn.style.cursor = 'pointer';

    // Clic sur login → charger page login.html
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chargerPageLogin();
    });
  }
});
