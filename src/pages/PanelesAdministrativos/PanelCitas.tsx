

const PanelCitas = () => {
 

    return (
        <div>
            <h2>Gestión de Citas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citas.map((cita) => (
                        <tr key={cita.id}>
                            <td>{cita.id}</td>
                            <td>{cita.nombre}</td>
                            <td>{cita.fecha}</td>
                            <td>{cita.hora}</td>
                            <td>{cita.status}</td>
                            <td>
                                <button onClick={() => handleChangeStatus(cita.id, 'confirmado')}>Confirmar</button>
                                <button onClick={() => handleChangeStatus(cita.id, 'cerrado')}>Cerrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PanelCitas;
