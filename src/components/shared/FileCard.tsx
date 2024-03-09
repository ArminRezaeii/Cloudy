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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Image from 'next/image';
import FileCardActions, { getFileUrl } from './FileActions';

function FileCard({ file }: { file: Doc<"files"> & { isFavorited: boolean }, }) {
    const typesIcon = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })



    return (
        <Card >
            <CardHeader className='relative'>
                <CardTitle className='flex gap-3 text-base font-normal' >
                    <div className='flex justify-center'>   {typesIcon[file.type]}</div>
                    {file.name} </CardTitle>
                <div className='absolute top-2 right-2'>
                    <FileCardActions isFavorited={file.isFavorited} file={file} />
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
                    Uploaded on {formatRelative((new Date(file._creationTime)), new Date())}
                </div>
            </CardFooter>
        </Card>
    )
}

export default FileCard