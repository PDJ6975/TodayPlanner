// Aquí definimos métodos para chequear la salud del servicio

import { supabase } from './supabase'

export const healthCheckService = {
    testConnection: async (): Promise<boolean> => {
        try {
            const { data, error } = await supabase.from('tasks').select('*').limit(1)

            if (error) {
                console.error('Error al intentar conectar con Supabase:', error)
                return false
            }

            console.log('✅ Conexión exitosa a Supabase:', data)
            return true
        } catch (err) {
            console.error('Error de conexión:', err)
            return false
        }
    },
}