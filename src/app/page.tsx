'use client'
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import FileForm from "@/components/shared/FileForm";

export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.file.getFiles, orgId ? { orgId } : "skip")
  return (
    <main className="container mx-auto pt-12 ">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
    <FileForm/>
      </div>
      {getFiles?.map((file) => <p>{file.name}</p>)}

    </main>
  );
}
