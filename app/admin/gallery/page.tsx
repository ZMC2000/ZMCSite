import { redirect } from "next/navigation";
import { auth } from "@/auth";
import GalleryEditor from "./gallery-editor";
import path from "path";
import { readdir, stat } from "fs/promises";

const publicPath = path.join(process.cwd(), "public");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

type GalleryImage = {
  src: string;
  name: string;
  folder: string;
  size: number;
  modifiedAt: string;
};

type GalleryFolder = {
  path: string;
  name: string;
  imageCount: number;
};

async function collectGallery(
  directoryPath: string,
  basePath = "",
): Promise<{
  folders: GalleryFolder[];
  images: GalleryImage[];
}> {
  const entries = await readdir(directoryPath, { withFileTypes: true });

  const folders: GalleryFolder[] = [];
  const images: GalleryImage[] = [];

  const folderUrl = basePath || "/";

  folders.push({
    path: folderUrl,
    name: folderUrl === "/" ? "public" : path.basename(folderUrl),
    imageCount: 0,
  });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    const publicUrl = `${basePath}/${entry.name}`.replace(/\/+/g, "/");

    if (entry.isDirectory()) {
      const childGallery = await collectGallery(fullPath, publicUrl);

      folders.push(...childGallery.folders);
      images.push(...childGallery.images);
      continue;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();

      if (allowedExtensions.includes(extension)) {
        const fileStat = await stat(fullPath);

        images.push({
          src: publicUrl.startsWith("/") ? publicUrl : `/${publicUrl}`,
          name: entry.name,
          folder: folderUrl,
          size: fileStat.size,
          modifiedAt: fileStat.mtime.toISOString(),
        });
      }
    }
  }

  return {
    folders,
    images,
  };
}

function addImageCounts(folders: GalleryFolder[], images: GalleryImage[]) {
  return folders.map((folder) => ({
    ...folder,
    imageCount: images.filter((image) => image.folder === folder.path).length,
  }));
}

export default async function AdminGalleryPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const gallery = await collectGallery(publicPath);

  const folders = addImageCounts(gallery.folders, gallery.images).sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const images = gallery.images.sort((a, b) => a.src.localeCompare(b.src));

  return (
    <GalleryEditor
      initialData={{
        folders,
        images,
      }}
    />
  );
}
