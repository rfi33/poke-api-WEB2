import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import SearchBar from "./components/SearchBar";
import CreatePokemonModal from "./components/CreatePokemonModal";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      if (!selectedPokemon || selectedPokemon.isCustom) return;
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

  const handleSaveNewPokemon = (newPokemon) => {
    setPokemons((prev) => [newPokemon, ...prev]);
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

      {showCreateModal && (
        <CreatePokemonModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNewPokemon}
          existingCount={pokemons.length}
        />
      )}

      {/* Barre de recherche + bouton créer */}
      <div className="flex gap-3 items-center mb-6">
        <div className="flex-1">
          <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-4 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white active:scale-95 transition-all duration-200 whitespace-nowrap text-base"
        >
          <span className="text-xl">＋</span>
          Créer
        </button>
      </div>

      {loading && (
        <div className="text-center text-2xl text-white mt-8">Chargement...</div>
      )}
      {error && (
        <div className="text-center text-red-300 mt-4">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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