import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from '../../../convex/_generated/dataModel'
import { Button } from '../ui/button'
import { MoreVertical, TrashIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';
function FileCardActions({ file }: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.file.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { toast } = useToast()
    const handleDeleteFile = async () => {
        try {
            await deleteFile({
                fileId: file._id
            })
            toast({
                variant: "default",
                title: "File deleted",
                description: "Your file is now gone from the system"
            })
        } catch (e) {
            console.error(e)
            toast({
                variant: 'destructive',
                title: "Error",
                description: "There was a problem, your file could not be deleted"
            })
        }
    }
    return (<>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteFile}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="flex gap-1 text-red-600 items-center cursor-pointer" onClick={() => setIsConfirmOpen(true)}><TrashIcon className='w-4 h-4' />Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    </>)
}
function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle>{file.name} </CardTitle>
                <div className='absolute top-2 right-2'><FileCardActions file={file} /></div>

            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard