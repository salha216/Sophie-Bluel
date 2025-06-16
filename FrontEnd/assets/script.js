// Fonction asynchrone pour récupérer les données depuis l'API
async function worksAndcategories() {
  try {
    const [travaux, categories] = await Promise.all ([
      fetch('http://localhost:5678/api/works').then(response => response.json()),
      fetch('http://localhost:5678/api/categories').then(response => response.json())
    ]);
    
    console.log(travaux, categories)

    affichergalerie(travaux); 
    afficherFiltres(categories);
    activerFiltres(travaux);

  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}
worksAndcategories (); 

// Fonction pour afficher la galerie
function affichergalerie(travaux) {
  const section = document.getElementById('portfolio');

// Supprimer l’ancienne galerie
  section.querySelector('.gallery').remove();

// Créer et placer les balises de la nouvelle galerie
  const galerie = document.createElement('div');
  galerie.classList.add('gallery');
  galerie.id = "projets";

  travaux.forEach(travail => {
    const figure = document.createElement('figure');

    const image = document.createElement('img');
    image.src = travail.imageUrl;
    image.alt = travail.title;
    figure.appendChild(image);

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = travail.title;
    figure.appendChild(figcaption);
    
    galerie.appendChild(figure);
  });

  section.appendChild(galerie);
}

// Fonction asynchrone pour afficher les filtres
function afficherFiltres(categories) {
  // Ne pas créer filtres si administrateur connecté
  const adminConnecte= localStorage.getItem('token');
  if (adminConnecte) {
    return;
  }
  
  const section = document.getElementById("portfolio");
  const gallery = section.querySelector(".gallery");

  const conteneur = document.createElement('div');
  conteneur.id = 'filtres';
  section.insertBefore(conteneur, gallery);

// Bouton Tous
  const boutonTous = document.createElement("button");
  boutonTous.classList.add('Tous');
  boutonTous.textContent = "Tous";
  conteneur.appendChild(boutonTous);

// Boutons des catégories
  categories.forEach(categorie => {
    const bouton = document.createElement('button');
    bouton.classList.add('categorie');
    bouton.textContent = categorie.name;
    conteneur.appendChild(bouton);
  });  
}

// Fonction pour activer les filtres
function activerFiltres(travaux) {
  document.querySelectorAll('#filtres button').forEach(bouton => {
  bouton.addEventListener('click', () => {
    const filtre = bouton.textContent;
    let resultat;
    if (filtre === 'Tous') {
      resultat = travaux;
    } else {
      resultat = travaux.filter(function(travail) {
        return travail.category.name === filtre;
      });
    }

    affichergalerie(resultat);
    })
  })
}
