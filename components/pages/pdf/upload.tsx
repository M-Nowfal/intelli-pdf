"use client";

import { useState, useCallback, useRef } from "react";
import {
  CloudUpload,
  FileText,
  X,
  CheckCircle2,
  Eye,
  Share2,
  Copy,
  FileUp,
  Sparkles,
  BookOpen,
  Save,
  RefreshCw,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import api from "@/lib/axios";
import { usePdfStore } from "@/store/usePdfStore";
import { useDashboardStore } from "@/store/useDashboardStore";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function PDFUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const { addPdf } = usePdfStore();
  const { decrementCredits } = useDashboardStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadProgress: (p) => {
      setUploadProgress(p * 0.5);
    },
    onClientUploadComplete: async (res) => {
      setIsProcessing(true);
      setUploadProgress(50);
      const uploadedFile = res[0];

      let currentProgress = 50;

      const simulateProgress = () => {
        const increment = Math.floor(Math.random() * 4) + 1;

        if (currentProgress + increment < 95) {
          currentProgress += increment;
          setUploadProgress(currentProgress);

          const randomDelay = currentProgress < 80
            ? Math.floor(Math.random() * 300) + 200
            : Math.floor(Math.random() * 500) + 500;

          progressInterval.current = setTimeout(simulateProgress, randomDelay);
        }
      };

      simulateProgress();

      try {
        const res = await api.post("/pdf/process", {
          fileUrl: uploadedFile.ufsUrl,
          fileKey: uploadedFile.key,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
        });

        if (res.status !== 200) {
          throw new Error("Failed to process file on server");
        }

        setUploadProgress(100);
        addPdf(res.data.newPDF);
        setSuccess(true);
        decrementCredits(20);
        toast.success("PDF uploaded & processed successfully!");
      } catch (err: any) {
        await api.delete(`/uploadthing/delete?publicId=${uploadedFile.key}`);
        console.error(err);
        if (err.response?.status === 409) {
          toast.error("Duplicate File", {
            description: "You have already uploaded this document."
          });
        } else {
          toast.error("Processing Failed", {
            description: "File uploaded but failed to save."
          });
        }
        setUploadProgress(0);
      } finally {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        setIsProcessing(false);
      }
    },
    onUploadError: (err: Error) => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      toast.error(`Upload Failed: ${err.message}`);
      setUploadProgress(0);
    },
  });

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 50MB.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setSuccess(false);
        setUploadProgress(0);
        toast.success("File selected");
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setSuccess(false);
        setUploadProgress(0);
        toast.success("File dropped");
      }
    }
  }, []);

  const removeFile = () => {
    setFile(null);
    setSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewPdf = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  const handleCopyName = () => {
    if (file) {
      navigator.clipboard.writeText(file.name);
      toast.success("Filename copied");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await startUpload([file]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const isLoading = isUploading || isProcessing;

  return (
    <>
      <Card className="w-full shadow-lg border-primary/10 py-0 pt-5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Upload Your Document
          </CardTitle>
          <CardDescription className="text-base">
            Upload PDF materials (up to 50MB) to generate AI-powered flashcards.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!file && !success ? (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed 
                  h-72 text-center transition-all duration-200 hover:cursor-pointer group
                  ${isDragging
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
                    : "border-muted-foreground/30 hover:border-primary/70 hover:bg-muted/30"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                />
                <div className={`rounded-full p-5 mb-5 transition-all duration-200 ${isDragging ? "bg-primary/10 scale-110" : "bg-muted group-hover:bg-primary/10"
                  }`}>
                  <CloudUpload className={`h-12 w-12 transition-all duration-200 ${isDragging ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
                    }`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragging ? "Drop your PDF here" : "Drag & drop or click to upload"}
                </h3>
                <p className="text-muted-foreground mb-1">
                  Supports PDF files up to 50MB
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Textbooks, lecture notes, research papers
                </p>
                <Button className="mt-6 gap-2" variant="outline" size="sm">
                  <FileUp className="h-4 w-4" />
                  Browse Files
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/30 p-4 border border-border/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Secure Processing
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Your files are encrypted during transfer.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-4 border border-border/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Powered
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    We analyze text structure to generate optimal study materials.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {file && !success && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-xl border bg-linear-to-r from-background to-muted/20 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-red-500/10 p-4">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold truncate max-w-50 sm:max-w-md" title={file.name}>
                        {file.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">PDF</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileUp className="h-3 w-3" />
                        {formatFileSize(file.size)}
                      </span>
                      <span>•</span>
                      <span>Last modified: {new Date(file.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {!isLoading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {!isLoading && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button variant="outline" className="h-auto py-3 gap-3 justify-start" onClick={handleViewPdf}>
                      <Eye className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Preview</div>
                        <div className="text-xs text-muted-foreground">View PDF</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 gap-3 justify-start" onClick={handleCopyName}>
                      <Copy className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Copy Name</div>
                        <div className="text-xs text-muted-foreground">To clipboard</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 gap-3 justify-start cursor-not-allowed opacity-70">
                      <Share2 className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Share</div>
                        <div className="text-xs text-muted-foreground">Coming soon</div>
                      </div>
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="text-center">
                <Loader size={40} className="mb-3 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">
                  {isUploading ? "Uploading to Cloud..." : "Analyzing Document..."}
                </h3>
                <p className="text-muted-foreground">
                  {isUploading && "Transferring file securely to storage."}
                  {isProcessing && "Generating AI embeddings and saving to database."}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="font-semibold">{isUploading ? Math.round(uploadProgress) : 100}%</span>
                </div>
                <Progress value={isUploading ? uploadProgress : 100} className="h-3" />
              </div>
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
                <div className="relative rounded-full bg-green-500/10 p-6">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Upload Complete!</h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Your document has been processed. You can now start studying.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full max-w-lg">
                <Button
                  onClick={removeFile}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Upload Another
                </Button>
                <Button
                  onClick={() => router.push("/pdf")}
                  size="lg"
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  View Materials
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t bg-linear-to-r from-muted/30 to-transparent px-6 py-5">
            <Button
              variant="outline"
              onClick={removeFile}
              disabled={isLoading || !file}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="gap-3 text-base font-semibold w-full sm:w-auto min-w-40"
                size="lg"
              >
                {isLoading ? "Processing..." : (
                  <>
                    <Save className="h-5 w-5" />
                    Save & Process
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure Encryption
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> PDF Only
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <CloudUpload className="h-3.5 w-3.5" /> Max 50MB
        </span>
      </div>
    </>
  );
}