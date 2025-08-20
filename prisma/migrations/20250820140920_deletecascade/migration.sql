-- DropForeignKey
ALTER TABLE "public"."Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
