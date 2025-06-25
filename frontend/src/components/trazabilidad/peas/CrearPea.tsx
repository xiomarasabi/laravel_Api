import { Pea, useCrearPea } from '../../../hooks/trazabilidad/pea/useCrearPea';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearPea = () => {
    const mutation = useCrearPea();
    const navigate = useNavigate();

    const formFields = [
        { id: 'nombre', label: 'Nombre', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevoPea: Pea = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
        };

        if (!nuevoPea.nombre || !nuevoPea.descripcion) {
            alert("Por favor completa todos los campos.");
            return;
        }

        console.log("Enviando PEA al backend:", nuevoPea);

        mutation.mutate(nuevoPea, {
            onSuccess: () => {
                console.log("PEA creado exitosamente, redirigiendo a /pea...");
                navigate("/pea", { replace: true }); ;
            },
            onError: (error) => {
                console.error("Error al crear PEA:", error);
                alert("Ocurrió un error al registrar el PEA.");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Registrar Nuevo PEA"  
            />
        </div>
    );
};

export default CrearPea;
