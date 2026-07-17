import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------------------------------------------
// Read all rows
// ---------------------------------------------
export const fetchTodos = async () => {
    const { data, error } = await supabase
        .from('todos')
        .select('*')

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// ---------------------------------------------
// Read specific columns
// ---------------------------------------------
export const fetchTodosSpecificColumns = async () => {
    const { data, error } = await supabase
        .from('todos')
        .select('id,todo')

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// ---------------------------------------------
// Read referenced tables (Beispiel, falls du z.B. eine "categories"-Tabelle referenzierst)
// Voraussetzung: todos hat z.B. eine Spalte category_id, die auf categories.id verweist
// ---------------------------------------------
export const fetchTodosWithCategory = async () => {
    const { data, error } = await supabase
        .from('todos')
        .select(`
      id,
      todo,
      categories (
        id,
        name
      )
    `)

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// ---------------------------------------------
// With pagination
// ---------------------------------------------
export const fetchTodosPaginated = async (from: number, to: number) => {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .range(from, to)

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// ---------------------------------------------
// Insert
// ---------------------------------------------
export const addTodo = async (todo: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
        throw new Error("Nicht eingeloggt")
    }

    const { data, error } = await supabase
        .from('todos')
        .insert([{ todo, user_id: userData.user.id }])
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// ---------------------------------------------
// Delete
// ---------------------------------------------
export const deleteTodo = async (id: string) => {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}

// ---------------------------------------------
// React Query Hooks
// ---------------------------------------------
export function useTodos() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    })
}

export function useTodosPaginated(from: number, to: number) {
    return useQuery({
        queryKey: ['todos', 'paginated', from, to],
        queryFn: () => fetchTodosPaginated(from, to),
    })
}

export function useAddTodo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })
}

export function useDeleteTodo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })
}