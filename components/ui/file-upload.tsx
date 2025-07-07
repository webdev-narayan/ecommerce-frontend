"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, FileImage, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRef } from "react"

interface FileUploadProps {
    onFilesChange?: (files: File[]) => void
    maxFiles?: number
    acceptedFileTypes?: string[]
    maxFileSize?: number // in MB
    isMultiple?: boolean
    title?: string
    name?: string
}

export default function FileUpload({
    onFilesChange,
    maxFiles = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxFileSize = 5,
    isMultiple = false,
    title = "Upload file",
    name
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return

        const fileArray = Array.from(newFiles)
        const validFiles: File[] = []
        const newPreviews: string[] = []

        fileArray.forEach((file) => {
            // Validate file type
            if (!acceptedFileTypes.includes(file.type)) {
                alert(`File type ${file.type} is not supported`)
                return
            }

            // Validate file size
            if (file.size > maxFileSize * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`)
                return
            }

            validFiles.push(file)

            // Create preview URL
            const previewUrl = URL.createObjectURL(file)
            newPreviews.push(previewUrl)
        })

        if (isMultiple) {
            const totalFiles = files.length + validFiles.length
            if (totalFiles > maxFiles) {
                alert(`Maximum ${maxFiles} files allowed`)
                return
            }
            setFiles((prev) => [...prev, ...validFiles])
            setPreviews((prev) => [...prev, ...newPreviews])
        } else {
            // Clean up previous preview URLs
            previews.forEach((url) => URL.revokeObjectURL(url))
            setFiles(validFiles.slice(0, 1))
            setPreviews(newPreviews.slice(0, 1))
        }

        // Call the callback with updated files
        const updatedFiles = isMultiple ? [...files, ...validFiles] : validFiles.slice(0, 1)
        onFilesChange?.(updatedFiles)
    }

    const removeFile = (index: number) => {
        // Clean up the preview URL
        URL.revokeObjectURL(previews[index])

        const newFiles = files.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)

        setFiles(newFiles)
        setPreviews(newPreviews)
        onFilesChange?.(newFiles)
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const clearAll = () => {
        previews.forEach((url) => URL.revokeObjectURL(url))
        setFiles([])
        setPreviews([])
        onFilesChange?.([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="w-full mx-auto space-y-2">
            <div className="flex justify-between">
                <h4>{`${title}  ${files.length > 0 ? files.length : ""}`}</h4>
                {files.length > 0 && (
                    <div className="flex items-center gap-2">

                        <Button variant="outline" className="" size="sm" onClick={clearAll}>
                            Clear all
                        </Button>
                        <div className="border relative rounded-md p-2 bg-black/80 text-white">
                            <Upload className="size-4" />
                            <Input
                                ref={fileInputRef}
                                type="file"
                                multiple={isMultiple}
                                accept={acceptedFileTypes.join(",")}
                                onChange={handleInputChange}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div
                className={`${files.length > 0 ? "hidden" : ""} relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Input
                    ref={fileInputRef}
                    type="file"
                    name={name || ""}
                    multiple={isMultiple}
                    accept={acceptedFileTypes.join(",")}
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-medium">
                            Drop your images here, or{" "}
                            <Button variant="link" className="p-0 h-auto font-medium text-primary" onClick={openFileDialog}>
                                browse
                            </Button>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isMultiple ? `Up to ${maxFiles} files` : "Single file only"} • Max {maxFileSize}MB each
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports:{" "}
                            {acceptedFileTypes
                                .map((type) => type.split("/")[1])
                                .join(", ")
                                .toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            {/* File Previews */}
            {
                files.length > 0 && (
                    <div className="">
                        <div className="flex items-center justify-between">
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-square">
                                            <Image src={previews[index] || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="p-3 space-y-1">
                                            <p className="text-sm font-medium truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                <div className="flex items-center gap-1">
                                                    <FileImage className="h-3 w-3" />
                                                    <span>{file.type.split("/")[1].toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    )
}
