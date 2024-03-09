

import { ColumnDef } from "@tanstack/react-table"
import { Doc } from "../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import FileCardActions from "./FileActions"
const UserProfile = (userId: any) => {
    const userProfile = useQuery(api.users.getUserProfile, { userId });
    return userProfile;
};

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "type",
        header: "Type",
    },
    {
        header: "User", cell: ({ row }) => {
            const userProfile = UserProfile(row.original.userId)
            return <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
                <Avatar className='w-6 h-6 '>
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {userProfile?.name}
            </div>
        },
    },
    {
        header: "Upladed On", cell: ({ row }) => {
            return <div>{formatRelative((new Date(row.original._creationTime)), new Date())}</div>
        },
    },
    {
        header: "Actions", cell: ({ row }) => {
            return <div><FileCardActions file={row.original} isFavorited={row.original.isFavorited} /></div>
        },
    }
]
