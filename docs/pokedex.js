const pokemonsUrl = './pokemons.json'; // Ruta al archivo JSON local

let pokemons = []; // Array que contiene la informacion de los pokemones

// Traemos los elementos del DOM para las funciones
const searchInput = document.getElementById('searchInput'); // input de buscar
const pokemonContainer = document.getElementById('pokemonContainer'); // contenedor de datos del pokemon
const modal = document.getElementById('modal'); // subcontenedor con mas informacion del pokemon
const modalName = document.getElementById('modalName'); // Nombre
const modalType = document.getElementById('modalType'); // Tipo
const modalWeight = document.getElementById('modalWeight'); // Tamaño
const modalMoves = document.getElementById('modalMoves'); // Movimientos
const closeBtn = document.getElementsByClassName('close')[0]; // Boton de cerrar modal

// 
fetch(pokemonsUrl)
.then(response => { // traemos el JSON
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); 
})
.then(data => { // obtenemos los datos
    pokemons = data; 
    displayPokemons(pokemons);
})
.catch(error => { // Si llega haber un error
    console.error('Error:', error.message); 
});

// Funcion para mostrar los pokemones en tarjetas
function displayPokemons(pokemons) {
    pokemonContainer.innerHTML = '';
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${pokemon.name}</h3>
            <p>Type: ${pokemon.type}</p>
        `;
    card.addEventListener('click', () => openModal(pokemon));
    pokemonContainer.appendChild(card);
});
}

// Abrir el modal con información detallada del pokemon
function openModal(pokemon) {
    modal.style.display = 'block';
    modalName.innerText = pokemon.name;
    modalType.innerText = `Type: ${pokemon.type}`;
    modalWeight.innerText = `Weight: ${pokemon.weight}`;
    modalMoves.innerText = `Moves: ${pokemon.moves.join(', ')}`;
}

// Cerrar el modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Filtrar pokemones por nombre al escribir en el campo de búsqueda
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    displayPokemons(filteredPokemons);
});
