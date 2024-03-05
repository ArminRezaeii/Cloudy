'use client'
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import FileForm from "@/components/shared/FileForm";
import FileCard from "@/components/shared/FileCard";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import { useState } from "react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
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

export default function FileData({ title, favorite}: { title: string, favorite?: boolean}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.file.getFiles, orgId ? { orgId, query,favorite } : "skip")
  const isLoading = getFiles == undefined
  return (

    <div >
      <div className="w-full">
        {isLoading && <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 text-primary animate-spin " />
          <span className="text-2xl">Loading...</span>
        </div>}

        {!isLoading && (<>
          <div className="flex justify-between  items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />

            <FileForm />
          </div>
          {getFiles?.length == 0 && (
            <PlaceHolder />
          )}
          <div className="grid grid-cols-3 gap-4">
            {getFiles?.map((file) => <FileCard key={file._id} file={file} />)}
          </div>

        </>)}
      </div>
    </div>

  );
}
