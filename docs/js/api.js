// api.js

// Función para obtener la lista de Pokémon
export async function fetchPokemonList(limit = 1000) {
  try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`);
      const data = await response.json();
      return data.results;
  } catch (error) {
      console.error('Error fetching Pokémon list:', error.message);
      throw error;
  }
}

// Función para obtener detalles de Pokémon
export async function fetchPokemonDetails(pokemons) {
  const pokemonDetailsPromises = pokemons.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
  );
  try {
      const pokemonDetails = await Promise.all(pokemonDetailsPromises);
      return pokemonDetails;
  } catch (error) {
      console.error('Error fetching Pokémon details:', error.message);
      throw error;
  }
}

// Función para pre-cargar imágenes
export function preloadImages(pokemonDetails) {
  pokemonDetails.forEach(pokemon => {
      const img = new Image();
      img.src = pokemon.sprites.front_default;
  });
}
