function PokemonCard({pokemon,onClik}){
    return(
        <div
        key={pokemon.id}
        className="bg-white rounded-2xl shadow-lg 
        p-6 text-center hover:shadow-2xl hover:scale-105 transition-all 
        duration-300 cursor-pointer border border-gray-100"
        onClick={()=>onClik(pokemon)}
>
        <img src={
          pokemon.sprit.other["official-artwork"].front_default ||
          pokemon.sprit.front_default  
        } alt={pokemon.name}
        className="w-28 h-28 mx-auto rounded-full bg-gray-50 p-3"
         />

         <h2 className="text-xl font-semibold capitalize mt-4 text-indigo-700"
         >{pokemon.name}</h2>
                        
        </div>
    )
}

export default PokemonCard;