"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  Folder,
  FolderPlus,
  ImageIcon,
  Loader2,
  Pencil,
  RefreshCcw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

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

type GalleryData = {
  folders: GalleryFolder[];
  images: GalleryImage[];
};

type RenameImageState = {
  image: GalleryImage;
  newName: string;
};

type RenameFolderState = {
  folder: GalleryFolder;
  newName: string;
};

function displayImagePath(src: string) {
  return encodeURI(src.startsWith("/") ? src : `/${src}`);
}

export default function GalleryEditor({
  initialData,
}: {
  initialData: GalleryData;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [galleryData] = useState<GalleryData>(initialData);
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadFolder, setUploadFolder] = useState("/");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState("");
  const [renameImageState, setRenameImageState] =
    useState<RenameImageState | null>(null);
  const [renameFolderState, setRenameFolderState] =
    useState<RenameFolderState | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const folderOptions = useMemo(() => {
    return [
      {
        label: "All Images",
        value: "All",
      },
      ...galleryData.folders.map((folder) => ({
        label: folder.path === "/" ? "Root public folder" : folder.path,
        value: folder.path,
      })),
    ];
  }, [galleryData.folders]);

  const uploadFolderOptions = useMemo(() => {
    return galleryData.folders.map((folder) => ({
      label: folder.path === "/" ? "Root public folder" : folder.path,
      value: folder.path,
    }));
  }, [galleryData.folders]);

  const filteredImages =
    selectedFolder === "All"
      ? galleryData.images
      : galleryData.images.filter((image) => image.folder === selectedFolder);

  function refreshPage() {
    setIsRefreshing(true);
    window.location.reload();
  }

  function openFilePicker() {
    setError("");
    setMessage("");
    fileInputRef.current?.click();
  }

  async function createFolder() {
    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      setError("Please enter a folder name.");
      return;
    }

    setIsCreatingFolder(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "createFolder",
          folderName: trimmedName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create folder.");
      }

      setMessage("Folder created successfully.");
      setNewFolderName("");
      refreshPage();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create folder.",
      );
      setIsCreatingFolder(false);
    }
  }

  async function uploadImages(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    setMessage("");
    setError("");

    try {
      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".svg",
      ];

      const selectedFiles = Array.from(files);

      const invalidFile = selectedFiles.find((file) => {
        const lowerName = file.name.toLowerCase();
        return !allowedExtensions.some((extension) =>
          lowerName.endsWith(extension),
        );
      });

      if (invalidFile) {
        throw new Error(
          "Only JPG, JPEG, PNG, WEBP, GIF, and SVG images are allowed.",
        );
      }

      const formData = new FormData();

      formData.append("action", "uploadImages");
      formData.append("folderPath", uploadFolder);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload images.");
      }

      setMessage("Images uploaded successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      refreshPage();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload images.",
      );
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function renameImage() {
    if (!renameImageState) return;

    const trimmedName = renameImageState.newName.trim();

    if (!trimmedName) {
      setError("Please enter a new image name.");
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "renameImage",
          imageSrc: renameImageState.image.src,
          newName: trimmedName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to rename image.");
      }

      setMessage("Image renamed successfully.");
      setRenameImageState(null);
      refreshPage();
    } catch (renameError) {
      setError(
        renameError instanceof Error
          ? renameError.message
          : "Failed to rename image.",
      );
    }
  }

  async function renameFolder() {
    if (!renameFolderState) return;

    const trimmedName = renameFolderState.newName.trim();

    if (!trimmedName) {
      setError("Please enter a new folder name.");
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "renameFolder",
          folderPath: renameFolderState.folder.path,
          newName: trimmedName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to rename folder.");
      }

      setMessage("Folder renamed successfully.");
      setRenameFolderState(null);
      refreshPage();
    } catch (renameError) {
      setError(
        renameError instanceof Error
          ? renameError.message
          : "Failed to rename folder.",
      );
    }
  }

  async function deleteImage(image: GalleryImage) {
    const confirmed = window.confirm(`Delete ${image.name}?`);

    if (!confirmed) return;

    setIsDeleting(image.src);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteImage",
          imageSrc: image.src,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete image.");
      }

      setMessage("Image deleted successfully.");
      refreshPage();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete image.",
      );
      setIsDeleting("");
    }
  }

  async function deleteFolder(folder: GalleryFolder) {
    if (folder.path === "/") {
      setError("You cannot delete the root public folder.");
      return;
    }

    const confirmed = window.confirm(
      `Delete folder ${folder.path} and all images inside it?`,
    );

    if (!confirmed) return;

    setIsDeleting(folder.path);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteFolder",
          folderPath: folder.path,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete folder.");
      }

      setMessage("Folder deleted successfully.");
      refreshPage();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete folder.",
      );
      setIsDeleting("");
    }
  }

  return (
    <>
      <main className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="mb-12 rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                  <ImageIcon size={15} strokeWidth={2.5} />
                  Image Gallery
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
                  Manage Image Gallery
                </h1>

                <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-gray-600">
                  Create albums, upload images, rename files, delete images, and
                  manage the public image folders used across the website.
                </p>
              </div>

              <div className="flex w-full justify-start lg:w-auto lg:justify-end">
                <button
                  type="button"
                  onClick={refreshPage}
                  disabled={isRefreshing}
                  className="flex h-12 w-auto min-w-38 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRefreshing ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <RefreshCcw size={16} />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {message ? (
            <div className="mb-10 flex items-center gap-3 rounded-3xl bg-main-100/10 p-4 text-main-100">
              <CheckCircle2 size={22} strokeWidth={2.5} />
              <p className="text-sm font-extrabold">{message}</p>
            </div>
          ) : null}

          {error ? (
            <div className="mb-10 rounded-3xl bg-red-50 p-4 text-sm font-extrabold text-red-600">
              {error}
            </div>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-8">
              <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
                <SectionHeader
                  title="Create Folder"
                  description="Create a new image album inside the public folder."
                />

                <Input
                  label="Folder Name"
                  value={newFolderName}
                  onChange={setNewFolderName}
                  placeholder="example: doctors"
                />

                <button
                  type="button"
                  onClick={createFolder}
                  disabled={isCreatingFolder}
                  className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCreatingFolder ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <FolderPlus size={16} />
                  )}
                  Create Folder
                </button>
              </section>

              <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
                <SectionHeader
                  title="Upload Images"
                  description="Upload images into the selected folder."
                />

                <Select
                  label="Upload To"
                  value={uploadFolder}
                  onChange={setUploadFolder}
                  options={uploadFolderOptions}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                  multiple
                  onChange={(event) => uploadImages(event.target.files)}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isUploading}
                  className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isUploading ? "Uploading..." : "Choose Images"}
                </button>

                <p className="mt-3 text-xs font-bold leading-5 text-gray-400">
                  Allowed files: JPG, JPEG, PNG, WEBP, GIF, SVG.
                </p>
              </section>

              <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
                <SectionHeader
                  title="Folders"
                  description="Browse, rename, or delete image folders."
                />

                <div className="space-y-3">
                  {galleryData.folders.map((folder) => (
                    <div
                      key={folder.path}
                      className={`rounded-3xl border p-4 transition ${
                        selectedFolder === folder.path
                          ? "border-main-100 bg-main-100/5"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedFolder(folder.path)}
                        className="flex w-full cursor-pointer items-center gap-3 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-main-100 text-white">
                          <Folder size={18} strokeWidth={2.5} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-gray-950">
                            {folder.path === "/"
                              ? "Root public folder"
                              : folder.name}
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-gray-500">
                            {folder.path}
                          </p>

                          <p className="mt-1 text-xs font-bold text-main-100">
                            {folder.imageCount} image
                            {folder.imageCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      </button>

                      {folder.path !== "/" ? (
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setRenameFolderState({
                                folder,
                                newName: folder.name,
                              })
                            }
                            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-3 text-xs font-bold text-main-100 ring-1 ring-main-100/20"
                          >
                            <Pencil size={14} />
                            Rename
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteFolder(folder)}
                            disabled={isDeleting === folder.path}
                            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-50 px-3 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting === folder.path ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            </aside>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <div className="mb-8 flex flex-col gap-5 border-b border-gray-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-950">
                    Images
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                    View images, rename files, or delete images from the public
                    folder.
                  </p>
                </div>

                <Select
                  label="Filter Album"
                  value={selectedFolder}
                  onChange={setSelectedFolder}
                  options={folderOptions}
                />
              </div>

              {filteredImages.length === 0 ? (
                <div className="flex min-h-80 items-center justify-center rounded-4xl bg-gray-50 p-8 text-center">
                  <div>
                    <ImageIcon
                      size={40}
                      strokeWidth={2}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-4 text-sm font-extrabold text-gray-500">
                      No images found in this folder.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredImages.map((image) => (
                    <div
                      key={image.src}
                      className="overflow-hidden rounded-4xl border border-gray-100 bg-gray-50"
                    >
                      <div className="flex h-56 items-center justify-center bg-white p-4">
                        <img
                          src={displayImagePath(image.src)}
                          alt={image.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="space-y-4 p-5">
                        <div>
                          <p className="truncate text-sm font-extrabold text-gray-950">
                            {image.name}
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-main-100">
                            {image.folder}
                          </p>

                          <p className="mt-2 break-all rounded-2xl bg-white px-3 py-2 text-xs font-bold text-gray-500 ring-1 ring-gray-100">
                            {image.src}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setRenameImageState({
                                image,
                                newName: image.name,
                              })
                            }
                            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-4 text-xs font-bold uppercase tracking-wide text-white"
                          >
                            <Pencil size={15} />
                            Rename
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteImage(image)}
                            disabled={isDeleting === image.src}
                            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-50 px-4 text-xs font-bold uppercase tracking-wide text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting === image.src ? (
                              <Loader2 className="animate-spin" size={15} />
                            ) : (
                              <Trash2 size={15} />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {renameImageState ? (
        <Modal title="Rename Image" onClose={() => setRenameImageState(null)}>
          <div className="space-y-5">
            <div className="flex h-52 items-center justify-center rounded-3xl bg-gray-50 p-4">
              <img
                src={displayImagePath(renameImageState.image.src)}
                alt={renameImageState.image.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <Input
              label="New File Name"
              value={renameImageState.newName}
              onChange={(value) =>
                setRenameImageState({
                  ...renameImageState,
                  newName: value,
                })
              }
              placeholder="image-name.jpg"
            />

            <button
              type="button"
              onClick={renameImage}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white"
            >
              <Save size={16} />
              Save Image Name
            </button>
          </div>
        </Modal>
      ) : null}

      {renameFolderState ? (
        <Modal title="Rename Folder" onClose={() => setRenameFolderState(null)}>
          <div className="space-y-5">
            <Input
              label="New Folder Name"
              value={renameFolderState.newName}
              onChange={(value) =>
                setRenameFolderState({
                  ...renameFolderState,
                  newName: value,
                })
              }
              placeholder="new-folder-name"
            />

            <button
              type="button"
              onClick={renameFolder}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white"
            >
              <Save size={16} />
              Save Folder Name
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 border-b border-gray-100 pb-4">
      <h2 className="text-xl font-extrabold text-gray-950">{title}</h2>

      <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <label className="block min-w-64">
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full cursor-pointer rounded-full border border-gray-100 bg-gray-50 px-5 text-sm font-bold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/75 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-4xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-950">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
