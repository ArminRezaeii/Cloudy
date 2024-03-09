'use client'
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import FileForm from "@/components/shared/FileForm";
import FileCard from "@/components/shared/FileCard";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { DataTable } from "./FileTable";
import { columns } from "./Columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "../../../convex/_generated/dataModel";
function PlaceHolder() {
  return <div className="flex flex-col gap-8 items-center mt-60 w-full">
    <Image alt="Empty icon"
      width={200}
      height={200}
      src="/empty.svg"
    />
    <p className="text-2xl font-bold mt-2">You have no files upload one now</p>
    <FileForm />
  </div>

}

export default function FileData({ title, favorite, deletedOnly }: { title: string, favorite?: boolean, deletedOnly?: boolean }) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.file.getFiles, orgId ? { orgId, type: type == "all" ? undefined : type, query, favorite, deletedOnly } : "skip")
  const isLoading = getFiles == undefined
  const allFavorites = useQuery(api.file.getAllFavorites,
    orgId ? { orgId } : "skip"
  )
  const modifiedFiles =
    getFiles?.map((file) => ({
      ...file,
      isFavorited: (allFavorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (

    <div >
      <div className="w-full">



        <div className="flex justify-between flex-wrap items-center mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
     
            <SearchBar query={query} setQuery={setQuery} />

            <FileForm />
      
        </div>
        <Tabs defaultValue="table" >
          <div className="flex justify-between items-center">
            <TabsList className="mb-4 "  >
              <TabsTrigger value="grid" className="flex gap-2 items-center max-lg:hidden"><GridIcon />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center"><RowsIcon />
                Table
              </TabsTrigger>
            </TabsList>
            <div>
              <Select value={type} onValueChange={(newType: any) => {
                setType(newType)
              }}>
                <SelectTrigger className="w-[180px]" >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
          {isLoading ? <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 text-primary animate-spin " />
            <span className="text-2xl">Loading...</span>

          </div> :

            <>
              <TabsContent value="grid" className="max-lg:hidden">
                <div className="grid grid-cols-3 gap-4">
                  {modifiedFiles?.map((file) => <FileCard key={file._id} file={file} />)}
                </div>

              </TabsContent>
              <TabsContent value="table">
                {getFiles.length > 0 && (
                  <DataTable columns={columns} data={modifiedFiles} />
                )}
              </TabsContent></>

          }

        </Tabs>

        {getFiles?.length == 0 && (
          <PlaceHolder />
        )}



      </div>
    </div>

  );
}
