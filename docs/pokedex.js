const pokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=202'; //existen 1281 pokemon a la fecha 06/2023

let pokemons = []; //array de Pokemones

const searchInput = document.getElementById('searchInput');
const pokemonContainer = document.getElementById('pokemonContainer');
const modal = document.getElementById('modal');
const modalName = document.getElementById('modalName');
const modalImg = document.getElementById('modalImg');
const modalType = document.getElementById('modalType');
const modalWeight = document.getElementById('modalWeight');
const modalHeight = document.getElementById('modalHeight');
const modalMoves = document.getElementById('modalMoves');
const modalExperience = document.getElementById('modalExperience');

// Median el metodo Fetch Traemos a los pokemones indicados en la URL
async function fetchPokemons() {
    try {
        const response = await fetch(pokemonsUrl);
        const data = await response.json();
        pokemons = data.results;
        displayPokemons(pokemons);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Funcion para Mostrar la informacion de los Pokemones
function displayPokemons(pokemons) {
    pokemonContainer.innerHTML = ''; // Remplazamos todo el contenido de Id="pokemonContainer"
    pokemons.forEach(async pokemon => { // Itaramos los pokemones
        try { // si es correcto entonces
            const response = await fetch(pokemon.url); // Realizamos la solicitud usando Fetch
            const data = await response.json(); // traemos el archivo en JSON
            const { name, types, weight, height, moves, sprites, id,  base_experience, abilities} = data; // creamos las variables de los datos usados de los pokemones
            const card = createCard(name, types, sprites.front_default, id); //
            card.addEventListener('click', () => openModal(name, sprites.front_default, types, weight, moves, height, base_experience));
            pokemonContainer.appendChild(card);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
}

//Funcion para crear cartas
function createCard(name, types, imageUrl, id) {
    const card = document.createElement('div');
    card.setAttribute('id', 'pokeTarjet');
    card.classList.add('card', 'm-1', 'text-center', 'justify-content-between');
    const typeCard = document.createElement('div');
    typeCard.setAttribute('id', 'typeCard');
    typeCard.classList.add('m-0', 'p-0');
    types.forEach(type => {
    const iconElement = document.createElement('i');
    iconElement.classList.add('fas');
        // Agrega las clases correspondientes al icono según el tipo del Pokemon
        if (type.type.name === 'grass') {
            iconElement.classList.add('fa-leaf');
        } else if (type.type.name === 'fire') {
            iconElement.classList.add('fa-fire');
        } else if (type.type.name === 'water') {
            iconElement.classList.add('fa-water');
        } else if (type.type.name === 'bug') {
            iconElement.classList.add('fa-spider');
        } else if (type.type.name === 'electric') {
            iconElement.classList.add('fa-bolt');
        } else if (type.type.name === 'flying') {
            iconElement.classList.add('fa-dove');
        } else if (type.type.name === 'dark') {
            iconElement.classList.add('fa-moon');
        } else if (type.type.name === 'dragon') {
            iconElement.classList.add('fa-dragon');
        } else if (type.type.name === 'ghost') {
            iconElement.classList.add('fa-ghost');
        } else if (type.type.name === 'fighting') {
            iconElement.classList.add('fa-mitten');
        } else if (type.type.name === 'ground') {
            iconElement.classList.add('fa-mountain');
        } else if (type.type.name === 'ice') {
            iconElement.classList.add('fa-igloo');
        } else if (type.type.name === 'normal') {
            iconElement.classList.add('fa-paw');
        } else if (type.type.name === 'poison') {
            iconElement.classList.add('fa-skull-crossbones');
        } else if (type.type.name === 'psychic') {
            iconElement.classList.add('fa-brain');
        } else if (type.type.name === 'rock') {
            iconElement.classList.add('fa-cube');
        } else if (type.type.name === 'steel') {
            iconElement.classList.add('fa-wrench');
        } else if (type.type.name === 'fairy') {
            iconElement.classList.add('fa-vial');
        }
        // Agrega más iconos para otros tipos de Pokemon
        typeCard.appendChild(iconElement);
    });

    const numberCard = document.createElement('div');
    numberCard.setAttribute('id', 'numberCard');
    numberCard.classList.add('m-0', 'p-0');
    numberCard.textContent = `#${id}`;
    const containerTopCard = document.createElement('div');
    containerTopCard.setAttribute('id', 'containerTopCard');
    containerTopCard.classList.add('d-flex', 'justify-content-around');
    containerTopCard.appendChild(typeCard);
    containerTopCard.appendChild(numberCard);

    card.setAttribute('data-bs-toggle', 'modal');
    card.setAttribute('data-bs-target', '#Modal');
    card.appendChild(containerTopCard);

    card.innerHTML += `
        <img class="img-fluid" src="${imageUrl}" alt="${name}">
        <h3 class="fs-6 rounded-bottom-2">${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
    `;

    const typeName = types[0].type.name; // Se asume que siempre hay al menos un tipo
    changeBackgroundColor(typeName, card);

    return card;
}


// Cambia el color del fondo segun el Pokemon
function changeBackgroundColor(typeName, card) {
    const colors = {
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
      // Agrega más tipos y colores según las necesidades
    };
    const backgroundColor = colors[typeName.toLowerCase()];
        card.style.backgroundColor = backgroundColor;
}

// Filtra los Pokemones en tiempo real segun el buscador
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    displayPokemons(filteredPokemons);
});

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
    // Agrega más tipos y rutas de imágenes
};

// Abrir el modal con información detallada del pokemon
function openModal(name, imageUrl, types, weight, moves, height, base_experience) {
    modalName.innerText = name.toUpperCase();
    modalImg.src = imageUrl;
    modalType.innerText = `Type: ${types.map(type => type.type.name).join(', ')}`;
    modalWeight.innerText = `Weight: ${weight}`;
    modalHeight.innerText = `Height: ${height}`;
    modalExperience.innerText = `Experiencie: ${base_experience}`;
    
    const modalTypeName = types[0].type.name.toLowerCase(); // Se asume que siempre hay al menos un tipo
    changeModalBackground(modalTypeName);
}

function changeModalBackground(typeName) {
    const modalBackgroundUrl = typeModalBackgrounds[typeName];
    modalContainerImg.style.backgroundImage = modalBackgroundUrl;
}


// Trae el resultado
fetchPokemons();