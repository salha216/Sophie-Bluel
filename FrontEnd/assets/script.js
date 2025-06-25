let allTravaux = [];
let allCategories = [];

async function worksAndcategories() {
  try {
    const [travaux, categories] = await Promise.all([
      fetch('http://localhost:5678/api/works').then(response => response.json()),
      fetch('http://localhost:5678/api/categories').then(response => response.json())
    ]);

    allTravaux = travaux;
    allCategories = categories;

    affichergalerie(travaux); 
    afficherFiltres(categories);
    activerFiltres(travaux);

  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  worksAndcategories(); 
});

// ------------------- FONCTIONS GÉNÉRALES -------------------

function affichergalerie(travaux) {
  const section = document.getElementById('portfolio');
  const ancienneGalerie = section.querySelector('.gallery');
  if (ancienneGalerie) ancienneGalerie.remove();

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

function afficherFiltres(categories) {
  if (localStorage.getItem('token')) return;

  const section = document.getElementById("portfolio");
  const gallery = section.querySelector(".gallery");

  const conteneur = document.createElement('div');
  conteneur.id = 'filtres';
  section.insertBefore(conteneur, gallery);

  const boutonTous = document.createElement("button");
  boutonTous.classList.add('Tous');
  boutonTous.textContent = "Tous";
  conteneur.appendChild(boutonTous);

  categories.forEach(categorie => {
    const bouton = document.createElement('button');
    bouton.classList.add('categorie');
    bouton.textContent = categorie.name;
    conteneur.appendChild(bouton);
  });  
}

function activerFiltres(travaux) {
  document.querySelectorAll('#filtres button').forEach(bouton => {
    bouton.addEventListener('click', () => {
      const filtre = bouton.textContent;
      const resultat = filtre === 'Tous'
        ? travaux
        : travaux.filter(travail => travail.category.name === filtre);
      affichergalerie(resultat);
    });
  });
}

// ------------------- MODALE -------------------

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

retourModale.addEventListener('click', () => {
  modale2.style.display = 'none';
  modale1.style.display = 'block';
});

modale.addEventListener('click', (event) => {
  if (event.target === modale) {
    modale.style.display = 'none';
  }
});

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
    const icon = document.createElement('img');
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

async function supprimerPhoto(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (response.ok) {
  const MajTravaux = await fetch('http://localhost:5678/api/works').then(res => res.json());
  affichergalerie(MajTravaux);
    await chargerGalerieModale();
  } else {
    alert('Erreur lors de la suppression');
  }
}

// Redirection modale vers ajout photo
lienAjoutPhoto.addEventListener('click', (e) => {
  e.preventDefault();
  modale1.style.display = 'none';
  modale2.style.display = 'block';
  CategorieSelect();
});

async function CategorieSelect() {
  const response = await fetch('http://localhost:5678/api/categories');
  const categories = await response.json();

  selectCategorie.innerHTML = '<option value=""></option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    selectCategorie.appendChild(option);
  });
}

// AJOUT D'UNE NOUVELLE PHOTO

const inputPhoto = document.getElementById('input-photo');
const addPhotoDiv = document.querySelector('.add-photo');
const validerBtn = document.getElementById('valider-btn');

let selectedImageFile = null;

inputPhoto.addEventListener('change', function () {
  const file = this.files[0];

  if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const Newimg = document.createElement('img');
      Newimg.src = e.target.result;
      Newimg.className = 'new-img';

      addPhotoDiv.innerHTML = '';
      addPhotoDiv.appendChild(Newimg);
      addPhotoDiv.style.padding = '0';

      selectedImageFile = file;
    };
    reader.readAsDataURL(file);
  }
});

const titreInput = document.getElementById('titre');
const categorieSelect = document.getElementById('categorie');
const validerPhoto = document.getElementById('valider-photo');

function verifierChamps() {
  const imageOK = selectedImageFile !== null;
  const titreOK = titreInput.value.trim() !== '';
  const categorieOK = categorieSelect.value !== '';

  if (imageOK && titreOK && categorieOK) {
    validerPhoto.style.backgroundColor = '#1D6154';
    validerPhoto.disabled = false;
  } else {
    validerPhoto.style.backgroundColor = '';
    validerPhoto.disabled = true;
  }
}

inputPhoto.addEventListener('change', verifierChamps);
titreInput.addEventListener('input', verifierChamps);
categorieSelect.addEventListener('change', verifierChamps);

validerPhoto.addEventListener('click', async (e) => {
  e.preventDefault();

  const titre = titreInput.value.trim();
  const categorie = categorieSelect.value;
  const token = localStorage.getItem('token');

  if (!selectedImageFile || !titre || !categorie) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedImageFile);
  formData.append('title', titre);
  formData.append('category', categorie);

  
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const json = await response.json();
      console.log('Image envoyée avec succès :', json);

      selectedImageFile = null;
      titreInput.value = '';
      categorieSelect.value = '';
      addPhotoDiv.innerHTML = '<i class="fa-regular fa-image"></i><p>+ Ajouter photo</p>';
      addPhotoDiv.style.padding = '';

      await chargerGalerieModale();
      await worksAndcategories();

      modale.style.display = 'none';
    } else {
      alert("Erreur lors de l'envoi : " + response.status);
    }
});
