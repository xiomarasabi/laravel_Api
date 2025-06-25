import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ActualizarPeaInput {
  nombre: string;
  descripcion: string;
}

export const useActualizarPea = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Verificar token al instanciar el hook
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('🔐 No hay token al instanciar useActualizarPea, redirigiendo al login');
    navigate('/login');
  }

  return useMutation({
    mutationFn: async ({ id_pea, ...pea }: { id_pea: number } & ActualizarPeaInput) => {
      if (!apiUrl) {
        throw new Error('La variable de entorno VITE_API_URL no está definida.');
      }
      if (!token) {
        console.log('🔐 No hay token en mutationFn, redirigiendo al login');
        navigate('/login');
        throw new Error('No hay token disponible. Por favor, inicia sesión.');
      }

      console.log('📤 Enviando al backend (PUT /pea/:id_pea):', { id_pea, ...pea });
      const { data } = await axios.put(`${apiUrl}pea/${id_pea}`, pea, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('📥 Respuesta del backend:', data);
      return data;
    },
    onSuccess: async () => {
      console.log('✅ Invalidando y recargando query [peas]');
      await queryClient.invalidateQueries({ queryKey: ['peas'], exact: true, refetchType: 'active' });
      await queryClient.refetchQueries({ queryKey: ['peas'], exact: true });
    },
    onError: (error: any) => {
      console.error('❌ Error en la mutación:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      if (error.response?.status === 403 || error.message.includes('No hay token')) {
        localStorage.removeItem('token');
        console.log('🔐 Redirigiendo al login por error de autenticación');
        navigate('/login');
      }
    },
  });
};