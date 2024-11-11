// app.js

import { fetchPokemonList, fetchPokemonDetails } from './api.js';
import {
    displayPokemons,
    setupPagination,
    openModal,
    typeIconClasses,
    typeColors,
    typeModalBackgrounds,
} from './ui.js';

const pokemonsPerPage = 40;
let currentPage = 1;
let totalPokemons = 0;
let totalPages = 0;
let pokemons = []; // Array of all Pokémon (name and URL)
let filteredPokemons = []; // Array of filtered Pokémon
let isFiltered = false; // Indicates if we are showing filtered results

const searchInput = document.getElementById('searchInput');
const pokemonContainer = document.getElementById('pokemonContainer');
const paginationContainer = document.getElementById('paginationContainer');
const modeToggle = document.getElementById('modeToggle');
const root = document.documentElement;

// Event listener for dark/light mode toggle
modeToggle.addEventListener('click', () => {
    if (root.getAttribute('data-theme') === 'dark') {
        root.setAttribute('data-theme', 'light');
        modeToggle.textContent = 'Modo Dark';
    } else {
        root.setAttribute('data-theme', 'dark');
        modeToggle.textContent = 'Modo Light';
    }
});

// Function to fetch and display the Pokémon list
async function fetchAndDisplayPokemonList() {
    try {
        pokemons = await fetchPokemonList();
        totalPokemons = pokemons.length;
        totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
        displayPage(currentPage);
        setupPaginationControls();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to display the Pokémon on the current page
function displayPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const pokemonsToDisplay = isFiltered
        ? filteredPokemons.slice(startIndex, endIndex)
        : pokemons.slice(startIndex, endIndex);

    fetchPokemonDetails(pokemonsToDisplay)
        .then(pokemonDetails => {
            displayPokemons(pokemonDetails, pokemonContainer, openModal);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

// Function to set up pagination controls
function setupPaginationControls() {
    setupPagination(paginationContainer, currentPage, totalPages, (page) => {
        displayPage(page);
        setupPaginationControls();
    });
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') {
        isFiltered = false;
        totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
        currentPage = 1;
        displayPage(currentPage);
        setupPaginationControls();
    } else {
        isFiltered = true;
        filteredPokemons = pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        const totalFilteredPokemons = filteredPokemons.length;
        totalPages = Math.ceil(totalFilteredPokemons / pokemonsPerPage);
        currentPage = 1;
        displayPage(currentPage);
        setupPaginationControls();
    }
});

// Start the application
fetchAndDisplayPokemonList();
