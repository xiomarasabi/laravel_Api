import { useState } from 'react';
import { useEras, type Eras } from '../../../hooks/iot/eras/useEras'; // Usa import type para la interfaz
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define el tipo para las filas de la tabla
interface TableRow {
    id: number;
    descripcion: string;
    lote: string;
    estado: string;
}

const Eras = () => {
    const { data: eras, isLoading, error } = useEras();
    const [selectedEra, setSelectedEra] = useState<Eras | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModalHandler = (era: Eras) => {
        setSelectedEra(era);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEra(null);
        setIsModalOpen(false);
    };

    const handleUpdate = (era: { id: number }) => {
        if (!era.id || isNaN(era.id)) {
            console.error('ID no válido para edición');
            return;
        }
        navigate(`/EditarEras/${era.id}`);
    };

    const headers = ['descripcion', 'lote', 'estado'];

    const handleRowClick = (row: TableRow) => {
        // Busca la era completa en erasList para pasar el objeto Eras completo
        const era = erasList.find((e: Eras) => e.id === row.id);
        if (era) {
            openModalHandler(era);
        }
    };

    const handleCreate = () => {
        navigate('/crear-eras');
    };

    const erasList = Array.isArray(eras) ? eras : [];

    const mappedEras: TableRow[] = erasList.map((era: Eras) => ({
        id: era.id,
        descripcion: era.descripcion || 'Sin descripción',
        lote: era.fk_id_lote?.nombre_lote || 'Sin nombre de lote',
        estado: era.estado || 'Sin estado',
    }));

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text('Eras activas', 14, 10);

        const tableData = mappedEras.map((era) => [
            era.id,
            era.descripcion,
            era.lote,
            era.estado,
        ]);

        autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: 20,
        });

        doc.save('Eras.activas.pdf');
    };

    if (isLoading) return <div>Cargando eras...</div>;
    if (error instanceof Error) return <div>Error al cargar las eras: {error.message}</div>;

    return (
        <div className="overflow-x-auto rounded-lg">
            <div className="flex justify-end items-center mb-4">
                <button
                    onClick={generarPDF}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Reporte PDF
                </button>
            </div>

            <Tabla
                title="Eras"
                headers={headers}
                data={mappedEras}
                onClickAction={handleRowClick}
                onUpdate={handleUpdate}
                onCreate={handleCreate}
                createButtonTitle="Crear"
            />

            {selectedEra && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalles de la Era"
                    contenido={selectedEra}
                />
            )}
        </div>
    );
};

export default Eras;