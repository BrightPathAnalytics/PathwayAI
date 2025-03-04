"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, FileText, Image, File } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Progress } from "./progress"

/**
 * Props for the FileUpload component
 */
interface FileUploadProps {
  onFilesChange?: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
  maxFileSize?: number // in bytes
  className?: string
  disabled?: boolean
  showPreview?: boolean
}

/**
 * FileUpload component for handling file uploads with drag and drop support
 * Includes file preview, progress indicators, and validation
 */
export function FileUpload({
  onFilesChange,
  acceptedFileTypes = [
    "application/pdf",
    "image/*",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(new Map())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsHovering(true)
    }
  }

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsHovering(false)
  }

  // Handle file drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsHovering(false)
    if (!disabled) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Handle file input change event
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      handleFiles(Array.from(e.target.files))
    }
  }

  // Process and validate files
  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      // Check file type
      const isValidType = acceptedFileTypes.some((type) => {
        if (type.includes("*")) {
          return file.type.startsWith(type.split("*")[0])
        }
        return file.type === type
      })

      // Check file size
      const isValidSize = file.size <= maxFileSize

      return isValidType && isValidSize
    })

    // Limit to max files
    const combinedFiles = [...files, ...validFiles].slice(0, maxFiles)

    setFiles(combinedFiles)

    // Simulate upload progress for each file
    validFiles.forEach((file) => {
      simulateUploadProgress(file)
    })

    if (onFilesChange) {
      onFilesChange(combinedFiles)
    }
  }

  // Simulate file upload progress
  const simulateUploadProgress = (file: File) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress((prev) => new Map(prev).set(file.name, progress))
    }, 300)
  }

  // Remove a file from the list
  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove)
    setFiles(updatedFiles)

    // Remove the progress for this file
    setUploadProgress((prev) => {
      const newMap = new Map(prev)
      newMap.delete(fileToRemove.name)
      return newMap
    })

    if (onFilesChange) {
      onFilesChange(updatedFiles)
    }
  }

  // Get appropriate icon for file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (file.type.includes("spreadsheet") || file.type === "text/csv") {
      return <FileText className="h-5 w-5 text-green-500" />
    } else if (file.type.includes("document")) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  // Get preview for image files
  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative h-20 w-20 overflow-hidden rounded border">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isHovering ? "border-primary bg-primary/5" : "border-border",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          Drag and drop files here or{" "}
          <span
            className="cursor-pointer text-primary underline"
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            browse
          </span>
        </p>
        <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, XLSX, CSV, Images</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {maxFiles} file(s) up to {maxFileSize / (1024 * 1024)}MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(",")}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* File list */}
      {files.length > 0 && showPreview && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between rounded border p-3">
                <div className="flex items-center space-x-3">
                  {getFilePreview(file) || getFileIcon(file)}
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadProgress.has(file.name) && uploadProgress.get(file.name)! < 100 && (
                    <div className="w-24">
                      <Progress value={uploadProgress.get(file.name)} className="h-2" />
                    </div>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeFile(file)} disabled={disabled}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 