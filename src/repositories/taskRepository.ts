import { supabase } from '../services/supabase'
import { Task } from '../types'

export const taskRepository = {
    findAll: async (userId: string): Promise<Task[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw new Error(`Error al intentar obtener todas las tareas: ${error.message}`)

        return data || []
    },

    findByDateRange: async (
        userId: string,
        startDate: string,
        endDate?: string
    ): Promise<Task[]> => {
        let query = supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', startDate)

        if (endDate) {
            query = query.lte('created_at', endDate)
        }

        const { data, error } = await query.order('created_at', { ascending: true })

        if (error) throw new Error(`Error al obtener las tareas por fecha: ${error.message}`)
        return data || []
    },

    findPendingBefore: async (userId: string, beforeDate: string): Promise<Task[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .lt('created_at', beforeDate)
            .eq('completed', false)
            .order('completed_at', { ascending: false })

        if (error)
            throw new Error(
                `Error al obtener tareas pendientes de días anteriores: ${error.message}`
            )
        return data || []
    },

    create: async (
        userId: string,
        taskData: Omit<Task, 'id' | 'created_at' | 'completed_at' | 'completed' | 'user_id'>
    ): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                ...taskData,
                user_id: userId,
                completed: false,
            })
            .select()
            .single()

        if (error) throw new Error(`Error al crear la nueva tarea: ${error.message}`)
        return data
    },

    update: async (
        userId: string,
        id: string,
        updates: Partial<Omit<Task, 'id' | 'created_at' | 'user_id'>>
    ): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw new Error(`Error al actualizar la tarea: ${error.message}`)
        return data
    },

    delete: async (userId: string, id: string): Promise<void> => {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) throw new Error(`Error al borrar la tarea: ${error.message}`)
    },
}