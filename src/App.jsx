import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [searchTerm, setSearchTerm] = useState("");
  const [create,setCreate] = useState(null);
const filteredPokemons = pokemons.filter(pokemon =>
  pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
);
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);

        const urls = [];
        for (let i = 1; i <=20; i++) {
          urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`);
        }

        const responses = await Promise.all(urls.map((url) => axios.get(url)));
        const data = responses.map((res) => res.data);
        setPokemons(data);
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
        const speciesResponse = await axios.get(selectedPokemon.species.url);
        const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
        const chain = parseEvolutionChain(evolutionResponse.data.chain);
        setEvolutionChain(chain);
      } catch (err) {
        console.error("Erreur lors de la récupération des évolutions :", err);
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
        Pokedex
      </h1>

{selectedPokemon && (
  <div
className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
bg-white rounded-2xl shadow-2xl border border-gray-100
w-[90vw] max-w-xl min-h-[520px] p-4 sm:p-6"
  >
    <button
      onClick={() => setSelectedPokemon(null)}
      className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
    >
      ✕
    </button>

    <h2 className="text-xl sm:text-2xl font-bold capitalize text-center text-indigo-800 mb-3">
      {selectedPokemon.name} #{String(selectedPokemon.id).padStart(3, "0")}
    </h2>

    <img
      src={
        selectedPokemon.sprites.other["official-artwork"].front_default ||
        selectedPokemon.sprites.front_default
      }
      alt={selectedPokemon.name}
      className="w-24 h-24 sm:w-32 sm:h-32 mx-auto my-2 rounded-full bg-gray-50 p-2"
    />

    <div className="text-center mb-4">
      <h3 className="font-semibold text-lg text-indigo-700 mb-2">Type(s)</h3>
      <div className="flex justify-center gap-2 flex-wrap">
        {selectedPokemon.types.map((t, index) => (
          <span
            key={index}
            className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full"
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <h3 className="font-semibold text-indigo-700 mb-2">Stats</h3>
        <ul className="space-y-1">
          {selectedPokemon.stats.slice(0, 4).map((stat) => (
            <li
              key={stat.stat.name}
              className="flex justify-between bg-gray-50 px-2 py-1 rounded"
            >
              <span className="capitalize">{stat.stat.name}</span>
              <span className="font-semibold text-indigo-600">
                {stat.base_stat}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-indigo-700 mb-2">Évolutions</h3>
        {evolutionChain.length > 0 ? (
          <div className="flex flex-col gap-2">
            {evolutionChain.slice(0, 3).map((evo) => (
              <div key={evo.name} className="flex items-center gap-2">
                <img
                  src={evo.image}
                  alt={evo.name}
                  className="w-10 h-10 rounded-full bg-gray-50 p-1"
                />
                <span className="capitalize text-indigo-600 font-semibold text-sm">
                  {evo.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucune évolution</p>
        )}
      </div>
    </div>
  </div>
)}


<div className="">
  <input
    type="search"
    placeholder="Search Pokémon"
    className="w-full p-4 rounded-full text-xl bg-white "
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

<div className="mt-4 grid grid-cols-3 gap-8">
  {filteredPokemons.map((pokemon) => ( 
    <div
      key={pokemon.id}
      className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => setSelectedPokemon(pokemon)}
    >
      <img
        src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
        className="w-28 h-28 mx-auto rounded-full bg-gray-50 p-3"
      />
      <h2 className="text-xl font-semibold capitalize mt-4 text-indigo-700">{pokemon.name}</h2>
      <p className="text-sm text-gray-500"></p>
    </div>
  ))}
</div>

{searchTerm && filteredPokemons.length === 0 && !loading && (
  <div className="text-center text-gray-500 mt-8">
    Aucun Pokémon trouvé pour "{searchTerm}"
  </div>
)}
      

      {loading && <div className="text-center text-2xl text-gray-600">Chargement...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

    </div>
  );
}

export default App;
