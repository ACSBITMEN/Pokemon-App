const pokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=105'; //existen 1281 pokemon a la fecha 06/2023

let pokemons = [];

const searchInput = document.getElementById('searchInput');
const pokemonContainer = document.getElementById('pokemonContainer');
const modal = document.getElementById('modal');
const modalName = document.getElementById('modalName');
const modalImg = document.getElementById('modalImg');
const modalType = document.getElementById('modalType');
const modalWeight = document.getElementById('modalWeight');
const modalMoves = document.getElementById('modalMoves');

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

// Funcion para Mostrar los Pokemones en las Cartas
function displayPokemons(pokemons) {
    pokemonContainer.innerHTML = ''; // Remplazamos todo el contenido de Id="pokemonContainer"
    pokemons.forEach(async pokemon => { // Itaramos los pokemones
        try { // si es correcto entonces
            const response = await fetch(pokemon.url); // Realizamos la solicitud usando Fetch
            const data = await response.json(); // traemos el archivo en JSON
            const { name, types, weight, moves, sprites, id} = data; // creamos las variables de los datos usados de los pokemones
            const card = createCard(name, types, sprites.front_default, id); //
            card.addEventListener('click', () => openModal(name, sprites.front_default, types, weight, moves));
            pokemonContainer.appendChild(card);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
}

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
        }
        // Agrega más condiciones para otros tipos de Pokemon
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
        <h3 class="fs-6 rounded-bottom-2">${name}</h3>
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
      // Agrega más tipos y colores según tus necesidades
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

// Abrir el modal con información detallada del pokemon
function openModal(name, imageUrl, types, weight, moves) {
    modalName.innerText = name;
    modalImg.src = imageUrl;
    modalType.innerText = `Type: ${types.map(type => type.type.name).join(', ')}`;
    modalWeight.innerText = `Weight: ${weight}`;
    modalMoves.innerText = `Moves: ${moves.map(move => move.move.name).join(', ')}`;
}

// Trae el resultado
fetchPokemons();