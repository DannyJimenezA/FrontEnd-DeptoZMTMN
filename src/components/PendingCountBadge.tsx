// import React, { useState, useEffect } from 'react';
// import '../styles/Badges.css'

// interface PendingCountBadgeProps {
//   endpoint: string; // Endpoint para el tipo de solicitud
//   status: string;   // Estado a contar (en este caso, "Pendiente")
// }

// const PendingCountBadge: React.FC<PendingCountBadgeProps> = ({ endpoint, status }) => {
//   const [count, setCount] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchPendingCount = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch(`${endpoint}?status=${status}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         setCount(data.length); // Asume que la API devuelve un arreglo de solicitudes
//       } catch (error) {
//         console.error('Error fetching pending count:', error);
//         setCount(null);
//       }
//     };

//     fetchPendingCount();
//   }, [endpoint, status]);

//   if (count === null) return null;

//   return (
//     <span className="badge">{count}</span>
//   );
// };

// export default PendingCountBadge;

import React, { useState, useEffect } from 'react';
import '../styles/Badges.css';

interface PendingCountBadgeProps {
  endpoint: string;
  status: string;
}

const PendingCountBadge: React.FC<PendingCountBadgeProps> = ({ endpoint, status }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${endpoint}?status=${status}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setCount(data.length); // Asumiendo que la API devuelve un arreglo de solicitudes
      } catch (error) {
        console.error('Error fetching pending count:', error);
        setCount(null);
      }
    };

    fetchPendingCount();
  }, [endpoint, status]);

  // No mostrar nada si no hay solicitudes pendientes
  if (count === null || count === 0) return null;

  return (
    <span className="badge">{count}</span>
  );
};

export default PendingCountBadge;
