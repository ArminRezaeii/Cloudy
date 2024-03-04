import React, { ReactNode, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from '../../../convex/_generated/dataModel'
import { Button } from '../ui/button'
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TextIcon, TrashIcon } from "lucide-react";
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
import Image from 'next/image';
function getFileUrl(fileId: Id<"_storage">) {
    console.log(fileId)
    https://hip-anaconda-146.convex.cloud/api/storage/f628a069-a065-4cdd-98ba-bb7771f7cdaf
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`

}
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
    const typesIcon = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;
    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-3'>
                    <div className='flex justify-center'>   {typesIcon[file.type]}</div>
                    {file.name} </CardTitle>
                <div className='absolute top-2 right-2'><FileCardActions file={file} /></div>

            </CardHeader>
            <CardContent className=' bg flex justify-center  items-center'>
                {file.type == "image" && <Image
                    alt={file.name}
                    width={200}
                    height={100}
                    src={getFileUrl(file.fileId)}
                />}
                {file.type == "csv" && <GanttChartIcon className='w-20 h-20' />}
                {file.type == "pdf" && <FileTextIcon className='w-20 h-20' />}

            </CardContent>
            <CardFooter className='flex justify-center'>
                <Button onClick={() => {
                    window.open(getFileUrl(file.fileId), "blank")
                }}>Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard