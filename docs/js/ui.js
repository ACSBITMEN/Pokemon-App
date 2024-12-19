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
  bug: '#88D66C',
  dark: '#87A2FF',
  dragon: '#f9db5c',
  electric: '#faff00',
  fairy: '#FFCCEA',
  fighting: '#FFDA76',
  fire: '#ff9460',
  ghost: '#9f90ea',
  grass: '#50B498',
  ground: '#BC9F8B',
  ice: '#9affff',
  normal: '#deeafc',
  poison: '#e0b0ff',
  psychic: '#FF77B7',
  rock: '#c2d1d9',
  water: '#4CC9FE',
  steel: '#fafdff',
  flying: '#cddffb',
};


// Fondos por tipo de Pokemon
export const typeModalBackgrounds = {
  bug: 'url(img/BugModalBackground.jpg)',
  dark: 'url(img/DarkModalBackground.jpg)',
  dragon: 'url(img/RockModalBackground.jpg)',
  electric: 'url(img/ElectricModalBackground.jpg)',
  fairy: 'url(img/PsychicModalBackground.jpg)',
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
  steel: 'url(img/NormalModalBackground.jpg)',
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


// Función para cambiar Fondos de Modal según tipo de Pokemon
export function changeModalBackground(typeName, modalContainerImg) {
  const modalBackgroundUrl = typeModalBackgrounds[typeName];
  if (modalBackgroundUrl) {
      modalContainerImg.style.backgroundImage = modalBackgroundUrl;
  } else {
      modalContainerImg.style.backgroundImage = '';
  }
}

// Función para cambiar Fondos según tipo de Pokemon
export function changeBackgroundColor(typeName, card) {
  const backgroundColor = typeColors[typeName];
  if (backgroundColor) {
      card.style.backgroundColor = backgroundColor;
  } else {
      card.style.backgroundColor = '#000';
  }
}


// Function to display Pokémon in the UI
export function displayPokemons(pokemons, container, openModalCallback) {
  container.innerHTML = '';
  pokemons.forEach(pokemon => {
      const { name, types, weight, height, moves, sprites, id, base_experience, stats } = pokemon;
      const card = createCard(name, types, sprites.front_default, id);
      card.addEventListener('click', () =>
          openModalCallback(name, sprites.front_default, types, weight, moves, height, base_experience, stats, id)
      );
      container.appendChild(card);
  });
}

// Función para configurar controles de paginación usando componentes de Bootstrap
export function setupPagination(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = ''; // Limpiar el contenedor

  // Crear el elemento ul de paginación
  const paginationList = document.createElement('ul');
  paginationList.classList.add('pagination');

  // Crear botón "Anterior"
  const prevItem = document.createElement('li');
  prevItem.classList.add('page-item');
  if (currentPage === 1) {
    prevItem.classList.add('disabled');
  }
  const prevLink = document.createElement('a');
  prevLink.classList.add('page-link');
  prevLink.href = '#';
  prevLink.textContent = 'Anterior';
  prevLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  });
  prevItem.appendChild(prevLink);
  paginationList.appendChild(prevItem);

  // Calcular el rango de páginas a mostrar
  let startPage;
  let endPage;

  if (totalPages <= 5) {
    // Si hay 5 páginas o menos, mostrar todas
    startPage = 1;
    endPage = totalPages;
  } else {
    // Más de 5 páginas, calcular rangos dinámicamente
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Crear los elementos de número de página
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');
    if (i === currentPage) {
      pageItem.classList.add('active');
    }
    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (i !== currentPage) {
        onPageChange(i);
      }
    });
    pageItem.appendChild(pageLink);
    paginationList.appendChild(pageItem);
  }

  // Crear botón "Siguiente"
  const nextItem = document.createElement('li');
  nextItem.classList.add('page-item');
  if (currentPage === totalPages) {
    nextItem.classList.add('disabled');
  }
  const nextLink = document.createElement('a');
  nextLink.classList.add('page-link');
  nextLink.href = '#';
  nextLink.textContent = 'Siguiente';
  nextLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  });
  nextItem.appendChild(nextLink);
  paginationList.appendChild(nextItem);

  // Agregar la lista de paginación al contenedor
  container.appendChild(paginationList);
}

// Función para abrir el modal con detalles del Pokémon
export function openModal(name, imageUrl, types, weight, moves, height, base_experience, stats, id) {
  const modalName = document.getElementById('modalName');
  const modalImg = document.getElementById('modalImg');
  const modalType = document.getElementById('modalType');
  const modalWeight = document.getElementById('modalWeight');
  const modalHeight = document.getElementById('modalHeight');
  const modalMoves = document.getElementById('modalMoves');
  const modalExperience = document.getElementById('modalExperience');
  const modalContainerImg = document.getElementById('modalContainerImg');
  const modalStats = document.getElementById('modalStats'); // Contenedor de estadísticas
  const modalNumber = document.getElementById('numberPokemonModal'); // Contenedor para ID

  // Configuración básica
  modalName.innerText = name?.toUpperCase() || 'N/A';
  modalImg.src = imageUrl || '';
  modalType.innerText = `Tipo: ${types?.map(type => type.type.name).join(', ') || 'Desconocido'}`;
  modalWeight.innerText = `Peso: ${(weight / 10).toFixed(1)} kg` || 'N/A'; // Peso en kg
  modalHeight.innerText = `Altura: ${(height / 10).toFixed(1)} m` || 'N/A'; // Altura en m
  modalExperience.innerText = `Exp: ${base_experience || 'N/A'}`;
  modalNumber.innerText = `#${id || 'N/A'}`; // Mostrar ID

  // Estadísticas
  if (stats && modalStats) {
    stats.forEach(stat => {
      const statName = stat.stat.name.toLowerCase(); // Por ejemplo, 'hp', 'attack', etc.
      const statValue = stat.base_stat;

      // Selecciona el elemento correspondiente en el HTML
      const statElement = modalStats.querySelector(`.stat-${statName}`);
      if (statElement) {
        // Actualiza el valor de la estadística
        const progressBar = statElement.querySelector('.progress-bar');
        progressBar.style.width = `${Math.min(statValue, 100)}%`;
        progressBar.setAttribute('aria-valuenow', statValue);
        progressBar.innerText = statValue;
      }
    });
  }

    // Movimientos
    if (modalMoves) {
      modalMoves.innerText = `Movimientos: ${moves?.slice(0, 5).map(move => move.move.name).join(', ') || 'No disponibles'}`;
    }

  // Cambiar icon "Tipo:"


  // Cambiar fondo del modal según tipo
  if (types?.length > 0) {
    const modalTypeName = types[0].type.name.toLowerCase();
    changeModalBackground(modalTypeName, modalContainerImg);
  } else {
    modalContainerImg.style.backgroundImage = ''; // Fondo predeterminado
  }
}

// Efecto de 3D para .card
document.addEventListener('DOMContentLoaded', function () {
  const modalCard = document.querySelector('#modalCard'); // La tarjeta
  const modalImg = document.querySelector('#modalImg'); // La imagen dentro de la tarjeta

  // Eventos para la tarjeta
  modalCard.addEventListener('mousemove', (event) => {
      handleMouseMove(event, modalCard, 40); // Efecto en la tarjeta
      handleMouseMove(event, modalImg, 5); // Efecto en la imagen
  });

  modalCard.addEventListener('mouseleave', () => {
      handleMouseLeave(modalCard); // Restablece el efecto en la tarjeta
      handleMouseLeave(modalImg); // Restablece el efecto en la imagen
  });

  // Función para manejar el movimiento del mouse
  function handleMouseMove(event, element, angleFactor) {
      const boundingRect = modalCard.getBoundingClientRect(); // Usa las dimensiones de la tarjeta
      const mouseX = event.clientX - boundingRect.left;
      const mouseY = event.clientY - boundingRect.top;

      const rotateX = angleFactor * ((mouseY - boundingRect.height / 2) / boundingRect.height);
      const rotateY = -angleFactor * ((mouseX - boundingRect.width / 2) / boundingRect.width);

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  // Función para restablecer la posición al salir
  function handleMouseLeave(element) {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
});
