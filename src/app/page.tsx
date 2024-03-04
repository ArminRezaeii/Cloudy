'use client'
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import FileForm from "@/components/shared/FileForm";
import FileCard from "@/components/shared/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.file.getFiles, orgId ? { orgId } : "skip")
  const isLoading = getFiles == undefined
  return (
    <main className="container mx-auto pt-12 ">
      {isLoading && <div className="flex flex-col gap-8 w-full items-center mt-24">
        <Loader2 className="h-32 w-32 text-primary animate-spin " />
        <span className="text-2xl">Loading...</span>
      </div>}
      {!isLoading && getFiles?.length == 0 && (<>
        <div className="flex flex-col gap-8 items-center mt-60 w-full">
          <Image alt="Empty icon"
            width={200}
            height={200}
            src="/empty.svg"
          />
          <p className="text-2xl font-bold mt-2">You have no files upload one now</p>
          <FileForm />
        </div>

      </>
      )}
      {!isLoading && getFiles.length > 0 && (<>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <FileForm />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {getFiles?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>

      </>)}

    </main>
  );
}
