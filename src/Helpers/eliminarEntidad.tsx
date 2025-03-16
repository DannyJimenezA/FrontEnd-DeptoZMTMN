import { useState } from "react";
import ApiRoutes from "../components/ApiRoutes";

export const eliminarEntidad = <T extends { id: number }>(
  entidad: string,
  actualizarLista: (actualizarFn: (prevItems: T[]) => T[]) => void
) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);

  const abrirModalEliminar = (id: number) => {
    setIdEliminar(id);
    setIsConfirming(true);
    setMensaje(null); // Limpiar mensajes anteriores
    document.body.style.overflow = "hidden"; // Bloquear scroll
  };

  const manejarEliminar = async () => {
    if (idEliminar === null) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/${entidad}/${idEliminar}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        throw new Error(`No se encontró la ${entidad} con ID: ${idEliminar}`);
      }

      if (!response.ok) {
        throw new Error(`Error al eliminar la ${entidad} con ID: ${idEliminar}`);
      }

      actualizarLista((prevItems) => prevItems.filter((item) => item.id !== idEliminar));

      setMensaje({ tipo: "exito", texto: `${entidad.charAt(0).toUpperCase() + entidad.slice(1)} eliminada correctamente` });

      setTimeout(() => {
        cerrarModal();
      }, 2000);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error instanceof Error ? error.message : "Ocurrió un error desconocido" });
      console.error(`Error al eliminar la ${entidad}:`, error);
    }
  };

  const cerrarModal = () => {
    setIsConfirming(false);
    setMensaje(null);
    document.body.style.overflow = "auto";
  };

  const ModalEliminar = () =>
    isConfirming && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
          {mensaje ? (
            <>
              <p className={`text-lg font-semibold ${mensaje.tipo === "exito" ? "text-green-600" : "text-red-600"}`}>
                {mensaje.texto}
              </p>
              <button
                onClick={cerrarModal}
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cerrar
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold">¿Estás seguro?</h3>
              <p className="text-gray-600">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={manejarEliminar}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={cerrarModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );

  return { abrirModalEliminar, ModalEliminar };
};
