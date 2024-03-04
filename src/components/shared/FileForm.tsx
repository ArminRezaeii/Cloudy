"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useOrganization, useUser } from "@clerk/nextjs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
function FileForm() {
    const { toast } = useToast()
    const organization = useOrganization()
    const createFile = useMutation(api.file.createFile)
    const user = useUser()
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
    let orgId: string | undefined = undefined
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id
    }

    const formSchema = z.object({
        title: z.string().min(1).max(200),
        file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, "Required")
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })
    const generateUploadUrl = useMutation(api.file.generateUploadUrl)
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": values.file[0]!.type },
            body: values.file[0],
        });
        const { storageId } = await result.json();
        try {
            await createFile({
                name: values.title,
                fileId: storageId,
                orgId: orgId
            })
            form.reset()
            setIsFileDialogOpen(false)

            toast({

                title: "File Uploaded",
                description: "Now everyone can view your file"
            })


        } catch (e) {
            toast({
                variant: "destructive",
                title: "something went wrong",
                description: "Your file could not be uploaded"
            })

        }

    }
    const fileRef = form.register("file")

    return (
        <>
            <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
                setIsFileDialogOpen(isOpen)
                form.reset()
            }} >
                <DialogTrigger asChild>
                    <Button >Upload File</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Your File Here</DialogTitle>
                        <DialogDescription className="gap-7 pt-3 flex flex-col">
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>File</FormLabel>
                                                <FormControl>
                                                    <Input type="file" {...fileRef} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button disabled={form.formState.isSubmitting} type="submit" className="flex gap-1 ">
                                        {form.formState.isSubmitting && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>


        </>
    )
}

export default FileForm