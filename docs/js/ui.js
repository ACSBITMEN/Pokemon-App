// ui.js

// Iconos por tipo de Pokemon
export const typeIconClasses = {
  bug: 'fa-spider',
  dark: 'fa-moon',
  dragon: 'fa-dragon',
  electric: 'fa-bolt',
  fairy: 'fa-vial',
  fighting: 'fa-mitten',
  fire: 'fa-fire',
  ghost: 'fa-ghost',
  grass: 'fa-leaf',
  ground: 'fa-mountain',
  ice: 'fa-igloo',
  normal: 'fa-paw',
  poison: 'fa-skull-crossbones',
  psychic: 'fa-brain',
  rock: 'fa-cube',
  water: 'fa-water',
  steel: 'fa-wrench',
  flying: 'fa-dove',
};

// Color por tipo de Pokemon
export const typeColors = {
  bug: '#5ccda7',
  dark: '#607ec9',
  dragon: '#f9db5c',
  electric: '#faff00',
  fairy: '#ffe5f0',
  fighting: '#ffd675',
  fire: '#ff9460',
  ghost: '#9f90ea',
  grass: '#9bfab0',
  ground: '#e8c39e',
  ice: '#9affff',
  normal: '#deeafc',
  poison: '#e0b0ff',
  psychic: '#dbb6ee',
  rock: '#c2d1d9',
  water: '#96b3ff',
  steel: '#fafdff',
  flying: '#cddffb',
};

// Fondos por tipo de Pokemon
export const typeModalBackgrounds = {
  bug: 'url(img/BugModalBackground.jpg)',
  dark: 'url(img/DarkModalBackground.jpg)',
  dragon: 'url(img/DragonModalBackground.jpg)',
  electric: 'url(img/ElectricModalBackground.jpg)',
  fairy: 'url(img/FairyModalBackground.jpg)',
  fighting: 'url(img/FightingModalBackground.jpg)',
  fire: 'url(img/FireModalBackground.jpg)',
  ghost: 'url(img/GhostModalBackground.jpg)',
  grass: 'url(img/BugModalBackground.jpg)',
  ground: 'url(img/GroundModalBackground.jpg)',
  ice: 'url(img/IceModalBackground.jpg)',
  normal: 'url(img/NormalModalBackground.jpg)',
  poison: 'url(img/PoisonModalBackground.jpg)',
  psychic: 'url(img/PsychicModalBackground.jpg)',
  rock: 'url(img/RockModalBackground.jpg)',
  water: 'url(img/WaterModalBackground.jpg)',
  steel: 'url(img/SteelModalBackground.jpg)',
  flying: 'url(img/FlyingModalBackground.jpg)',
};

// Funcion para crear una carta Pokémon
export function createCard(name, types, imageUrl, id) {
  const card = document.createElement('div');
  card.id = 'pokeTarjet';
  card.classList.add('card');

  const typeCard = document.createElement('div');
  typeCard.id = 'typeCard';

  types.forEach(type => {
      const iconElement = document.createElement('i');
      iconElement.classList.add('fas');
      const iconClass = typeIconClasses[type.type.name];
      if (iconClass) {
          iconElement.classList.add(iconClass);
      }
      typeCard.appendChild(iconElement);
  });

  const numberCard = document.createElement('div');
  numberCard.id = 'numberCard';
  numberCard.textContent = `#${id}`;

  const containerTopCard = document.createElement('div');
  containerTopCard.id = 'containerTopCard';
  containerTopCard.appendChild(typeCard);
  containerTopCard.appendChild(numberCard);

  card.setAttribute('data-bs-toggle', 'modal');
  card.setAttribute('data-bs-target', '#Modal');
  card.appendChild(containerTopCard);

  const imgElement = document.createElement('img');
  imgElement.classList.add('img-fluid');
  imgElement.dataset.src = imageUrl;

  imgElement.alt = name;

  // Aplicar lazy loading
  lazyLoadImage(imgElement);

  const nameElement = document.createElement('h3');
  nameElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);

  card.appendChild(imgElement);
  card.appendChild(nameElement);

  if (types.length > 0) {
      const typeName = types[0].type.name.toLowerCase();
      changeBackgroundColor(typeName, card);
  }

  return card;
}

// Función para lazy loading de imágenes
function lazyLoadImage(img) {
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const imgElement = entry.target;
              imgElement.src = imgElement.dataset.src;
              observer.unobserve(imgElement);
          }
      });
  });
  observer.observe(img);
}

// // Función para cambiar Fondos según tipo de Pokemon
export function changeModalBackground(typeName, modalContainerImg) {
  const modalBackgroundUrl = typeModalBackgrounds[typeName];
  if (modalBackgroundUrl) {
      modalContainerImg.style.backgroundImage = modalBackgroundUrl;
  } else {
      modalContainerImg.style.backgroundImage = ''; // Default background
  }
}

// // Función para cambiar Fondos de Modal según tipo de Pokemon
export function changeBackgroundColor(typeName, card) {
  const backgroundColor = typeColors[typeName];
  if (backgroundColor) {
      card.style.backgroundColor = backgroundColor;
  } else {
      card.style.backgroundColor = '#fff'; // Default color
  }
}

// Function to display Pokémon in the UI
export function displayPokemons(pokemons, container, openModalCallback) {
  container.innerHTML = '';
  pokemons.forEach(pokemon => {
      const { name, types, weight, height, moves, sprites, id, base_experience } = pokemon;
      const card = createCard(name, types, sprites.front_default, id);
      card.addEventListener('click', () =>
          openModalCallback(name, sprites.front_default, types, weight, moves, height, base_experience)
      );
      container.appendChild(card);
  });
}

// Función para configurar controles de paginación
export function setupPagination(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Anterior';
  prevButton.classList.add('btn');
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
          onPageChange(currentPage - 1);
      }
  });
  container.appendChild(prevButton);

  const pageIndicator = document.createElement('span');
  pageIndicator.textContent = ` Página ${currentPage} de ${totalPages} `;
  container.appendChild(pageIndicator);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Siguiente';
  nextButton.classList.add('btn');
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
      }
  });
  container.appendChild(nextButton);
}

// Función para abrir el modal con detalles del Pokémon
export function openModal(name, imageUrl, types, weight, moves, height, base_experience) {
  const modalName = document.getElementById('modalName');
  const modalImg = document.getElementById('modalImg');
  const modalType = document.getElementById('modalType');
  const modalWeight = document.getElementById('modalWeight');
  const modalHeight = document.getElementById('modalHeight');
  const modalMoves = document.getElementById('modalMoves');
  const modalExperience = document.getElementById('modalExperience');
  const modalContainerImg = document.getElementById('modalContainerImg');

  modalName.innerText = name.toUpperCase();
  modalImg.src = imageUrl;
  modalType.innerText = `Type: ${types.map(type => type.type.name).join(', ')}`;
  modalWeight.innerText = `Weight: ${weight}`;
  modalHeight.innerText = `Height: ${height}`;
  modalExperience.innerText = `Experience: ${base_experience}`;

  if (modalMoves) {
      modalMoves.innerText = `Moves: ${moves
          .slice(0, 5)
          .map(move => move.move.name)
          .join(', ')}`; // Show the first 5 moves
  }

  if (types.length > 0) {
      const modalTypeName = types[0].type.name.toLowerCase();
      changeModalBackground(modalTypeName, modalContainerImg);
  } else {
      modalContainerImg.style.backgroundImage = ''; // Default background
  }
}


