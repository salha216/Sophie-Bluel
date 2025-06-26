// AFFICHER FILTRES ET GALERIE DEPUIS L'API

let allWorks = [];
let allCategories = [];

async function fetchWorks() {
  if (allWorks.length) return allWorks; 
  const response = await fetch('http://localhost:5678/api/works');
  allWorks = await response.json();
  return allWorks;
}

async function fetchCategories() {
  if (allCategories.length) return allCategories; 
  const response = await fetch('http://localhost:5678/api/categories');
  allCategories = await response.json();
  return allCategories;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const travaux = await fetchWorks();
    const categories = await fetchCategories();

    affichergalerie(travaux); 
    afficherFiltres(categories);
    activerFiltres(travaux);
  } catch (error) {
    console.error("Erreur lors du chargement initial :", error);
  }
});

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
  boutonTous.className = 'Tous active-filter';
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
  const boutons = document.querySelectorAll('#filtres button');

  boutons.forEach(bouton => {
    bouton.addEventListener('click', (e) => {
      e.preventDefault();

      boutons.forEach(btn => btn.classList.remove('active-filter'));

      bouton.classList.add('active-filter');

      const filtre = bouton.textContent;
      const resultat = filtre === 'Tous'
        ? travaux
        : travaux.filter(travail => travail.category.name === filtre);
      affichergalerie(resultat);
    });
  });
}

// MODALE
const modale = document.getElementById('modale');

const modaleContenu = document.createElement('div');
modaleContenu.className = 'modale-contenu';

const fermerModale = document.createElement('i');
fermerModale.id = 'fermer-modale';
fermerModale.className ='fa-solid fa-xmark';

modale.appendChild(modaleContenu);
modale.appendChild(fermerModale);

// CREATION MODALE 1
const modale1 = document.createElement('div');
modale1.id = 'modale1';

const h3Modale = document.createElement('h3');
h3Modale.textContent = 'Galerie photo';

const galerieModale = document.createElement('span');
galerieModale.id = 'galerie-modale';

const hr1 = document.createElement('hr');

const lienAjoutPhoto = document.createElement('button');
lienAjoutPhoto.type = 'submit';
lienAjoutPhoto.className = 'lien-ajout-photo';
lienAjoutPhoto.textContent = 'Ajouter une photo';

modale1.appendChild(h3Modale);
modale1.appendChild(galerieModale);
modale1.appendChild(hr1);
modale1.appendChild(lienAjoutPhoto);

modale.appendChild(modale1);

// CREATION MODALE 2
const modale2 = document.createElement('div');
modale2.id = 'modale2';

const retourModale = document.createElement('i');
retourModale.className = 'fa-solid fa-arrow-left';
retourModale.id = 'retour-modale';

const h3Modale2 = document.createElement('h3');
h3Modale2.textContent = 'Ajout photo';

const addPhotoDiv = document.createElement('div');
addPhotoDiv.className = 'add-photo';

const iconImage = document.createElement('i');
iconImage.className = 'far fa-image';

const inputPhoto = document.createElement('input');
inputPhoto.type = 'file';
inputPhoto.id = 'input-photo';
inputPhoto.accept = 'image/*';
inputPhoto.required = true;
inputPhoto.hidden = true;

const labelPhoto = document.createElement('label');
labelPhoto.htmlFor = 'input-photo';
labelPhoto.className = 'custom-file';
labelPhoto.textContent = '+ Ajouter photo';

const pFormat = document.createElement('p');
pFormat.textContent = 'jpg, png : 4mo max';

addPhotoDiv.appendChild(iconImage);
addPhotoDiv.appendChild(inputPhoto);
addPhotoDiv.appendChild(labelPhoto);
addPhotoDiv.appendChild(pFormat);

const labelTitre = document.createElement('label');
labelTitre.htmlFor = 'titre';
labelTitre.textContent = 'Titre';

const inputTitre = document.createElement('input');
inputTitre.type = 'text';
inputTitre.id = 'titre';

const labelCat = document.createElement('label');
labelCat.htmlFor = 'categorie';
labelCat.textContent = 'Catégorie';

const selectCat = document.createElement('select');
selectCat.id = 'categorie';

const hr2 = document.createElement('hr');

const btnValider = document.createElement('button');
btnValider.type = 'submit';
btnValider.id = 'valider-photo';
btnValider.textContent = 'Valider';

const msgChampManquant = document.createElement('div');
msgChampManquant.id = 'message-formulaire';
msgChampManquant.style.display = 'none';

modale2.appendChild(retourModale);
modale2.appendChild(h3Modale2);
modale2.appendChild(addPhotoDiv);
modale2.appendChild(labelTitre);
modale2.appendChild(inputTitre);
modale2.appendChild(labelCat);
modale2.appendChild(selectCat);
modale2.appendChild(hr2);
modale2.appendChild(btnValider);
modale2.appendChild(msgChampManquant);

modaleContenu.appendChild(fermerModale);
modaleContenu.appendChild(modale1);
modaleContenu.appendChild(modale2);
modale.appendChild(modaleContenu);


// FONCTIONNEMENT MODALE 1
const modifierLien = document.getElementById('modifier-projets');
modifierLien.addEventListener('click', async (e) => {
  e.preventDefault();
  modale.style.display = 'flex';
  modale2.style.display = 'none';
  modale1.style.display = 'block';
     
  await fetchWorks();   
  await chargerGalerieModale(); 
});

fermerModale.addEventListener('click', (e) => {
  e.preventDefault();
  modale.style.display = 'none';
});

retourModale.addEventListener('click', (e) => {
  e.preventDefault();
  modale2.style.display = 'none';
  modale1.style.display = 'block';
});

modale.addEventListener('click', (e) => {
  if (e.target === modale) {
    modale.style.display = 'none';
  }
});

async function chargerGalerieModale() {
  galerieModale.innerHTML = '';
  const travaux = await fetchWorks();

  travaux.forEach(photo => {
    const container = document.createElement('div');
    container.className = 'photo-container';

    const img = document.createElement('img');
    img.src = photo.imageUrl;
    img.alt = photo.title;
    img.className = 'photo';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-delete';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash-can icon-delete';

    btnDelete.appendChild(icon);
    btnDelete.addEventListener('click', (e) => {
      e.preventDefault();
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
    allWorks = []; // Vider le cache
    const travaux = await fetchWorks();
    affichergalerie(travaux);
    await chargerGalerieModale();
  } else {
    alert('Erreur lors de la suppression');
  }
}

// REDIRECTION MODALE 2
lienAjoutPhoto.addEventListener('click', (e) => {
  e.preventDefault();
  modale1.style.display = 'none';
  modale2.style.display = 'block';
  CategorieSelect();
});

// CREATION LISTE DEROULANTE CATEGORIES
async function CategorieSelect() {
  const categories = await fetchCategories();

  selectCat.innerHTML = '<option value=""></option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    selectCat.appendChild(option);
  });
}

// AJOUT D'UNE NOUVELLE PHOTO
let selectedImageFile = null;

inputPhoto.addEventListener('change', function () {
  const file = this.files[0];

   if (file && file.size > 4 * 1024 * 1024) {
    alert("Image trop lourde (max 4 Mo)");
    this.value = "";
    return;
  }

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
  }
}

inputPhoto.addEventListener('change', verifierChamps);
titreInput.addEventListener('input', verifierChamps);
categorieSelect.addEventListener('change', verifierChamps);

let timeoutMsg;
validerPhoto.addEventListener('click', async (e) => {
  e.preventDefault();

  const titre = titreInput.value.trim();
  const categorie = categorieSelect.value;
  const token = localStorage.getItem('token');

  if (!selectedImageFile || !titre || !categorie) {
  const msgChampManquant = document.getElementById('message-formulaire');
  msgChampManquant.textContent = 'Veuillez remplir tous les champs.';
  msgChampManquant.style.color = 'red';
  msgChampManquant.style.display = 'block'; 

  clearTimeout(timeoutMsg);
  timeoutMsg = setTimeout(() => {
    msgChampManquant.style.display = 'none';
  }, 2000);
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
      addPhotoDiv.innerHTML = '';
      addPhotoDiv.style.padding = '';

      addPhotoDiv.appendChild(iconImage);
      addPhotoDiv.appendChild(inputPhoto);
      addPhotoDiv.appendChild(labelPhoto);
      addPhotoDiv.appendChild(pFormat);

      allWorks = [];
      allCategories = [];

      const travaux = await fetchWorks();
      const categories = await fetchCategories();

      affichergalerie(travaux);
      afficherFiltres(categories);
      activerFiltres(travaux);
      await chargerGalerieModale();

      modale.style.display = 'none';
    } else {
      alert("Erreur lors de l'envoi : " + response.status);
    }
});
