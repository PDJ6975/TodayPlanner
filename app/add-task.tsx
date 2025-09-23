import { YStack, XStack,Input,Button,Text,TextArea,H2 } from "tamagui";
import { useState } from "react";
import { router } from "expo-router";
import { taskService } from "src/services/taskService";

export default function AddTaskModal() {

    const [title,setTitle] = useState('')
    const [note, setNote] = useState('')

    const handleAddTask = async () => {

        // Si el título no está vacío permitimos creación

        if(title.trim()) {
            await taskService.createTask(title, note)
            router.back() // Cerramos el modal
        }

    }

    return (

        <YStack gap="$4" justify="center" width="100%" px="$8">
            <H2>Añade una tarea</H2>
            <Input size="$4" placeholder="Introduzca el nombre de la tarea..." value={title} onChangeText={setTitle}/>
            <TextArea size="$4" placeholder="¿Alguna nota importante?" value={note} onChangeText={setNote}/>
            <XStack justify="center" gap="$4">
                <Button size="$4" flex={1} variant="outlined" onPress={handleAddTask}> Añadir </Button>
                <Button size="$4" flex={1} variant="outlined" onPress={router.back}> Cancelar </Button>
            </XStack>
        </YStack>

    )




}