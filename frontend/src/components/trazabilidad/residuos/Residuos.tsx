import { useState } from 'react';
import { useResiduos, Residuos } from '../../../hooks/trazabilidad/residuo/useResiduos';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';

// Interfaz para los datos de la tabla
interface ResiduoRow {
    id: number;
    nombre: string;
    fecha: string;
    descripcion: string;
    cultivo: string;
    tipo_residuo: string;
}

const ResiduosComponent = () => {
    const { data: residuos = [], isLoading, error } = useResiduos();
    const [selectedResiduo, setSelectedResiduo] = useState<Residuos | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModalHandler = (residuo: Residuos) => {
        setSelectedResiduo(residuo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedResiduo(null);
        setIsModalOpen(false);
    };

    const handleRowClick = (row: ResiduoRow) => {
        // Buscar el residuo original usando el id
        const residuo = residuos.find((r) => r.id_residuo === row.id);
        if (residuo) {
            openModalHandler(residuo);
        }
    };

    const handleUpdate = (row: ResiduoRow) => {
        navigate(`/residuos/editar/${row.id}`);
    };

    const handleCreate = () => {
        navigate('/crearresiduo');
    };

    if (isLoading) {
        return <div className="text-center py-4">Cargando residuos...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                Error al cargar los residuos: {error.message}
            </div>
        );
    }

    const mappedResiduos: ResiduoRow[] = residuos.map((residuo) => ({
        id: residuo.id_residuo,
        nombre: residuo.nombre || 'Sin nombre',
        fecha: residuo.fecha
            ? new Date(residuo.fecha).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : 'Sin fecha',
        descripcion: residuo.descripcion || 'Sin descripción',
        cultivo: residuo.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
        tipo_residuo: residuo.fk_id_tipo_residuo?.nombre_residuo || 'Sin tipo',
    }));

    const headers = [
    'id',
    'Nombre',
    'Fecha',
    'Descripcion',
    'Cultivo',
    'Tipo_residuo',
];

    return (
        <div className="overflow-x-auto rounded-lg p-4">
            <Tabla
                title="Lista de Residuos"
                headers={headers}
                data={mappedResiduos}
                onClickAction={handleRowClick}
                onUpdate={handleUpdate}
                onCreate={handleCreate}
                createButtonTitle="Crear Residuo"
            />
            {selectedResiduo && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalles del Residuo"
                    contenido={
                        <div className="space-y-2">
                            <p>
                                <strong>ID:</strong> {selectedResiduo.id_residuo}
                            </p>
                            <p>
                                <strong>Nombre:</strong> {selectedResiduo.nombre || 'Sin nombre'}
                            </p>
                            <p>
                                <strong>Fecha:</strong>{' '}
                                {selectedResiduo.fecha
                                    ? new Date(selectedResiduo.fecha).toLocaleDateString('es-CO', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                      })
                                    : 'Sin fecha'}
                            </p>
                            <p>
                                <strong>Descripción:</strong>{' '}
                                {selectedResiduo.descripcion || 'Sin descripción'}
                            </p>
                            <p>
                                <strong>Cultivo:</strong>{' '}
                                {selectedResiduo.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}
                            </p>
                            <p>
                                <strong>Tipo de Residuo:</strong>{' '}
                                {selectedResiduo.fk_id_tipo_residuo?.nombre_residuo || 'Sin tipo'}
                            </p>
                            <p>
                                <strong>Especie:</strong>{' '}
                                {selectedResiduo.fk_id_cultivo?.fk_id_especie?.nombre_comun ||
                                    'Sin especie'}
                            </p>
                            <p>
                                <strong>Semillero:</strong>{' '}
                                {selectedResiduo.fk_id_cultivo?.fk_id_semillero?.nombre_semilla ||
                                    'Sin semillero'}
                            </p>
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default ResiduosComponent;