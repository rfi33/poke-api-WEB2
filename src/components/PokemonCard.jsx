function PokemonCard({ pokemon, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => onClick(pokemon)}
    >
      <img
        src={
          pokemon.sprites.other["official-artwork"].front_default ||
          pokemon.sprites.front_default
        }
        alt={pokemon.name}
        className="w-28 h-28 mx-auto rounded-full bg-gray-50 p-3"
      />
      <h2 className="text-xl font-semibold capitalize mt-4 text-indigo-700">
        {pokemon.name}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        #{String(pokemon.id).padStart(3, "0")}
      </p>
      <div className="flex justify-center gap-2 mt-2 flex-wrap">
        {pokemon.types.map((t, i) => (
          <span
            key={i}
            className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;