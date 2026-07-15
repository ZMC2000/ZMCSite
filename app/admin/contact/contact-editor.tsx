"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  ChevronDown,
  ContactRound,
  FolderOpen,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
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
  randomPhone,
} from "../utils/admin-placeholders";

type PublicImage = {
  src: string;
  name: string;
  folder: string;
};

type ContactCard = {
  title: string;
  value: string;
  description: string;
  href: string;
  icon: string;
};

type ExtensionItem = {
  label: string;
  extension: string;
};

type ContactPageData = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: {
      src: string;
      alt: string;
    };
  };
  intro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  contactCards: ContactCard[];
  extensions: ExtensionItem[];
  location: {
    title: string;
    address: string;
    description: string;
    mapHref: string;
  };
  form: {
    eyebrow: string;
    title: string;
    description: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    buttonText: string;
  };
};

type ImageTarget = { type: "hero" };

const iconOptions = ["phone", "mail", "mapPin"];

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

export default function ContactEditor({
  initialData,
  initialImages,
}: {
  initialData: ContactPageData;
  initialImages: PublicImage[];
}) {
  const [data, setData] = useState<ContactPageData>(initialData);
  const [publicImages] = useState<PublicImage[]>(initialImages);
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateHero<K extends keyof ContactPageData["hero"]>(
    key: K,
    value: ContactPageData["hero"][K],
  ) {
    setData({
      ...data,
      hero: {
        ...data.hero,
        [key]: value,
      },
    });
  }

  function updateHeroImage<K extends keyof ContactPageData["hero"]["image"]>(
    key: K,
    value: ContactPageData["hero"]["image"][K],
  ) {
    setData({
      ...data,
      hero: {
        ...data.hero,
        image: {
          ...data.hero.image,
          [key]: value,
        },
      },
    });
  }

  function updateIntro<K extends keyof ContactPageData["intro"]>(
    key: K,
    value: ContactPageData["intro"][K],
  ) {
    setData({
      ...data,
      intro: {
        ...data.intro,
        [key]: value,
      },
    });
  }

  function updateContactCard(
    index: number,
    key: keyof ContactCard,
    value: string,
  ) {
    const nextCards = [...data.contactCards];

    nextCards[index] = {
      ...nextCards[index],
      [key]: value,
    };

    setData({
      ...data,
      contactCards: nextCards,
    });
  }

  function addContactCard() {
    const phone = randomPhone();
    setData({
      ...data,
      contactCards: [
        ...data.contactCards,
        {
          title: randomLabel("New Contact"),
          value: phone,
          description: randomLabel("Contact description"),
          href: `tel:${phone.replaceAll(" ", "")}`,
          icon: "phone",
        },
      ],
    });
  }

  function removeContactCard(index: number) {
    setData({
      ...data,
      contactCards: data.contactCards.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  function moveContactCard(fromIndex: number, toIndex: number) {
    setData({
      ...data,
      contactCards: moveItem(data.contactCards, fromIndex, toIndex),
    });
  }

  function updateExtension(
    index: number,
    key: keyof ExtensionItem,
    value: string,
  ) {
    const nextExtensions = [...data.extensions];

    nextExtensions[index] = {
      ...nextExtensions[index],
      [key]: value,
    };

    setData({
      ...data,
      extensions: nextExtensions,
    });
  }

  function addExtension() {
    setData({
      ...data,
      extensions: [
        ...data.extensions,
        {
          label: randomLabel("New Extension"),
          extension: randomDigits(4),
        },
      ],
    });
  }

  function removeExtension(index: number) {
    setData({
      ...data,
      extensions: data.extensions.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function moveExtension(fromIndex: number, toIndex: number) {
    setData({
      ...data,
      extensions: moveItem(data.extensions, fromIndex, toIndex),
    });
  }

  function updateLocation<K extends keyof ContactPageData["location"]>(
    key: K,
    value: ContactPageData["location"][K],
  ) {
    setData({
      ...data,
      location: {
        ...data.location,
        [key]: value,
      },
    });
  }

  function updateForm<K extends keyof ContactPageData["form"]>(
    key: K,
    value: ContactPageData["form"][K],
  ) {
    setData({
      ...data,
      form: {
        ...data.form,
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

    if (imageTarget.type === "hero") {
      updateHeroImage("src", cleanedSrc);
    }

    setImageTarget(null);
  }

  async function saveChanges() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          `${errorData.message || "Failed to save changes."}${
            errorData.error ? ` Reason: ${errorData.error}` : ""
          }`,
        );
      }

      setMessage("Contact page updated successfully.");
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
                  <ContactRound size={15} strokeWidth={2.5} />
                  Contact Page Editor
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
                  Edit Contact Page
                </h1>

                <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-gray-600">
                  Update hero content, intro text, contact cards, extensions,
                  location details, and contact form labels.
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
                title="Hero Section"
                description="Edit the contact page hero content and banner image."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Eyebrow"
                  value={data.hero.eyebrow}
                  onChange={(value) => updateHero("eyebrow", value)}
                />

                <Input
                  label="Title"
                  value={data.hero.title}
                  onChange={(value) => updateHero("title", value)}
                />

                <Textarea
                  label="Subtitle"
                  value={data.hero.subtitle}
                  onChange={(value) => updateHero("subtitle", value)}
                />

                <Input
                  label="Image Alt"
                  value={data.hero.image.alt}
                  onChange={(value) => updateHeroImage("alt", value)}
                />

                <div className="lg:col-span-2">
                  <ImageSelector
                    label="Hero Image"
                    src={data.hero.image.src}
                    onChoose={() => openImagePicker({ type: "hero" })}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Intro Section"
                description="Edit the introduction text shown before the contact details."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Eyebrow"
                  value={data.intro.eyebrow}
                  onChange={(value) => updateIntro("eyebrow", value)}
                />

                <Input
                  label="Title"
                  value={data.intro.title}
                  onChange={(value) => updateIntro("title", value)}
                />

                <div className="lg:col-span-2">
                  <Textarea
                    label="Description"
                    value={data.intro.description}
                    onChange={(value) => updateIntro("description", value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-950">
                    Contact Cards
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                    Edit phone numbers, email address, links, descriptions, and
                    icons.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addContactCard}
                  className="inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  <Plus size={15} />
                  Add Contact
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {data.contactCards.map((card, index) => (
                  <DraggableAdminItem
                    key={`${card.title}-${index}`}
                    index={index}
                    onMove={moveContactCard}
                  >
                    <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main-100 text-white">
                            {card.icon === "mail" ? (
                              <Mail size={22} strokeWidth={2.5} />
                            ) : card.icon === "mapPin" ? (
                              <MapPin size={22} strokeWidth={2.5} />
                            ) : (
                              <Phone size={22} strokeWidth={2.5} />
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-extrabold text-gray-950">
                              {card.title}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">
                              {card.value}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeContactCard(index)}
                          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <Input
                          label="Title"
                          value={card.title}
                          onChange={(value) =>
                            updateContactCard(index, "title", value)
                          }
                        />

                        <Input
                          label="Value"
                          value={card.value}
                          onChange={(value) =>
                            updateContactCard(index, "value", value)
                          }
                        />

                        <Input
                          label="Href"
                          value={card.href}
                          onChange={(value) =>
                            updateContactCard(index, "href", value)
                          }
                        />

                        <Select
                          label="Icon"
                          value={card.icon}
                          onChange={(value) =>
                            updateContactCard(index, "icon", value)
                          }
                          options={iconOptions.map((icon) => ({
                            label: icon,
                            value: icon,
                          }))}
                        />

                        <div className="lg:col-span-2">
                          <Textarea
                            label="Description"
                            value={card.description}
                            onChange={(value) =>
                              updateContactCard(index, "description", value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </DraggableAdminItem>
                ))}
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-950">
                    Extensions
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                    Add or edit department extension numbers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExtension}
                  className="inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  <Plus size={15} />
                  Add Extension
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {data.extensions.map((extension, index) => (
                  <DraggableAdminItem
                    key={`${extension.label}-${index}`}
                    index={index}
                    onMove={moveExtension}
                  >
                    <div className="rounded-4xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-extrabold text-gray-950">
                            {extension.label}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-main-100">
                            Ext. {extension.extension}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExtension(index)}
                          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <Input
                          label="Label"
                          value={extension.label}
                          onChange={(value) =>
                            updateExtension(index, "label", value)
                          }
                        />

                        <Input
                          label="Extension"
                          value={extension.extension}
                          onChange={(value) =>
                            updateExtension(index, "extension", value)
                          }
                        />
                      </div>
                    </div>
                  </DraggableAdminItem>
                ))}
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Location Section"
                description="Edit the address, map link, and location description."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Title"
                  value={data.location.title}
                  onChange={(value) => updateLocation("title", value)}
                />

                <Input
                  label="Address"
                  value={data.location.address}
                  onChange={(value) => updateLocation("address", value)}
                />

                <Input
                  label="Map Link"
                  value={data.location.mapHref}
                  onChange={(value) => updateLocation("mapHref", value)}
                />

                <div className="lg:col-span-2">
                  <Textarea
                    label="Description"
                    value={data.location.description}
                    onChange={(value) => updateLocation("description", value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
              <SectionHeader
                title="Form Section"
                description="Edit the labels and text for the contact message form."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <Input
                  label="Eyebrow"
                  value={data.form.eyebrow}
                  onChange={(value) => updateForm("eyebrow", value)}
                />

                <Input
                  label="Title"
                  value={data.form.title}
                  onChange={(value) => updateForm("title", value)}
                />

                <Input
                  label="Name Label"
                  value={data.form.nameLabel}
                  onChange={(value) => updateForm("nameLabel", value)}
                />

                <Input
                  label="Email Label"
                  value={data.form.emailLabel}
                  onChange={(value) => updateForm("emailLabel", value)}
                />

                <Input
                  label="Message Label"
                  value={data.form.messageLabel}
                  onChange={(value) => updateForm("messageLabel", value)}
                />

                <Input
                  label="Button Text"
                  value={data.form.buttonText}
                  onChange={(value) => updateForm("buttonText", value)}
                />

                <div className="lg:col-span-2">
                  <Textarea
                    label="Description"
                    value={data.form.description}
                    onChange={(value) => updateForm("description", value)}
                  />
                </div>
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

function Textarea({
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

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-semibold leading-7 text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
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
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-gray-950">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-full border border-gray-100 bg-gray-50 px-5 pr-11 text-sm font-bold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
        >
          {options.map((option) => (
            <option
              key={`${option.value}-${option.label}`}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-main-100"
        />
      </div>
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
