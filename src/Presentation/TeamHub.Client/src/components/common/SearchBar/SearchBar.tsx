import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); 
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
