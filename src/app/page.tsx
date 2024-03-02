'use client'
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const organization = useOrganization()
  const file = useMutation(api.file.createFile)
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.file.getFiles, orgId ? { orgId } : "skip")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <Button>Hello world</Button>
      {getFiles?.map((file) => <p>{file.name}</p>)}
      <Button onClick={() => {
        if (!orgId) return
        file({
          name: "hello world",
          orgId: orgId
        })
      }}>Add Name</Button>
    </main>
  );
}
