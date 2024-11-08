// import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface FiltroFechaProps {
//   fechaFiltro: Date | null;
//   onChangeFecha: (date: Date | null) => void;
// }

// const FiltroFecha: React.FC<FiltroFechaProps> = ({ fechaFiltro, onChangeFecha }) => {
//   return (
//     <div className="my-4">
//       <label className="block text-sm font-medium text-gray-700">Filtrar por fecha:</label>
//       <DatePicker
//         selected={fechaFiltro}
//         onChange={onChangeFecha}
//         dateFormat="yyyy-MM-dd"
//         placeholderText="Selecciona una fecha"
//         className="w-full mt-2 border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
//       />
//     </div>
//   );
// };

// export default FiltroFecha;

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FiltroFechaProps {
  fechaFiltro: Date | null;
  onChangeFecha: (date: Date | null) => void;
}

const FiltroFecha: React.FC<FiltroFechaProps> = ({ fechaFiltro, onChangeFecha }) => {
  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700">Filtrar por fecha:</label>
      <div className="flex items-center gap-2">
        <DatePicker
          selected={fechaFiltro}
          onChange={onChangeFecha}
          dateFormat="yyyy-MM-dd"
          placeholderText="Selecciona una fecha"
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Botón para limpiar la fecha seleccionada */}
        <button
          onClick={() => onChangeFecha(null)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Limpiar Fecha
        </button>
      </div>
    </div>
  );
};

export default FiltroFecha;
