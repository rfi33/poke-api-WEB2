function PokemonModal({ pokemon, evolutionChain, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[90vw] max-w-xl min-h-[520px] p-4 sm:p-6">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
      >
        ✕
      </button>

      <h2 className="text-xl sm:text-2xl font-bold capitalize text-center text-indigo-800 mb-3">
        {pokemon.name} #{String(pokemon.id).padStart(3, "0")}
      </h2>

      <img
        src={
          pokemon.sprites.other["official-artwork"].front_default ||
          pokemon.sprites.front_default
        }
        alt={pokemon.name}
        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto my-2 rounded-full bg-gray-50 p-2"
      />

      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg text-indigo-700 mb-2">Type(s)</h3>
        <div className="flex justify-center gap-2 flex-wrap">
          {pokemon.types.map((t, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full capitalize"
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
            {pokemon.stats.slice(0, 4).map((stat) => (
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
  );
}

export default PokemonModal;