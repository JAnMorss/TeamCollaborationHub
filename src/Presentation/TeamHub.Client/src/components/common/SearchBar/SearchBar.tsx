import { useState } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-1 justify-center hidden lg:flex">
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <CiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search projects, tasks..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full transition-all duration-200 hover:border-gray-400"
          aria-label="Search projects and tasks"
        />
      </form>
    </div>
  );
}