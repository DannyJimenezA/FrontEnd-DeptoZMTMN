import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
  searchBy: string;
  onSearchByChange: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchBy, onSearchByChange }) => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text); // Llama a la función de búsqueda en tiempo real
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      {/* Input de Búsqueda */}
      <input
        type="text"
        placeholder={`Buscar por ${searchBy}`}
        value={searchText}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Selector de filtro de búsqueda */}
      <select
        value={searchBy}
        onChange={(e) => onSearchByChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="nombre">Nombre</option>
        <option value="cedula">Cédula</option>
      </select>
    </div>
  );
};

export default SearchBar;
