"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  FolderOpen,
  ImageIcon,
  Link2,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import DraggableAdminItem from "../components/draggable-admin-item";
import {
  moveItem,
  randomDigits,
  randomLabel,
} from "../utils/admin-placeholders";

type PublicImage = {
  src: string;
  name: string;
  folder: string;
};

type NavbarLink = {
  name: string;
  href: string;
};

type NavbarData = {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  emergency: {
    label: string;
    phone: string;
  };
  location: {
    line1: string;
    line2: string;
  };
  hours: {
    line1: string;
    line2: string;
  };
  links: NavbarLink[];
  appointment: {
    name: string;
    href: string;
  };
};

type ImageTarget = { type: "logo" };

function normalizeImagePath(src: string) {
  if (!src) return "";

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return src.startsWith("/") ? src : `/${src}`;
}

function saveImagePath(src: string) {
  return normalizeImagePath(src);
}

function displayImagePath(src: string) {
  return encodeURI(normalizeImagePath(src));
}

export default function NavbarEditor({
  initialData,
  initialImages,
}: {
  initialData: NavbarData;
  initialImages: PublicImage[];
}) {
  const [data, setData] = useState<NavbarData>(initialData);
  const [publicImages] = useState<PublicImage[]>(initialImages);
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateLogo<K extends keyof NavbarData["logo"]>(
    key: K,
    value: NavbarData["logo"][K],
  ) {
    setData({
      ...data,
      logo: {
        ...data.logo,
        [key]: value,
      },
    });
  }

  function updateEmergency<K extends keyof NavbarData["emergency"]>(
    key: K,
    value: NavbarData["emergency"][K],
  ) {
    setData({
      ...data,
      emergency: {
        ...data.emergency,
        [key]: value,
      },
    });
  }

  function updateLocation<K extends keyof NavbarData["location"]>(
    key: K,
    value: NavbarData["location"][K],
  ) {
    setData({
      ...data,
      location: {
        ...data.location,
        [key]: value,
      },
    });
  }

  function updateHours<K extends keyof NavbarData["hours"]>(
    key: K,
    value: NavbarData["hours"][K],
  ) {
    setData({
      ...data,
      hours: {
        ...data.hours,
        [key]: value,
      },
    });
  }

  function updateLink(index: number, key: keyof NavbarLink, value: string) {
    const nextLinks = [...data.links];

    nextLinks[index] = {
      ...nextLinks[index],
      [key]: value,
    };

    setData({
      ...data,
      links: nextLinks,
    });
  }

  function addLink() {
    setData({
      ...data,
      links: [
        ...data.links,
        {
          name: randomLabel("New Link"),
          href: `/new-page-${randomDigits(5)}`,
        },
      ],
    });
  }

  function removeLink(index: number) {
    setData({
      ...data,
      links: data.links.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function moveLink(fromIndex: number, toIndex: number) {
    setData({ ...data, links: moveItem(data.links, fromIndex, toIndex) });
  }

  function updateAppointment<K extends keyof NavbarData["appointment"]>(
    key: K,
    value: NavbarData["appointment"][K],
  ) {
    setData({
      ...data,
      appointment: {
        ...data.appointment,
        [key]: value,
      },
    });
  }

  function openImagePicker(target: ImageTarget) {
    setImageTarget(target);
  }

  function closeImagePicker() {
    setImageTarget(null);
  }

  function chooseImage(src: string) {
    if (!imageTarget) return;

    const cleanedSrc = saveImagePath(src);

    if (imageTarget.type === "logo") {
      updateLogo("src", cleanedSrc);
    }

    setImageTarget(null);
  }

  async function saveChanges() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/navbar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `${result.message || "Failed to save changes."}${
            result.error ? ` Reason: ${result.error}` : ""
          }`,
        );
      }

      setMessage("Navbar updated successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save changes.",
      );
    } finally {
      setIsSaving(false);
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
                  <Menu size={15} strokeWidth={2.5} />
                  Navbar Editor
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
                  Edit Website Navbar
                </h1>

                <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-gray-600">
                  Update the logo, contact details, location, opening hours,
                  navigation links, and appointment button.
                </p>
              </div>

              <div className="flex w-full justify-start lg:w-auto lg:justify-end">
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="flex h-12 w-auto min-w-38 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
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

          <div className="space-y-10">
            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Logo"
                description="Edit the logo image, alt text, and displayed size."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Logo Alt"
                  value={data.logo.alt}
                  onChange={(value) => updateLogo("alt", value)}
                />

                <NumberInput
                  label="Logo Width"
                  value={data.logo.width}
                  onChange={(value) => updateLogo("width", value)}
                />

                <NumberInput
                  label="Logo Height"
                  value={data.logo.height}
                  onChange={(value) => updateLogo("height", value)}
                />

                <div className="lg:col-span-2">
                  <ImageSelector
                    label="Logo Image"
                    src={data.logo.src}
                    onChoose={() => openImagePicker({ type: "logo" })}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Top Contact Information"
                description="Edit landline, location, and opening hours shown in the top navbar area."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main-100 text-white">
                      <Phone size={20} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-950">
                      Emergency/Landline
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <Input
                      label="Label"
                      value={data.emergency.label}
                      onChange={(value) => updateEmergency("label", value)}
                    />

                    <Input
                      label="Phone"
                      value={data.emergency.phone}
                      onChange={(value) => updateEmergency("phone", value)}
                    />
                  </div>
                </div>

                <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main-100 text-white">
                      <MapPin size={20} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-950">
                      Location
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <Input
                      label="Line 1"
                      value={data.location.line1}
                      onChange={(value) => updateLocation("line1", value)}
                    />

                    <Input
                      label="Line 2"
                      value={data.location.line2}
                      onChange={(value) => updateLocation("line2", value)}
                    />
                  </div>
                </div>

                <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6 lg:col-span-2">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main-100 text-white">
                      <Menu size={20} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-950">
                      Opening Hours
                    </h3>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <Input
                      label="Line 1"
                      value={data.hours.line1}
                      onChange={(value) => updateHours("line1", value)}
                    />

                    <Input
                      label="Line 2"
                      value={data.hours.line2}
                      onChange={(value) => updateHours("line2", value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-950">
                    Navigation Links
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                    Add, edit, reorder manually, or remove the navbar links.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLink}
                  className="inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  <Plus size={15} />
                  Add Link
                </button>
              </div>

              <div className="space-y-6">
                {data.links.map((link, index) => (
                  <DraggableAdminItem
                    key={`${link.name}-${index}`}
                    index={index}
                    onMove={moveLink}
                  >
                    <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main-100 text-white">
                            <Link2 size={20} strokeWidth={2.5} />
                          </div>

                          <div>
                            <h3 className="text-lg font-extrabold text-gray-950">
                              {link.name}
                            </h3>
                            <p className="mt-1 text-sm font-bold text-main-100">
                              {link.href}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <Input
                          label="Link Name"
                          value={link.name}
                          onChange={(value) => updateLink(index, "name", value)}
                        />

                        <Input
                          label="Link Href"
                          value={link.href}
                          onChange={(value) => updateLink(index, "href", value)}
                        />
                      </div>
                    </div>
                  </DraggableAdminItem>
                ))}

                {data.links.length === 0 ? (
                  <div className="rounded-3xl bg-gray-50 p-8 text-center text-sm font-bold text-gray-500 ring-1 ring-gray-100">
                    No links added yet.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Appointment Button"
                description="Edit the appointment button label and link."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Button Name"
                  value={data.appointment.name}
                  onChange={(value) => updateAppointment("name", value)}
                />

                <Input
                  label="Button Href"
                  value={data.appointment.href}
                  onChange={(value) => updateAppointment("href", value)}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {imageTarget ? (
        <ImageAlbumModal
          images={publicImages}
          onClose={closeImagePicker}
          onChoose={chooseImage}
        />
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
    <div className="mb-8 border-b border-gray-100 pb-5">
      <h2 className="text-2xl font-extrabold text-gray-950">{title}</h2>

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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-semibold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-semibold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
      />
    </label>
  );
}

function ImageSelector({
  label,
  src,
  onChoose,
}: {
  label: string;
  src: string;
  onChoose: () => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
          {src ? (
            <img
              src={displayImagePath(src)}
              alt={label}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <ImageIcon size={30} />
            </div>
          )}
        </div>

        <p className="mt-4 break-all rounded-2xl bg-white px-4 py-3 text-xs font-bold text-gray-500 ring-1 ring-gray-100">
          {src || "No image selected"}
        </p>

        <button
          type="button"
          onClick={onChoose}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
        >
          <ImageIcon size={15} />
          Choose From Public Images
        </button>
      </div>
    </div>
  );
}

function ImageAlbumModal({
  images,
  onClose,
  onChoose,
}: {
  images: PublicImage[];
  onClose: () => void;
  onChoose: (src: string) => void;
}) {
  const [selectedFolder, setSelectedFolder] = useState("All");

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const folders = useMemo(() => {
    return ["All", ...Array.from(new Set(images.map((image) => image.folder)))];
  }, [images]);

  const filteredImages =
    selectedFolder === "All"
      ? images
      : images.filter((image) => image.folder === selectedFolder);

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/75 p-5 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-4xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white p-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950">
              Choose Image
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Browse images by folder from the public directory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[270px_1fr]">
          <aside className="min-h-0 overflow-y-auto border-b border-gray-100 bg-gray-50 p-4 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-gray-950">
              <FolderOpen size={18} className="text-main-100" />
              Folders
            </div>

            <div className="space-y-2">
              {folders.map((folder) => {
                const count =
                  folder === "All"
                    ? images.length
                    : images.filter((image) => image.folder === folder).length;

                return (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setSelectedFolder(folder)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                      selectedFolder === folder
                        ? "bg-main-100 text-white"
                        : "bg-white text-gray-700 hover:bg-main-100/10 hover:text-main-100"
                    }`}
                  >
                    <span className="truncate">
                      {folder === "All" ? "All Images" : folder}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        selectedFolder === folder
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto bg-white p-5">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-gray-950">
                {selectedFolder === "All" ? "All Images" : selectedFolder}
              </h3>

              <p className="mt-1 text-sm font-medium text-gray-500">
                {filteredImages.length} image
                {filteredImages.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredImages.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">
                  No images found in this folder.
                </div>
              ) : (
                filteredImages.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => onChoose(image.src)}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-main-100/15"
                  >
                    <div className="flex h-44 items-center justify-center bg-gray-50 p-3">
                      <img
                        src={displayImagePath(image.src)}
                        alt={image.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="border-t border-gray-100 p-4">
                      <p className="truncate text-sm font-extrabold text-gray-950">
                        {image.name}
                      </p>

                      <p className="mt-1 truncate text-xs font-bold text-main-100">
                        {image.folder}
                      </p>

                      <p className="mt-2 line-clamp-2 break-all text-xs font-medium leading-5 text-gray-500">
                        {image.src}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
