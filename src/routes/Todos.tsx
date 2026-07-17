import { useState } from "react"
import { useTodos, useAddTodo, useDeleteTodo } from "@/api/todos/todos.ts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Loader2 } from "lucide-react"

export default function Todos() {
    const { data: todos, isLoading, error } = useTodos()
    const addTodo = useAddTodo()
    const deleteTodo = useDeleteTodo()

    const [title, setTitle] = useState("")

    const handleAdd = () => {
        if (!title.trim()) return
        addTodo.mutate(title, {
            onSuccess: () => setTitle(""),
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAdd()
    }

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Todos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Neues Todo"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button onClick={handleAdd} disabled={addTodo.isPending}>
                        {addTodo.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Hinzufügen"
                        )}
                    </Button>
                </div>

                {isLoading && <p className="text-sm text-muted-foreground">Lädt...</p>}
                {error && (
                    <p className="text-sm text-destructive">Fehler: {error.message}</p>
                )}

                <ul className="space-y-2">
                    {todos?.map((todo) => (
                        <li
                            key={todo.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                            <div>{todo.todo}</div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTodo.mutate(todo.id)}
                                disabled={deleteTodo.isPending}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </li>
                    ))}
                </ul>

                {todos?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                        Keine Todos vorhanden.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}