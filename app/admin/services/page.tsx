import { redirect } from "next/navigation";

import { auth } from "@/auth";

import ServicesEditor from "./services-editor";

import path from "path";

import { readFile, readdir } from "fs/promises";

const servicesJsonPath = path.join(
  process.cwd(),

  "app",

  "data",

  "servicesPage.json",
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

export default async function AdminServicesPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const file = await readFile(servicesJsonPath, "utf-8");

  const servicesData = JSON.parse(file);

  const publicImages = await getImagesFromDirectory(publicPath);

  return (
    <ServicesEditor
      initialData={servicesData}
      initialImages={publicImages.sort((a, b) => a.src.localeCompare(b.src))}
    />
  );
}
