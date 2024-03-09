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
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { FileIcon, FileTextIcon, GanttChartIcon, Heart, HeartOff, ImageIcon, MoreVertical, StarHalf, StarIcon, TextIcon, TrashIcon, UndoIcon } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { Protect } from '@clerk/nextjs';
import { formatRevalidate } from 'next/dist/server/lib/revalidate';
export function getFileUrl(fileId: Id<"_storage">) {
    return `https://hip-anaconda-146.convex.cloud/api/storage/${fileId}`
}
export default function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
    const deleteFile = useMutation(api.file.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { toast } = useToast()
    const toggleFavorite = useMutation(api.file.toggleFavorite)
    const restoreFile = useMutation(api.file.restoreFile)

    const handleDeleteFile = async () => {
        try {
            await deleteFile({
                fileId: file._id
            })

            toast({
                variant: "default",
                title: "File set for deletion",
                description: "this file will be deleted in 30 minutes."
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
    const handleFavoriteFile = () => {
        toggleFavorite({
            fileId: file._id,

        })
    }
    return (<>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will initiate the file for our deletion process. Files are subject to periodic deletion
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
                <DropdownMenuItem className="flex gap-1  items-center cursor-pointer" onClick={() => {
                    window.open(getFileUrl(file.fileId), "blank")
                }}>
                    <FileIcon className='w-4 h-4' />Download
                </DropdownMenuItem>

                <DropdownMenuItem className="flex gap-1  items-center cursor-pointer" onClick={handleFavoriteFile}>
                    {isFavorited ?
                        <div className='flex gap-1 items-center'>
                            <HeartOff className='w-4 h-4' />    Unfavourite
                        </div> :
                        <div className='flex gap-1 items-center'>
                            <Heart className='w-4 h-4' /> Favorite
                        </div>}

                </DropdownMenuItem>
                <Protect
                    role='org:admin' fallback={<></>}
                >
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        if (file.shouldDelete) {
                            restoreFile({ fileId: file._id })

                        } else {
                            setIsConfirmOpen(true)
                        }
                    }}>
                        {file.shouldDelete ? <div className="flex gap-1 text-green-600 items-center cursor-pointer"><UndoIcon className='w-4 h-4' /> Restore </div> :
                            <div className="flex gap-1 items-center text-red-600 cursor-pointer">
                                <TrashIcon className='w-4 h-4' />
                                Delete
                            </div>
                        }
                    </DropdownMenuItem>
                </Protect>
            </DropdownMenuContent>
        </DropdownMenu>

    </>)
}