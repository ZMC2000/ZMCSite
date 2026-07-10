import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ScheduleEditor from "./schedule-editor";
import path from "path";
import { readFile, readdir } from "fs/promises";

const scheduleJsonPath = path.join(
  process.cwd(),
  "app",
  "data",
  "schedulePage.json",
);

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

export default async function AdminSchedulePage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const file = await readFile(scheduleJsonPath, "utf-8");
  const scheduleData = JSON.parse(file);

  const publicImages = await getImagesFromDirectory(publicPath);

  return (
    <ScheduleEditor
      initialData={scheduleData}
      initialImages={publicImages.sort((a, b) => a.src.localeCompare(b.src))}
    />
  );
}
