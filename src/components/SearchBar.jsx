function SearchBar({ searchTerm, onChange }) {
  return (
    <input
      type="search"
      placeholder="Search Pokémon..."
      className="w-full p-4 rounded-full text-xl bg-white shadow"
      value={searchTerm}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;