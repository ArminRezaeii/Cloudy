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
function getFileUrl(fileId: Id<"_storage">) {
    return `https://hip-anaconda-146.convex.cloud/api/storage/${fileId}`
}
function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
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
function FileCard({ file, allFavorites }: { file: Doc<"files">, allFavorites: Doc<"favorites">[] }) {
    const typesIcon = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })
    const isFavorited = allFavorites.some(f => f.fileId == file._id)


    return (
        <Card >
            <CardHeader className='relative'>
                <CardTitle className='flex gap-3 text-base font-normal' >
                    <div className='flex justify-center'>   {typesIcon[file.type]}</div>
                    {file.name} </CardTitle>
                <div className='absolute top-2 right-2'>
                    <FileCardActions isFavorited={isFavorited} file={file} />
                </div>
            </CardHeader>

            <CardContent className="h-[200px] flex justify-center items-center">
                {file.type == "image" && <Image
                    alt={file.name}
                    width={200}
                    height={100}
                    src={getFileUrl(file.fileId)}

                />}

                {file.type == "csv" && <GanttChartIcon className='w-20 h-20' />}
                {file.type == "pdf" && <FileTextIcon className='w-20 h-20' />}

            </CardContent>
            <CardFooter className='flex justify-between '>
                <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
                    <Avatar className='w-6 h-6 '>
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                <div className='text-xs text-gray-700'>
                    Uploaded on {formatRelative((new Date(file._creationTime), 3), new Date())}
                </div>
            </CardFooter>
        </Card>
    )
}

export default FileCard