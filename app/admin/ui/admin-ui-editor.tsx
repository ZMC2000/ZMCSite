"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  ChevronDown,
  FolderOpen,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type EditablePage = {
  key: string;
  label: string;
  description: string;
  data: JsonValue;
};

type PublicImage = {
  src: string;
  name: string;
  folder: string;
};

type ImagePickerState = {
  path: (string | number)[];
};

function makeSafeKey(parts: Array<string | number | undefined | null>) {
  return parts
    .map((part) => String(part ?? "empty"))
    .join("__")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
}

function normalizeImagePath(src: string) {
  if (!src) return "";

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return src.startsWith("/") ? src : `/${src}`;
}

function displayImagePath(src: string) {
  return encodeURI(normalizeImagePath(src));
}

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isImageKey(key: string) {
  const lowerKey = key.toLowerCase();

  return (
    lowerKey === "src" ||
    lowerKey === "image" ||
    lowerKey.includes("image") ||
    lowerKey.includes("thumbnail")
  );
}

function isLongTextKey(key: string) {
  const lowerKey = key.toLowerCase();

  return (
    lowerKey.includes("description") ||
    lowerKey.includes("paragraph") ||
    lowerKey.includes("subtitle") ||
    lowerKey.includes("message")
  );
}

function getValueAtPath(data: JsonValue, path: (string | number)[]) {
  let current: JsonValue = data;

  for (const part of path) {
    if (Array.isArray(current) && typeof part === "number") {
      current = current[part];
      continue;
    }

    if (isObject(current) && typeof part === "string") {
      current = current[part];
      continue;
    }

    return undefined;
  }

  return current;
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function setValueAtPath(
  data: JsonValue,
  path: (string | number)[],
  value: JsonValue,
): JsonValue {
  const cloned = cloneJson(data);

  if (path.length === 0) {
    return value;
  }

  let current: JsonValue = cloned;

  for (let index = 0; index < path.length - 1; index++) {
    const part = path[index];

    if (Array.isArray(current) && typeof part === "number") {
      current = current[part];
      continue;
    }

    if (isObject(current) && typeof part === "string") {
      current = current[part];
      continue;
    }
  }

  const last = path[path.length - 1];

  if (Array.isArray(current) && typeof last === "number") {
    current[last] = value;
  }

  if (isObject(current) && typeof last === "string") {
    current[last] = value;
  }

  return cloned;
}

function removeArrayItemAtPath(
  data: JsonValue,
  path: (string | number)[],
  itemIndex: number,
) {
  const arrayValue = getValueAtPath(data, path);

  if (!Array.isArray(arrayValue)) {
    return data;
  }

  const nextArray = arrayValue.filter((_, index) => index !== itemIndex);

  return setValueAtPath(data, path, nextArray);
}

function addArrayItemAtPath(data: JsonValue, path: (string | number)[]) {
  const arrayValue = getValueAtPath(data, path);

  if (!Array.isArray(arrayValue)) {
    return data;
  }

  const lastItem = arrayValue[arrayValue.length - 1];

  let newItem: JsonValue = "";

  if (isObject(lastItem) || Array.isArray(lastItem)) {
    newItem = cloneJson(lastItem);
  } else if (typeof lastItem === "number") {
    newItem = 0;
  } else if (typeof lastItem === "boolean") {
    newItem = false;
  }

  const nextArray = [...arrayValue, newItem];

  return setValueAtPath(data, path, nextArray);
}

export default function AdminUiEditor({
  title,
  subtitle,
  pages,
  initialImages,
}: {
  title: string;
  subtitle: string;
  pages: EditablePage[];
  initialImages: PublicImage[];
}) {
  const [activeKey, setActiveKey] = useState(pages[0]?.key || "");
  const [pageData, setPageData] = useState<Record<string, JsonValue>>(() => {
    const initial: Record<string, JsonValue> = {};

    pages.forEach((page, index) => {
      initial[page.key || `page-${index}`] = page.data;
    });

    return initial;
  });

  const [publicImages] = useState<PublicImage[]>(initialImages);
  const [imagePicker, setImagePicker] = useState<ImagePickerState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activePage = pages.find((page) => page.key === activeKey) || pages[0];
  const activeData = pageData[activePage.key];

  function updateActiveData(nextData: JsonValue) {
    setPageData({
      ...pageData,
      [activePage.key]: nextData,
    });
  }

  function updatePath(path: (string | number)[], value: JsonValue) {
    updateActiveData(setValueAtPath(activeData, path, value));
  }

  function removeArrayItem(path: (string | number)[], itemIndex: number) {
    updateActiveData(removeArrayItemAtPath(activeData, path, itemIndex));
  }

  function addArrayItem(path: (string | number)[]) {
    updateActiveData(addArrayItemAtPath(activeData, path));
  }

  function chooseImage(src: string) {
    if (!imagePicker) return;

    updatePath(imagePicker.path, normalizeImagePath(src));
    setImagePicker(null);
  }

  async function saveChanges() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/ui", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: activePage.key,
          data: activeData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `${result.message || "Failed to save content."}${
            result.error ? ` Reason: ${result.error}` : ""
          }`,
        );
      }

      setMessage(`${activePage.label} saved successfully.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save content.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!activePage) {
    return (
      <main className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5">
          <div className="rounded-3xl bg-red-50 p-5 text-sm font-extrabold text-red-600">
            No admin pages found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative overflow-hidden bg-white py-10 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/50">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-main-100">
                  Compact Panel
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                  {title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-gray-500">
                  {subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={saveChanges}
                disabled={isSaving}
                className="flex h-11 w-fit min-w-36 cursor-pointer items-center justify-center gap-2 rounded-full bg-main-100 px-5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/20 transition hover:bg-main-100/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <Save size={15} />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {message ? (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-main-100/10 p-3 text-main-100">
              <CheckCircle2 size={20} strokeWidth={2.5} />
              <p className="text-sm font-extrabold">{message}</p>
            </div>
          ) : null}

          {error ? (
            <div className="mb-5 rounded-2xl bg-red-50 p-3 text-sm font-extrabold text-red-600">
              {error}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
            <aside className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50">
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-gray-500">
                  Choose Page
                </span>

                <select
                  value={activeKey}
                  onChange={(event) => {
                    setActiveKey(event.target.value);
                    setMessage("");
                    setError("");
                  }}
                  className="h-11 w-full cursor-pointer rounded-full border border-gray-100 bg-gray-50 px-4 text-sm font-bold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                >
                  {pages.map((page, index) => (
                    <option
                      key={makeSafeKey(["select-option", page.key, index])}
                      value={page.key}
                    >
                      {page.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 space-y-2">
                {pages.map((page, index) => (
                  <button
                    key={makeSafeKey(["sidebar-page", page.key, index])}
                    type="button"
                    onClick={() => {
                      setActiveKey(page.key);
                      setMessage("");
                      setError("");
                    }}
                    className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-left transition ${
                      activeKey === page.key
                        ? "bg-main-100 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-main-100/10 hover:text-main-100"
                    }`}
                  >
                    <p className="text-sm font-extrabold">{page.label}</p>
                    <p
                      className={`mt-1 line-clamp-2 text-xs font-medium leading-5 ${
                        activeKey === page.key
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {page.description}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="min-w-0 rounded-3xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50 sm:p-5">
              <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-950">
                    {activePage.label}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-gray-500">
                    {activePage.description}
                  </p>
                </div>

                <div className="rounded-full bg-main-100/10 px-3 py-1.5 text-xs font-extrabold text-main-100">
                  Compact edit mode
                </div>
              </div>

              <div className="space-y-4">
                <JsonEditor
                  value={activeData}
                  path={[]}
                  itemKey={activePage.key}
                  level={0}
                  onChange={updatePath}
                  onAddArrayItem={addArrayItem}
                  onRemoveArrayItem={removeArrayItem}
                  onPickImage={(path) => setImagePicker({ path })}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {imagePicker ? (
        <ImageAlbumModal
          images={publicImages}
          onClose={() => setImagePicker(null)}
          onChoose={chooseImage}
        />
      ) : null}
    </>
  );
}

function JsonEditor({
  value,
  path,
  itemKey,
  level,
  onChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onPickImage,
}: {
  value: JsonValue;
  path: (string | number)[];
  itemKey: string;
  level: number;
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onAddArrayItem: (path: (string | number)[]) => void;
  onRemoveArrayItem: (path: (string | number)[], itemIndex: number) => void;
  onPickImage: (path: (string | number)[]) => void;
}) {
  const currentPathKey =
    path.length === 0 ? "root" : makeSafeKey(path.map(String));

  if (Array.isArray(value)) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-gray-950">
              {formatKey(itemKey)}
            </p>

            <p className="mt-1 text-xs font-bold text-gray-400">
              {value.length} item{value.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddArrayItem(path)}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-main-100 px-3 text-xs font-bold uppercase tracking-wide text-white"
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {value.map((item, index) => {
            const itemPath = [...path, index];
            const itemPathKey = makeSafeKey(["array", ...itemPath, index]);

            return (
              <details
                key={itemPathKey}
                className="group rounded-2xl border border-gray-100 bg-white"
                open={value.length <= 3}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-gray-950">
                      {getArrayItemTitle(item, index)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-400">
                      Item {index + 1}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        onRemoveArrayItem(path, index);
                      }}
                      className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-bold text-red-600"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>

                    <ChevronDown
                      size={18}
                      className="text-gray-400 transition group-open:rotate-180"
                    />
                  </div>
                </summary>

                <div className="border-t border-gray-100 p-3">
                  <JsonEditor
                    value={item}
                    path={itemPath}
                    itemKey={`${itemKey} ${index + 1}`}
                    level={level + 1}
                    onChange={onChange}
                    onAddArrayItem={onAddArrayItem}
                    onRemoveArrayItem={onRemoveArrayItem}
                    onPickImage={onPickImage}
                  />
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  }

  if (isObject(value)) {
    const entries = Object.entries(value);

    return (
      <div
        className={`grid gap-3 ${
          level === 0 ? "sm:grid-cols-2" : "sm:grid-cols-2"
        }`}
      >
        {entries.map(([key, childValue], index) => {
          const childPath = [...path, key];
          const childPathKey = makeSafeKey([
            "object",
            currentPathKey,
            key,
            index,
          ]);

          return (
            <div
              key={childPathKey}
              className={
                isObject(childValue) || Array.isArray(childValue)
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <JsonEditor
                value={childValue}
                path={childPath}
                itemKey={key}
                level={level + 1}
                onChange={onChange}
                onAddArrayItem={onAddArrayItem}
                onRemoveArrayItem={onRemoveArrayItem}
                onPickImage={onPickImage}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <FieldEditor
      label={formatKey(itemKey)}
      value={value}
      itemKey={itemKey}
      path={path}
      onChange={onChange}
      onPickImage={onPickImage}
    />
  );
}

function FieldEditor({
  label,
  value,
  itemKey,
  path,
  onChange,
  onPickImage,
}: {
  label: string;
  value: JsonValue;
  itemKey: string;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onPickImage: (path: (string | number)[]) => void;
}) {
  const stringValue = value === null ? "" : String(value);
  const isImageField = typeof value === "string" && isImageKey(itemKey);

  if (typeof value === "boolean") {
    return (
      <label className="flex h-11 cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4">
        <span className="text-sm font-extrabold text-gray-950">{label}</span>

        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-main-100"
        />
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500">
          {label}
        </span>

        <input
          type="number"
          value={value}
          onChange={(event) => onChange(path, Number(event.target.value))}
          className="h-11 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-sm font-semibold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
        />
      </label>
    );
  }

  if (isImageField) {
    return (
      <div>
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500">
          {label}
        </span>

        <div className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-2">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-gray-100">
            {stringValue ? (
              <img
                src={displayImagePath(stringValue)}
                alt={label}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <ImageIcon size={20} className="text-gray-300" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              value={stringValue}
              onChange={(event) => onChange(path, event.target.value)}
              className="h-9 w-full rounded-xl border border-gray-100 bg-white px-3 text-xs font-bold text-gray-700 outline-none focus:border-main-100 focus:ring-4 focus:ring-main-100/10"
            />

            <button
              type="button"
              onClick={() => onPickImage(path)}
              className="mt-2 inline-flex h-8 cursor-pointer items-center gap-1 rounded-full bg-main-100 px-3 text-[11px] font-extrabold uppercase tracking-wide text-white"
            >
              <ImageIcon size={12} />
              Choose
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (typeof value === "string" && isLongTextKey(itemKey)) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500">
          {label}
        </span>

        <textarea
          value={stringValue}
          onChange={(event) => onChange(path, event.target.value)}
          rows={3}
          className="w-full resize-y rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold leading-6 text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500">
        {label}
      </span>

      <input
        value={stringValue}
        onChange={(event) => onChange(path, event.target.value)}
        className="h-11 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-sm font-semibold text-gray-950 outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
      />
    </label>
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
      <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white p-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              Choose Image
            </h2>

            <p className="mt-1 text-xs font-bold text-gray-500">
              Small thumbnails from public folder.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[240px_1fr]">
          <aside className="min-h-0 overflow-y-auto border-b border-gray-100 bg-gray-50 p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gray-950">
              <FolderOpen size={16} className="text-main-100" />
              Folders
            </div>

            <div className="space-y-2">
              {folders.map((folder, index) => {
                const count =
                  folder === "All"
                    ? images.length
                    : images.filter((image) => image.folder === folder).length;

                return (
                  <button
                    key={makeSafeKey(["folder-filter", folder, index])}
                    type="button"
                    onClick={() => setSelectedFolder(folder)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${
                      selectedFolder === folder
                        ? "bg-main-100 text-white"
                        : "bg-white text-gray-700 hover:bg-main-100/10 hover:text-main-100"
                    }`}
                  >
                    <span className="truncate">
                      {folder === "All" ? "All Images" : folder}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
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

          <div className="min-h-0 overflow-y-auto bg-white p-4">
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-gray-950">
                {selectedFolder === "All" ? "All Images" : selectedFolder}
              </h3>

              <p className="mt-1 text-xs font-bold text-gray-500">
                {filteredImages.length} image
                {filteredImages.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {filteredImages.length === 0 ? (
                <div className="col-span-full rounded-2xl bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">
                  No images found.
                </div>
              ) : (
                filteredImages.map((image, index) => (
                  <button
                    key={makeSafeKey(["image-choice", image.src, index])}
                    type="button"
                    onClick={() => onChoose(image.src)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-main-100/15"
                  >
                    <div className="flex h-28 items-center justify-center bg-gray-50 p-2">
                      <img
                        src={displayImagePath(image.src)}
                        alt={image.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="border-t border-gray-100 p-3">
                      <p className="truncate text-xs font-extrabold text-gray-950">
                        {image.name}
                      </p>

                      <p className="mt-1 truncate text-[11px] font-bold text-main-100">
                        {image.folder}
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

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function getArrayItemTitle(item: JsonValue, index: number) {
  if (isObject(item)) {
    const possibleTitle =
      item.title || item.name || item.label || item.role || item.text;

    if (typeof possibleTitle === "string" && possibleTitle.trim()) {
      return possibleTitle;
    }
  }

  if (typeof item === "string" && item.trim()) {
    return item.length > 50 ? `${item.slice(0, 50)}...` : item;
  }

  return `Item ${index + 1}`;
}
