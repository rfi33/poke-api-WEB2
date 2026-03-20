import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import SearchBar from "./components/SearchBar";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);

        const urls = [];
        for (let i = 1; i <= 20; i++) {
          urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`);
        }

        const responses = await Promise.all(urls.map((url) => axios.get(url)));
        setPokemons(responses.map((res) => res.data));
      } catch (err) {
        console.error("Erreur capturée:", err);
        setError("Erreur lors du chargement des Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (!selectedPokemon) return;

      try {
        const speciesRes = await axios.get(selectedPokemon.species.url);
        const evoRes = await axios.get(speciesRes.data.evolution_chain.url);
        setEvolutionChain(parseEvolutionChain(evoRes.data.chain));
      } catch (err) {
        console.error("Erreur évolutions :", err);
        setEvolutionChain([]);
      }
    };

    fetchEvolutionChain();
  }, [selectedPokemon]);

  const parseEvolutionChain = (chain) => {
    const evolutions = [];
    let current = chain;

    while (current) {
      evolutions.push({
        name: current.species.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          current.species.url.split("/")[6]
        }.png`,
      });
      current = current.evolves_to[0];
    }

    return evolutions;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-950 via-purple-500 to-pink-500 p-6">
      <h1 className="text-5xl font-extrabold text-center text-white mb-12 tracking-tight">
        Pokédex
      </h1>

      <PokemonModal
        pokemon={selectedPokemon}
        evolutionChain={evolutionChain}
        onClose={() => setSelectedPokemon(null)}
      />

      <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />

      {loading && (
        <div className="text-center text-2xl text-white mt-8">Chargement...</div>
      )}
      {error && (
        <div className="text-center text-red-300 mt-4">{error}</div>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={setSelectedPokemon}
          />
        ))}
      </div>

      {searchTerm && filteredPokemons.length === 0 && !loading && (
        <div className="text-center text-white mt-8">
          Aucun Pokémon trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default App;