import React from 'react';
import Button from '../globales/Button';
import { useNavigate } from "react-router-dom";

interface FormField {
    id: string;
    label: string;
    type: string;
    options?: { value: string | number; label: string }[];

    value?: string;
    
}

interface FormProps {
    fields: FormField[];
    onSubmit: (formData: { [key: string]: string }) => void;
    isError?: boolean;
    isSuccess?: boolean;
    title: string;  
    initialValues?: { [key: string]: string };


}
const Formulario: React.FC<FormProps> = ({ fields, onSubmit, isError, isSuccess, title,initialValues }) => {
    const [formData, setFormData] = React.useState<{ [key: string]: string }>(initialValues || {}); // ✅ Usa initialValues
    const navigate = useNavigate();


    React.useEffect(() => {
        setFormData(initialValues || {}); // ✅ Cuando cambien los initialValues, actualiza el estado
    }, [initialValues]);


    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formData);     
    };

    const handleButtonClick = () => {
        console.log('Detalles del formulario:', formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{title}</h2>
            
            {fields.map((field) => (
                <div key={field.id} className="mb-4">
                    <label htmlFor={field.id} className="block mb-2 font-bold">
                        {field.label}
                    </label>

                    {field.type === 'select' ? (
                        <select
                            id={field.id}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            value={formData[field.id] || ''}
                        >
                            <option value="">Seleccione una opción</option> 
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                    <input
                    type={field.type}
                    id={field.id}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => {
                        const value = e.target.value;
                        handleChange(field.id, field.type === "datetime-local" ? new Date(value).toISOString() : value);
                    }}
                    value={
                        field.type === "datetime-local" && formData[field.id]
                        ? new Date(formData[field.id]).toISOString().slice(0, 16) // Convertir timestamp a `YYYY-MM-DDTHH:mm`
                        : formData[field.id] ?? ""
                    }
                    placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    />
                    )}
                </div>
            ))}

            {isError && (
                <div className="text-red-500 mt-4 mb-4 flex justify-center items-center">
                    Error al enviar el formulario
                </div>
            )}
            {isSuccess && (
                <div className="text-green-500 mt-4 mb-4 flex justify-center items-center">
                    Enviado exitosamente
                </div>
            )}
            <div className="flex justify-center items-center mt-8">
                <Button text="Registrar" className='mx-2' onClick={handleButtonClick}  variant="success" />
                <Button text="Cancelar" className="mx-2" onClick={() => navigate(-1)} variant="danger" />

            </div>

        </form>
    );
};

export default Formulario;

