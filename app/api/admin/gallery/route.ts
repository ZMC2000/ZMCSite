import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import {
  mkdir,
  readdir,
  rename,
  rm,
  stat,
  unlink,
  writeFile,
} from "fs/promises";

export const runtime = "nodejs";

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

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

function normalizePublicPath(input: string) {
  if (!input || input === "All") return "/";

  let value = input.trim();

  if (!value.startsWith("/")) {
    value = `/${value}`;
  }

  value = value.replace(/\\/g, "/");
  value = value.replace(/\/+/g, "/");

  return value;
}

function safeName(input: string) {
  return input
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function ensureInsidePublic(targetPath: string) {
  const resolvedPublic = path.resolve(publicPath);
  const resolvedTarget = path.resolve(targetPath);

  if (
    resolvedTarget !== resolvedPublic &&
    !resolvedTarget.startsWith(`${resolvedPublic}${path.sep}`)
  ) {
    throw new Error("Invalid path.");
  }

  return resolvedTarget;
}

function publicUrlToFilePath(publicUrl: string) {
  const normalized = normalizePublicPath(publicUrl);
  const relativePath = normalized.replace(/^\/+/, "");
  return ensureInsidePublic(path.join(publicPath, relativePath));
}

function folderPathToFilePath(folderPath: string) {
  const normalized = normalizePublicPath(folderPath);
  const relativePath = normalized.replace(/^\/+/, "");
  return ensureInsidePublic(path.join(publicPath, relativePath));
}

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
          src: publicUrl,
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

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const gallery = await collectGallery(publicPath);

    const folders = addImageCounts(gallery.folders, gallery.images).sort(
      (a, b) => a.path.localeCompare(b.path),
    );

    const images = gallery.images.sort((a, b) => a.src.localeCompare(b.src));

    return NextResponse.json({
      folders,
      images,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to load image gallery.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const action = String(formData.get("action") || "");

      if (action !== "uploadImages") {
        return NextResponse.json(
          { message: "Invalid upload action." },
          { status: 400 },
        );
      }

      const folderPath = normalizePublicPath(
        String(formData.get("folderPath") || "/"),
      );

      const folderFilePath = folderPathToFilePath(folderPath);
      await mkdir(folderFilePath, { recursive: true });

      const files = formData.getAll("images");

      if (files.length === 0) {
        return NextResponse.json(
          { message: "No images were uploaded." },
          { status: 400 },
        );
      }

      for (const item of files) {
        if (!(item instanceof File)) {
          continue;
        }

        const originalName = safeName(item.name);
        const extension = path.extname(originalName).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          return NextResponse.json(
            {
              message:
                "Only JPG, JPEG, PNG, WEBP, GIF, and SVG images are allowed.",
            },
            { status: 400 },
          );
        }

        const fileBuffer = Buffer.from(await item.arrayBuffer());
        const targetPath = ensureInsidePublic(
          path.join(folderFilePath, originalName),
        );

        await writeFile(targetPath, fileBuffer);
      }

      return NextResponse.json({
        message: "Images uploaded successfully.",
      });
    }

    const body = await request.json();

    if (body.action === "createFolder") {
      const folderName = safeName(String(body.folderName || ""));

      if (!folderName) {
        return NextResponse.json(
          { message: "Invalid folder name." },
          { status: 400 },
        );
      }

      const folderPath = `/${folderName}`;
      const folderFilePath = folderPathToFilePath(folderPath);

      await mkdir(folderFilePath, { recursive: true });

      return NextResponse.json({
        message: "Folder created successfully.",
        folderPath,
      });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update image gallery.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (body.action === "renameImage") {
      const imageSrc = normalizePublicPath(String(body.imageSrc || ""));
      const newName = safeName(String(body.newName || ""));

      if (!imageSrc || !newName) {
        return NextResponse.json(
          { message: "Invalid image name." },
          { status: 400 },
        );
      }

      const extension = path.extname(newName).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return NextResponse.json(
          {
            message:
              "Image name must end with JPG, JPEG, PNG, WEBP, GIF, or SVG.",
          },
          { status: 400 },
        );
      }

      const oldPath = publicUrlToFilePath(imageSrc);
      const folderFilePath = path.dirname(oldPath);
      const newPath = ensureInsidePublic(path.join(folderFilePath, newName));

      await rename(oldPath, newPath);

      return NextResponse.json({
        message: "Image renamed successfully.",
      });
    }

    if (body.action === "renameFolder") {
      const folderPath = normalizePublicPath(String(body.folderPath || ""));
      const newName = safeName(String(body.newName || ""));

      if (!folderPath || folderPath === "/" || !newName) {
        return NextResponse.json(
          { message: "Invalid folder name." },
          { status: 400 },
        );
      }

      const oldPath = folderPathToFilePath(folderPath);
      const parentPath = path.dirname(oldPath);
      const newPath = ensureInsidePublic(path.join(parentPath, newName));

      await rename(oldPath, newPath);

      const parentPublicPath = path.dirname(folderPath).replace(/\\/g, "/");
      const folderPublicPath =
        parentPublicPath === "/"
          ? `/${newName}`
          : `${parentPublicPath}/${newName}`;

      return NextResponse.json({
        message: "Folder renamed successfully.",
        folderPath: folderPublicPath,
      });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to rename item.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (body.action === "deleteImage") {
      const imageSrc = normalizePublicPath(String(body.imageSrc || ""));

      if (!imageSrc || imageSrc === "/") {
        return NextResponse.json(
          { message: "Invalid image path." },
          { status: 400 },
        );
      }

      const imageFilePath = publicUrlToFilePath(imageSrc);

      await unlink(imageFilePath);

      return NextResponse.json({
        message: "Image deleted successfully.",
      });
    }

    if (body.action === "deleteFolder") {
      const folderPath = normalizePublicPath(String(body.folderPath || ""));

      if (!folderPath || folderPath === "/") {
        return NextResponse.json(
          { message: "You cannot delete the root public folder." },
          { status: 400 },
        );
      }

      const folderFilePath = folderPathToFilePath(folderPath);

      await rm(folderFilePath, {
        recursive: true,
        force: true,
      });

      return NextResponse.json({
        message: "Folder deleted successfully.",
      });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete item.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
