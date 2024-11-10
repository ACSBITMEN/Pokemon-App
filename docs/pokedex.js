const pokemonsPerPage = 40;
let currentPage = 1;
let totalPokemons = 0;
let totalPages = 0;
let pokemons = []; // Array de todos los Pokémon (nombre y URL)
let filteredPokemons = []; // Array de Pokémon filtrados
let isFiltered = false; // Indica si estamos mostrando resultados filtrados

const searchInput = document.getElementById('searchInput');
const pokemonContainer = document.getElementById('pokemonContainer');
const modalName = document.getElementById('modalName');
const modalImg = document.getElementById('modalImg');
const modalType = document.getElementById('modalType');
const modalWeight = document.getElementById('modalWeight');
const modalHeight = document.getElementById('modalHeight');
const modalMoves = document.getElementById('modalMoves');
const modalExperience = document.getElementById('modalExperience');
const modalContainerImg = document.getElementById('modalContainerImg'); // Asegúrate de que este elemento exista en tu HTML

const modeToggle = document.getElementById('modeToggle');
const root = document.documentElement;

modeToggle.addEventListener('click', () => {
    if (root.getAttribute('data-theme') === 'dark') {
        root.setAttribute('data-theme', 'light');
        modeToggle.textContent = 'Modo Dark';
    } else {
        root.setAttribute('data-theme', 'dark');
        modeToggle.textContent = 'Modo Light';
    }
});


// Contenedor para los controles de paginación
const paginationContainer = document.getElementById('paginationContainer'); // Añade este elemento en tu HTML

const typeIconClasses = {
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

const typeColors = {
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

const typeModalBackgrounds = {
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

// Obtener la lista completa de Pokémon (nombre y URL)
async function fetchPokemonList() {
    try {
        const limit = 1000; // Máximo permitido por la API en una sola solicitud
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`);
        const data = await response.json();
        pokemons = data.results;
        totalPokemons = pokemons.length;
        totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
        displayPage(currentPage);
        setupPagination(totalPages);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Mostrar los Pokémon de la página actual
function displayPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const pokemonsToDisplay = isFiltered
        ? filteredPokemons.slice(startIndex, endIndex)
        : pokemons.slice(startIndex, endIndex);
    fetchAndDisplayPokemons(pokemonsToDisplay);
}

// Obtener los detalles de los Pokémon a mostrar y mostrarlos
function fetchAndDisplayPokemons(pokemonsToDisplay) {
    pokemonContainer.innerHTML = '';
    const pokemonDetailsPromises = pokemonsToDisplay.map(pokemon =>
        fetch(pokemon.url).then(res => res.json())
    );
    Promise.all(pokemonDetailsPromises)
        .then(pokemonDetails => {
            displayPokemons(pokemonDetails);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

// Mostrar la información de los Pokémon
function displayPokemons(pokemons) {
    pokemonContainer.innerHTML = '';
    pokemons.forEach(pokemon => {
        const { name, types, weight, height, moves, sprites, id, base_experience } = pokemon;
        const card = createCard(name, types, sprites.front_default, id);
        card.addEventListener('click', () =>
            openModal(name, sprites.front_default, types, weight, moves, height, base_experience)
        );
        pokemonContainer.appendChild(card);
    });
}

// Crear cartas de Pokémon
function createCard(name, types, imageUrl, id) {
    const card = document.createElement('div');
    card.id = 'pokeTarjet';
    card.classList.add('card', 'm-1', 'text-center', 'justify-content-between');

    const typeCard = document.createElement('div');
    typeCard.id = 'typeCard';
    typeCard.classList.add('m-0', 'p-0');

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
    numberCard.classList.add('m-0', 'p-0');
    numberCard.textContent = `#${id}`;

    const containerTopCard = document.createElement('div');
    containerTopCard.id = 'containerTopCard';
    containerTopCard.classList.add('d-flex', 'justify-content-around');
    containerTopCard.appendChild(typeCard);
    containerTopCard.appendChild(numberCard);

    card.setAttribute('data-bs-toggle', 'modal');
    card.setAttribute('data-bs-target', '#Modal');
    card.appendChild(containerTopCard);

    const imgElement = document.createElement('img');
    imgElement.classList.add('img-fluid');
    imgElement.src = imageUrl;
    imgElement.alt = name;

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

// Cambiar el color de fondo según el tipo de Pokémon
function changeBackgroundColor(typeName, card) {
    const backgroundColor = typeColors[typeName];
    if (backgroundColor) {
        card.style.backgroundColor = backgroundColor;
    } else {
        card.style.backgroundColor = '#fff'; // Color por defecto si el tipo no se encuentra
    }
}

// Configurar los controles de paginación
function setupPagination(totalPages) {
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.add('btn');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayPage(currentPage - 1);
            setupPagination(totalPages);
        }
    });
    paginationContainer.appendChild(prevButton);

    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = ` Página ${currentPage} de ${totalPages} `;
    paginationContainer.appendChild(pageIndicator);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.add('btn');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayPage(currentPage + 1);
            setupPagination(totalPages);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Filtrar los Pokémon en tiempo real según el buscador
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') {
        isFiltered = false;
        totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
        currentPage = 1;
        displayPage(currentPage);
        setupPagination(totalPages);
    } else {
        isFiltered = true;
        filteredPokemons = pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        const totalFilteredPokemons = filteredPokemons.length;
        totalPages = Math.ceil(totalFilteredPokemons / pokemonsPerPage);
        currentPage = 1;
        displayPage(currentPage);
        setupPagination(totalPages);
    }
});

// Abrir el modal con información detallada del Pokémon
function openModal(name, imageUrl, types, weight, moves, height, base_experience) {
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
            .join(', ')}`; // Muestra los primeros 5 movimientos
    }

    if (types.length > 0) {
        const modalTypeName = types[0].type.name.toLowerCase();
        changeModalBackground(modalTypeName);
    } else {
        modalContainerImg.style.backgroundImage = ''; // Fondo por defecto
    }
}

// Cambiar el fondo del modal según el tipo de Pokémon
function changeModalBackground(typeName) {
    const modalBackgroundUrl = typeModalBackgrounds[typeName];
    if (modalBackgroundUrl) {
        modalContainerImg.style.backgroundImage = modalBackgroundUrl;
    } else {
        modalContainerImg.style.backgroundImage = ''; // Fondo por defecto si el tipo no se encuentra
    }
}

// Iniciar la aplicación
fetchPokemonList();
