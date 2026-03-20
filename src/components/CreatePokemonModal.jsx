import { useState, useRef } from "react";

const TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const TYPE_COLORS = {
  normal: "bg-gray-200 text-gray-700",
  fire: "bg-orange-100 text-orange-700",
  water: "bg-blue-100 text-blue-700",
  grass: "bg-green-100 text-green-700",
  electric: "bg-yellow-100 text-yellow-700",
  ice: "bg-cyan-100 text-cyan-700",
  fighting: "bg-red-100 text-red-700",
  poison: "bg-purple-100 text-purple-700",
  ground: "bg-amber-100 text-amber-700",
  flying: "bg-indigo-100 text-indigo-700",
  psychic: "bg-pink-100 text-pink-700",
  bug: "bg-lime-100 text-lime-700",
  rock: "bg-stone-100 text-stone-700",
  ghost: "bg-violet-100 text-violet-700",
  dragon: "bg-blue-200 text-blue-900",
  dark: "bg-gray-300 text-gray-900",
  steel: "bg-slate-100 text-slate-700",
  fairy: "bg-rose-100 text-rose-700",
};

function CreatePokemonModal({ onClose, onSave, existingCount }) {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [stats, setStats] = useState({ hp: 50, attack: 50, defense: 50, speed: 50 });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => handleImageFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : prev.length < 2
        ? [...prev, type]
        : prev
    );
  };

  const handleStatChange = (stat, value) => {
    setStats((prev) => ({ ...prev, [stat]: Number(value) }));
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("Donne un nom à ton Pokémon !");
    if (selectedTypes.length === 0) return alert("Choisis au moins un type !");

    const newPokemon = {
      id: 10000 + existingCount + 1,
      name: name.trim().toLowerCase(),
      isCustom: true,
      sprites: {
        front_default: imagePreview || "https://via.placeholder.com/128?text=?",
        other: {
          "official-artwork": {
            front_default: imagePreview || null,
          },
        },
      },
      types: selectedTypes.map((t) => ({ type: { name: t } })),
      stats: [
        { stat: { name: "hp" }, base_stat: stats.hp },
        { stat: { name: "attack" }, base_stat: stats.attack },
        { stat: { name: "defense" }, base_stat: stats.defense },
        { stat: { name: "speed" }, base_stat: stats.speed },
      ],
      species: { url: "" },
    };

    onSave(newPokemon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-indigo-800 tracking-tight">
            ✨ Créer un Pokémon
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition font-bold"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Image du Pokémon
          </label>
          <div
            className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all
              ${dragOver ? "border-indigo-500 bg-indigo-50 scale-[1.02]" : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"}
            `}
            style={{ minHeight: "160px" }}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 h-32 object-contain rounded-xl"
                />
                <span className="mt-2 text-xs text-gray-400">
                  Clique pour changer
                </span>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-500 text-center px-4">
                  Glisse une image ici ou{" "}
                  <span className="text-indigo-600 font-semibold">clique pour uploader</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Nom
          </label>
          <input
            type="text"
            placeholder="Ex: Flaminos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 capitalize"
          />
        </div>


        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Types{" "}
            <span className="text-gray-400 font-normal">(max 2)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border-2 transition-all
                  ${selectedTypes.includes(type)
                    ? "border-indigo-500 ring-2 ring-indigo-300 scale-105 " + TYPE_COLORS[type]
                    : "border-transparent " + TYPE_COLORS[type] + " opacity-60 hover:opacity-100"}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Stats de base
          </label>
          <div className="flex flex-col gap-3">
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="flex items-center gap-3">
                <span className="w-20 text-xs font-semibold capitalize text-gray-500">
                  {stat}
                </span>
                <input
                  type="range"
                  min={1}
                  max={150}
                  value={value}
                  onChange={(e) => handleStatChange(stat, e.target.value)}
                  className="flex-1 accent-indigo-500"
                />
                <span className="w-8 text-right text-sm font-bold text-indigo-600">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all text-lg shadow-lg shadow-indigo-200"
        >
          🎉 Créer ce Pokémon !
        </button>
      </div>
    </div>
  );
}

export default CreatePokemonModal;