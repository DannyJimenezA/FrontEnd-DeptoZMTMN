import { useEffect, useState } from 'react';
import axios from 'axios';

const PanelDenuncia = () => {
    

    return (
        <div>
            <h2>Gestión de Denuncias</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Detalles</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {denuncias.map((denuncia) => (
                        <tr key={denuncia.id}>
                            <td>{denuncia.id}</td>
                            <td>{denuncia.nombre}</td>
                            <td>{denuncia.detalles}</td>
                            <td>{denuncia.status}</td>
                            <td>
                                <button onClick={() => handleChangeStatus(denuncia.id, 'en revisión')}>En Revisión</button>
                                <button onClick={() => handleChangeStatus(denuncia.id, 'cerrado')}>Cerrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PanelDenuncia;
