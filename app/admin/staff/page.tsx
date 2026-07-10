import { redirect } from "next/navigation";
import { auth } from "@/auth";
import StaffEditor from "./staff-editor";
import path from "path";
import { readFile, readdir } from "fs/promises";

const staffJsonPath = path.join(process.cwd(), "app", "data", "staffPage.json");
const publicPath = path.join(process.cwd(), "public");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

type PublicImage = {
  src: string;
  name: string;
  folder: string;
};

async function getImagesFromDirectory(
  directoryPath: string,
  basePath = "",
): Promise<PublicImage[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const images: PublicImage[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    const publicUrl = `${basePath}/${entry.name}`;

    if (entry.isDirectory()) {
      const childImages = await getImagesFromDirectory(fullPath, publicUrl);
      images.push(...childImages);
      continue;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();

      if (allowedExtensions.includes(extension)) {
        images.push({
          src: publicUrl,
          name: entry.name,
          folder: basePath || "/",
        });
      }
    }
  }

  return images;
}

export default async function AdminStaffPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const file = await readFile(staffJsonPath, "utf-8");
  const staffData = JSON.parse(file);

  const publicImages = await getImagesFromDirectory(publicPath);

  return (
    <StaffEditor
      initialData={staffData}
      initialImages={publicImages.sort((a, b) => a.src.localeCompare(b.src))}
    />
  );
}
