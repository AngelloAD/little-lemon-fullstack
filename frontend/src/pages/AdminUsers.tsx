import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AdminUserItem {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'CLIENTE' | 'EMPLEADO' | string;
}

const AdminUsers: React.FC = () => {
    const { user: currentUser } = useAuth(); // Obtenemos el admin logueado para protección de cuenta
    const [users, setUsers] = useState<AdminUserItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    // Desvanecimiento automático de alertas de éxito y error tras 4 segundos
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // Consulta global a tu controlador: GET /usuarios
    const fetchAllUsers = () => {
        API.get<AdminUserItem[]>('usuarios')
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.error('Error al cargar usuarios:', err);
                setError('No tienes permisos para ver la lista de usuarios o el servidor falló.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    // Alternar el rol del usuario de forma interactiva: PATCH /usuarios/:id/rol
    const handleToggleRol = async (id: number, nombre: string, currentRol: string) => {
        if (id === currentUser?.id) {
            alert('Por seguridad, no puedes cambiar tu propio rol de Administrador.');
            return;
        }

        const nextRol = currentRol === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
        if (!window.confirm(`¿Estás seguro de cambiar el rol de "${nombre}" a [${nextRol}]?`)) return;

        setError('');
        setSuccess(false);

        try {
            await API.patch(`usuarios/${id}/rol`, { rol: nextRol });
            setSuccess(true);
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, rol: nextRol } : u))
            );
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al intentar actualizar el rol.');
        }
    };

    // ✅ NUEVA FUNCIÓN: Eliminación permanente de usuarios: DELETE /usuarios/:id
    const handleDeleteUser = async (id: number, nombre: string) => {
        // Protección de seguridad: Evitar que el administrador se elimine a sí mismo
        if (id === currentUser?.id) {
            alert('Acción denegada: No puedes eliminar tu propia cuenta en sesión.');
            return;
        }

        if (!window.confirm(`⚠️ ¡ADVERTENCIA CRÍTICA! ⚠️\n¿Estás seguro de que deseas eliminar permanentemente al usuario "${nombre}"?\nEsta acción borrará su cuenta y no se puede deshacer.`)) return;

        setError('');
        setSuccess(false);

        try {
            await API.delete(`usuarios/${id}`);
            setSuccess(true);

            // Removemos de inmediato al usuario borrado del estado para refrescar la tabla sin recargar la página
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err: any) {
            // NestJS responderá aquí con un error si el usuario tiene llaves foráneas activas (como órdenes o reservas vinculadas)
            setError(err.response?.data?.message || 'No se pudo eliminar al usuario. Podría tener órdenes o reservas activas.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-2">
                👥 Control de Personal y Clientes
            </h1>
            <p className="text-center text-gray-500 mb-10">
                Gestión de cuentas y asignación de privilegios de acceso para Little Lemon
            </p>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
                    ✅ ¡Operación realizada con éxito en el sistema!
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                    ❌ {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-lemon-gray border-b border-gray-200 text-lemon-dark text-sm font-bold">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Usuario</th>
                                    <th className="p-4">Correo Electrónico</th>
                                    <th className="p-4">Rol Actual</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {users.map((u: AdminUserItem) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-mono text-gray-400">#{u.id}</td>
                                        <td className="p-4 font-bold text-gray-800">{u.nombre}</td>
                                        <td className="p-4 text-gray-500">{u.email || <span className="text-gray-300 italic text-xs">Sin registro</span>}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase border ${u.rol === 'ADMIN'
                                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {u.rol === 'ADMIN' ? 'Administrador' : u.rol === 'CLIENTE' ? 'Cliente' : u.rol}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center space-x-3 whitespace-nowrap">
                                            {/* Botón Cambiar Rol */}
                                            <button
                                                onClick={() => handleToggleRol(u.id, u.nombre, u.rol)}
                                                disabled={u.nombre.toLowerCase() === 'admin'} // ❌ Bloqueado si es el admin principal
                                                className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-colors ${u.nombre.toLowerCase() === 'admin'
                                                    ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' // Estilo deshabilitado
                                                    : u.rol === 'ADMIN'
                                                        ? 'text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer'
                                                        : 'text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-pointer'
                                                    }`}
                                                title={u.nombre.toLowerCase() === 'admin' ? "Protegido: No puedes cambiar el rol del admin principal" : ""}
                                            >
                                                {u.rol === 'ADMIN' ? '🔽 Cambiar a Cliente' : '🔼 Ascender a Admin'}
                                            </button>

                                            {/* Botón de Eliminar Usuario */}
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.nombre)}
                                                disabled={u.nombre.toLowerCase() === 'admin'} // ❌ Bloqueado si es el admin principal
                                                className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-colors ${u.nombre.toLowerCase() === 'admin'
                                                    ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' // Estilo deshabilitado
                                                    : 'text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer'
                                                    }`}
                                                title={u.nombre.toLowerCase() === 'admin' ? "Protegido: El admin principal no se puede eliminar" : ""}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;