// src/components/FilterButtons.tsx
import React from 'react';

interface FilterButtonsProps {
  onFilterChange: (estado: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilterChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onFilterChange('Pendiente')}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Pendiente
      </button>
      <button
        onClick={() => onFilterChange('Aprobada')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Aprobada
      </button>
      <button
        onClick={() => onFilterChange('Denegada')}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Denegada
      </button>
      <button
        onClick={() => onFilterChange('todos')}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Todos
      </button>
    </div>
  );
};

export default FilterButtons;
