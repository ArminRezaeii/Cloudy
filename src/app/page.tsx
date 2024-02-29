'use client'
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const file = useMutation(api.file.createFile)
  const getFiles = useQuery(api.file.getFiles)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Button>Hello world</Button>
      {getFiles?.map((file) => <p>{file.name}</p>)}
      <Button onClick={() => {
        file({
          name: "hello world",
          gender: "women"
        })
      }}>Add Name</Button>
    </main>
  );
}
