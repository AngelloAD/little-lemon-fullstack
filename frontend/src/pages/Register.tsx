import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

interface RegisterFormInputs {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const { register: authRegister, loading } = useAuth();
    const navigate = useNavigate();
    const [generalError, setGeneralError] = useState<string>('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormInputs>({
        mode: "onChange" // ✅ MEJORA: Valida en tiempo real mientras el usuario escribe
    });

    const passwordValue = watch('password');

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setGeneralError('');

        const result = await authRegister(data.nombre, data.email, 'CLIENTE', data.password);

        if (result.success) {
            navigate('/ordenes', { replace: true });
        } else {
            setGeneralError(typeof result.error === 'string' ? result.error : 'Error al registrar.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <h1 className="font-display text-4xl text-lemon-green font-semibold text-center mb-2">
                        Crear cuenta
                    </h1>
                    <p className="text-center text-gray-500 mb-8">
                        Únete a Little Lemon para hacer reservas
                    </p>

                    {generalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Campo: Nombre de usuario */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                            <input
                                type="text"
                                placeholder="ej. maria_garcia"
                                className={`input-field ${errors.nombre ? 'border-red-400 focus:ring-red-200' : ''}`}
                                {...register('nombre', {
                                    required: 'Este campo es obligatorio.',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres.' }
                                })}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">⚠️ {errors.nombre.message}</p>}
                        </div>

                        {/* Campo: Correo electrónico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                                {...register('email', {
                                    required: 'Este campo es obligatorio.',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email inválido.'
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email.message}</p>}
                        </div>

                        {/* Campo: Contraseña con Validación de Seguridad Robusta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Letras, números y símbolos"
                                className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-200' : ''}`}
                                {...register('password', {
                                    required: 'La contraseña es obligatoria.',
                                    minLength: {
                                        value: 8,
                                        message: 'La contraseña debe tener al menos 8 caracteres.'
                                    },
                                    // ✅ NUEVAS VALIDACIONES LÓGICAS EN EL CLIENTE
                                    validate: {
                                        hasUppercase: (value) =>
                                            /[A-Z]/.test(value) || 'Debe incluir al menos una letra mayúscula.',
                                        hasLowercase: (value) =>
                                            /[a-z]/.test(value) || 'Debe incluir al menos una letra minúscula.',
                                        hasNumber: (value) =>
                                            /[0-9]/.test(value) || 'Debe incluir al menos un número.',
                                        hasSpecial: (value) =>
                                            /[@$!%*?&#]/.test(value) || 'Debe incluir un carácter especial (ej. @, $, !, %, *, ?, &, #).'
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password.message}</p>}
                        </div>

                        {/* Campo: Confirmar contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                className={`input-field ${errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : ''}`}
                                {...register('confirmPassword', {
                                    required: 'Este campo es obligatorio.',
                                    validate: (value) => value === passwordValue || 'Las contraseñas no coinciden.'
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-lemon-green hover:underline font-medium">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;