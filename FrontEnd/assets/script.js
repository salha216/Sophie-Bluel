document.addEventListener('DOMContentLoaded', () => {

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
})


// MODALE

const modifierLien = document.getElementById('modifier-projets');
const modale = document.getElementById('modale');
const fermerModale = document.getElementById('fermer-modale');
const galerieModale = document.getElementById('galerie-modale');
const lienAjoutPhoto = document.querySelector('.lien-ajout-photo');
const modale1 = document.getElementById('modale1');
const modale2 = document.getElementById('modale2');
const retourModale = document.getElementById('retour-modale');
const selectCategorie = document.getElementById('categorie');

modifierLien.addEventListener('click', (e) => {
  e.preventDefault();
  modale.style.display = 'flex';
  modale2.style.display = 'none';
  chargerGalerieModale();
});

fermerModale.addEventListener('click', () => {
  modale.style.display = 'none';
});

retourModale.addEventListener('click', () =>{
  modale2.style.display = 'none';
  modale1.style.display = 'block';
})

modale.addEventListener('click', (event) => {
  if (event.target === modale) {
    modale.style.display = 'none';
  }
});

// Charger les photos dans la modale
async function chargerGalerieModale() {
  galerieModale.innerHTML = '';
  const response = await fetch('http://localhost:5678/api/works');
  const photos = await response.json();

  photos.forEach(photo => {
    const container = document.createElement('div');
    container.className = 'photo-container';

    const img = document.createElement('img');
    img.src = photo.imageUrl;
    img.alt = photo.title;
    img.className = 'photo';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-delete';
    const icon = document.createElement ('img');
    icon.src = 'corbeille.png';
    icon.alt = 'supprimer-photo';
    icon.className = 'icon-delete';

    btnDelete.appendChild(icon);
    btnDelete.addEventListener('click', (event) => {
      event.preventDefault();
      supprimerPhoto(photo.id);
    });
    
    container.appendChild(img);
    container.appendChild(btnDelete);
    galerieModale.appendChild(container);
  });
}

// Supprimer travaux existants
  async function supprimerPhoto(id) {
  const response = await fetch('http://localhost:5678/api/works/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (response.ok) {
    chargerGalerieModale();
  } else {
    alert('Erreur lors de la suppression');
  }
}

// Redirection partie 2 modale
lienAjoutPhoto.addEventListener('click', (e) => {
    e.preventDefault();
    modale1.style.display = 'none';
    modale2.style.display = 'block';
    CategorieSelect();
  });

  // Charger les catégories dans le select
  async function CategorieSelect() {
      const response = await fetch('http://localhost:5678/api/categories');
      const categories = await response.json();

      selectCategorie.innerHTML ='<option value=""></option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        selectCategorie.appendChild(option);
      });
    };

// Ajouter une photo
