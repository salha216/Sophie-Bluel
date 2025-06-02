// Fonction asynchrone pour afficher la liste des travaux depuis l'API
async function afficherTravaux() {
  try {
    const reponse = await fetch('http://localhost:5678/api/works');
    const listeTravaux = await reponse.json();
    console.log(listeTravaux);

    afficherGalerie(listeTravaux); // Afficher toute la galerie par défaut
    activerFiltres(listeTravaux); // Activer les filtres pour faire fonctionner les boutons

  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

// 2eme Fonction pour afficher la liste de travaux dans la galerie mais sans interoger à chaque fois l'API
function afficherGalerie(travaux) {
  const portfolioSection = document.getElementById('portfolio');

// Supprimer l’ancienne galerie
  const ancienneGalerie = portfolioSection.querySelector('.gallery');
  if (ancienneGalerie) {
    ancienneGalerie.remove();
  }

// Créer et placer les balises de la nouvelle galerie
  const nouvelleGalerie = document.createElement('div');
  nouvelleGalerie.classList.add('gallery');

  travaux.forEach(travail => {
    const figure = document.createElement('figure');

    const image = document.createElement('img');
    image.src = travail.imageUrl;
    image.alt = travail.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = travail.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    nouvelleGalerie.appendChild(figure);
  });

  portfolioSection.appendChild(nouvelleGalerie);
}

// Fonction asynchrone pour afficher les catégories de filtres depuis l'API
async function afficherFiltres() {
  const reponse = await fetch('http://localhost:5678/api/categories');
  const listeCategories = await reponse.json();
  console.log(listeCategories);

// Création de la div filtres
  const divFiltres = document.createElement('div');
  divFiltres.id = 'filtres';

  const sectionPortfolio = document.getElementById("portfolio");
  const gallery = sectionPortfolio.querySelector(".gallery");
  sectionPortfolio.insertBefore(divFiltres, gallery);

  const conteneur = document.getElementById("filtres");

// Bouton Tous
  const boutonTous = document.createElement("button");
  boutonTous.classList.add('Tous');
  boutonTous.textContent = "Tous";
  conteneur.appendChild(boutonTous);

// Boutons des catégories
  listeCategories.forEach(categorie => {
    const bouton = document.createElement('button');
    const nomClasse = categorie.name
      .replace(/\s+/g, '-')
      .replace(/&/g, 'et');
    bouton.classList.add(nomClasse);
    bouton.textContent = categorie.name;
    conteneur.appendChild(bouton);
  });
}

// Fonction pour activer les filtres
function activerFiltres(listeTravaux) {
  const boutons = document.querySelectorAll('#filtres button');

  boutons.forEach(bouton => {
    bouton.addEventListener('click', () => {
      const nomCategorie = bouton.textContent;

      if (nomCategorie === 'Tous') {
        afficherGalerie(listeTravaux); 
      } else {
        const travauxFiltres = listeTravaux.filter(travail =>
          travail.category.name === nomCategorie
        );
        afficherGalerie(travauxFiltres);
      }
    });
  });
}

// Appel des fonctions
afficherFiltres();
afficherTravaux();
