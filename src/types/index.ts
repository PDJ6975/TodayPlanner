// Aquí definimos las interfaces de las entidades que vamos a especificar en supabase

export interface Task {
    id: string
    title: string
    note?: string
    completed: boolean
    created_at: string
    completed_at?: string | null
    user_id: string // referencia al usuario de la sesión (clave foránea)
}