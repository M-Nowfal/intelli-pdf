import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload finished for user:", metadata.userId);
      console.log("File URL:", file.ufsUrl);
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;