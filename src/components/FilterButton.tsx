// import React from 'react';
// import styles from '../styles/FilterButton.module.css';

// interface FilterButtonsProps {
//   onFilterChange: (estado: string) => void;
// }

// const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilterChange }) => {
//   return (
//     <div className={styles['filter-buttons-container']}>
//       <button
//         onClick={() => onFilterChange('Pendiente')}
//         className={`${styles['filter-button']} ${styles['button-pendiente']}`}
//       >
//         Pendiente
//       </button>
//       <button
//         onClick={() => onFilterChange('Aprobada')}
//         className={`${styles['filter-button']} ${styles['button-aprobada']}`}
//       >
//         Aprobada
//       </button>
//       <button
//         onClick={() => onFilterChange('Denegada')}
//         className={`${styles['filter-button']} ${styles['button-denegada']}`}
//       >
//         Denegada
//       </button>
//       <button
//         onClick={() => onFilterChange('todos')}
//         className={`${styles['filter-button']} ${styles['button-todos']}`}
//       >
//         Todos
//       </button>
//     </div>
//   );
// };

// export default FilterButtons;

import React, { useEffect } from 'react';
import styles from '../styles/FilterButton.module.css';

interface FilterButtonsProps {
  onFilterChange: (estado: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilterChange }) => {
  useEffect(() => {
    // Llama a onFilterChange con "Pendiente" al montar el componente para aplicar el filtro por defecto
    onFilterChange('Pendiente');
  }, [onFilterChange]);

  return (
    <div className={styles['filter-buttons-container']}>
      <button
        onClick={() => onFilterChange('Pendiente')}
        className={`${styles['filter-button']} ${styles['button-pendiente']}`}
      >
        Pendiente
      </button>
      <button
        onClick={() => onFilterChange('Aprobada')}
        className={`${styles['filter-button']} ${styles['button-aprobada']}`}
      >
        Aprobada
      </button>
      <button
        onClick={() => onFilterChange('Denegada')}
        className={`${styles['filter-button']} ${styles['button-denegada']}`}
      >
        Denegada
      </button>
      <button
        onClick={() => onFilterChange('todos')}
        className={`${styles['filter-button']} ${styles['button-todos']}`}
      >
        Todos
      </button>
    </div>
  );
};

export default FilterButtons;
