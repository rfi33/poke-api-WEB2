function PokemonModal({pokemon,evolutionChain,onClose}){
    if(!pokemon) return null;

    return(
        <div  className="z-50 fixed top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 bg-white 
        rounded-2xl shadow-2xl border border-gray-100 w-[90vw]
         max-w-xl min-h-[520px] p-4 sm:p-6">
            <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-red-600 
            text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
            >
                X
            </button>
            <h2 className="text-xl sm:text-2xl font-bold 
            capitalize text-center text-indigo-800 mb-3">
                {pokemon.name} #{String(pokemon.id).padStart(3,"0")}
            </h2>
            <img src={
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default
            } alt={pokemon.name} 
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto my-2 rounded-full bg-gray-50 p-2"
              />

        </div>
    )
}

export default PokemonModal;