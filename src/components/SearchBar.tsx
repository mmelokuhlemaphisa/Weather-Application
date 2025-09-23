import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (city: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <div className="flex">
      <input
        className="border rounded-l p-2"
        type="text"
        value={query}
        placeholder="Search city..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-r"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
