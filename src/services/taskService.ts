import { taskRepository } from '../repositories/taskRepository'
import { supabase } from './supabase'
import { Task } from '../types'

// Helper para obtener usuario autenticado
async function getCurrentUserId(): Promise<string> {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error || !user) {
        throw new Error('Usuario no autenticado')
    }
    return user.id
}

export const taskService = {
    getTodayTask: async (): Promise<Task[]> => {
        const userId = await getCurrentUserId()
        const today = new Date().toISOString().split('T')[0]

        const todayTasks = await taskRepository.findByDateRange(userId, today)
        const pendingTasks = await taskRepository.findPendingBefore(userId, today)

        return [...pendingTasks, ...todayTasks]
    },

    createTask: async (title: string, note?: string): Promise<Task> => {
        if (!title.trim()) {
            throw new Error('El título de la tarea no puede estar vacío')
        }

        const userId = await getCurrentUserId()
        return await taskRepository.create(userId, {
            title: title.trim(),
            note: note?.trim() || undefined,
        })
    },

    completeTask: async (id: string): Promise<Task> => {
        const userId = await getCurrentUserId()
        return await taskRepository.update(userId, id, {
            completed: true,
            completed_at: new Date().toISOString(),
        })
    },

    unCompleteTask: async (id: string): Promise<Task> => {
        const userId = await getCurrentUserId()
        return await taskRepository.update(userId, id, {
            completed: false,
            completed_at: null,
        })
    },
}