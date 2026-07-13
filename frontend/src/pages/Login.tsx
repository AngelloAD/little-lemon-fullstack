import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form'; // Importamos las herramientas necesarias
import { useAuth } from '../context/AuthContext';

// 1. Definimos la estructura esperada para el estado de la ruta de redirección
interface LocationState {
    from?: {
        pathname: string;
    };
}

// Nueva Interfaz para tipar los campos del formulario
interface LoginFormInputs {
    nombre: string;
    password: string;
}

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 2. Casteamos de forma segura el estado de la localización para leer la ruta previa
    const state = location.state as LocationState;
    const from = state?.from?.pathname || '/menu';

    const [error, setError] = useState<string>('');

    // Inicializamos useForm con nuestro tipo de datos
    const { register, handleSubmit } = useForm<LoginFormInputs>();

    // Nueva función para manejar el envío de datos tipados (React Hook Form ya hace el preventDefault por ti)
    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setError('');

        // Enviamos 'data.nombre' y 'data.password' provenientes del hook
        const result = await login(data.nombre, data.password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(typeof result.error === 'string' ? result.error : 'Error al iniciar sesión.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <h1 className="font-display text-4xl text-lemon-green font-semibold text-center mb-2">
                        Iniciar sesión
                    </h1>
                    <p className="text-center text-gray-500 mb-8">
                        Bienvenido de vuelta a Little Lemon
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Conectamos el submit de React Hook Form aquí */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            {/* Reemplazamos value y onChange por el register */}
                            <input
                                type="text"
                                placeholder="Tu nombre de usuario"
                                className="input-field"
                                {...register('nombre', { required: true })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            {/* Reemplazamos value y onChange por el register */}
                            <input
                                type="password"
                                placeholder="Tu contraseña"
                                className="input-field"
                                {...register('password', { required: true })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-lemon-green hover:underline font-medium">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;