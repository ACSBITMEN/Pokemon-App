const pokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?offset=3&limit=50';

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
    pokemons.forEach(async pokemon => { // buscamos todos los pokemones
        try { // si es correcto entonces
            const response = await fetch(pokemon.url); // guardamos la URL por cada pokemon
            const data = await response.json(); // traemos el archivo JSON
            const { name, types, weight, moves, sprites } = data; // creamos las variables de los datos usados de los pokemones
            const card = createCard(name, types, sprites.front_default); // 
            card.addEventListener('click', () => openModal(name, sprites.front_default, types, weight, moves));
            pokemonContainer.appendChild(card);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
}

// Create a card element for a pokemon
function createCard(name, types, imageUrl) {
    const card = document.createElement('div');
    card.setAttribute('id', 'pokeTarjet');
    card.classList.add('card', 'm-2');
    card.setAttribute('data-bs-toggle', 'modal');
    card.setAttribute('data-bs-target', '#Modal');
    card.innerHTML =
        `<h3>${name}</h3>
        <img src="${imageUrl}" alt="${name}">
        <p>Type: ${types.map(type => type.type.name).join(', ')}</p>`;
    return card;
}

// Abrir el modal con información detallada del pokemon
function openModal(name, imageUrl, types, weight, moves) {
    modalName.innerText = name;
    modalImg.src = imageUrl;
    modalType.innerText = `Type: ${types.map(type => type.type.name).join(', ')}`;
    modalWeight.innerText = `Weight: ${weight}`;
    modalMoves.innerText = `Moves: ${moves.map(move => move.move.name).join(', ')}`;
}


// Filter pokemons by name as user types in the search input
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    displayPokemons(filteredPokemons);
});

// Fetch pokemons on page load
fetchPokemons();