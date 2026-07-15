import path from "path";
import { readFile, writeFile } from "fs/promises";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const structuralKeys = new Set([
  "id",
  "src",
  "image",
  "icon",
  "href",
  "url",
  "email",
  "phone",
  "extension",
  "width",
  "height",
  "target",
  "folder",
]);

function isObject(
  value: JsonValue | undefined,
): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStructuralField(key: string, value: JsonValue) {
  const normalizedKey = key.toLowerCase();

  if (
    structuralKeys.has(normalizedKey) ||
    normalizedKey.endsWith("href") ||
    normalizedKey.endsWith("src") ||
    normalizedKey.endsWith("url")
  ) {
    return true;
  }

  if (typeof value !== "string") return false;

  return (
    /^(?:https?:\/\/|\/|#|tel:|mailto:)/i.test(value) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    /^\+?[\d\s()/.+-]+$/.test(value)
  );
}

function sameValue(left: JsonValue | undefined, right: JsonValue | undefined) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function identityValue(value: JsonValue) {
  if (typeof value === "string" || typeof value === "number") {
    return `value:${value}`;
  }

  if (!isObject(value)) return null;

  for (const key of [
    "id",
    "name",
    "title",
    "label",
    "href",
    "src",
    "image",
    "email",
    "phone",
    "extension",
  ]) {
    const candidate = value[key];
    if (typeof candidate === "string" || typeof candidate === "number") {
      return `${key}:${candidate}`;
    }
  }

  return null;
}

function arrayItemsMatch(previous: JsonValue, next: JsonValue) {
  if (sameValue(previous, next)) return true;

  const previousIdentity = identityValue(previous);
  const nextIdentity = identityValue(next);
  return previousIdentity !== null && previousIdentity === nextIdentity;
}

function alignArray(previous: JsonValue[], next: JsonValue[]) {
  const previousIdentities = previous.map(identityValue);
  const nextIdentities = next.map(identityValue);
  const hasUniqueMatchingIdentities =
    previous.length === next.length &&
    previousIdentities.every((identity) => identity !== null) &&
    nextIdentities.every((identity) => identity !== null) &&
    new Set(previousIdentities).size === previous.length &&
    new Set(nextIdentities).size === next.length &&
    nextIdentities.every((identity) => previousIdentities.includes(identity));

  if (hasUniqueMatchingIdentities) {
    return nextIdentities.map((identity) =>
      previousIdentities.indexOf(identity),
    );
  }

  if (previous.length === next.length) {
    return next.map((_, index) => index);
  }

  const rows = previous.length + 1;
  const columns = next.length + 1;
  const lcs = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let oldIndex = previous.length - 1; oldIndex >= 0; oldIndex--) {
    for (let newIndex = next.length - 1; newIndex >= 0; newIndex--) {
      lcs[oldIndex][newIndex] = arrayItemsMatch(
        previous[oldIndex],
        next[newIndex],
      )
        ? lcs[oldIndex + 1][newIndex + 1] + 1
        : Math.max(lcs[oldIndex + 1][newIndex], lcs[oldIndex][newIndex + 1]);
    }
  }

  const mapping = Array<number | null>(next.length).fill(null);
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < previous.length && newIndex < next.length) {
    if (arrayItemsMatch(previous[oldIndex], next[newIndex])) {
      mapping[newIndex] = oldIndex;
      oldIndex++;
      newIndex++;
    } else if (lcs[oldIndex + 1][newIndex] >= lcs[oldIndex][newIndex + 1]) {
      oldIndex++;
    } else {
      newIndex++;
    }
  }

  return mapping;
}

export function syncArabicStructure(
  nextEnglish: JsonValue,
  previousEnglish: JsonValue | undefined,
  previousArabic: JsonValue | undefined,
  key = "",
): JsonValue {
  if (Array.isArray(nextEnglish)) {
    const oldEnglishArray = Array.isArray(previousEnglish)
      ? previousEnglish
      : [];
    const oldArabicArray = Array.isArray(previousArabic) ? previousArabic : [];
    const mapping = alignArray(oldEnglishArray, nextEnglish);

    return nextEnglish.map((item, newIndex) => {
      const oldIndex = mapping[newIndex];

      if (oldIndex === null || oldIndex === undefined) {
        return item;
      }

      return syncArabicStructure(
        item,
        oldEnglishArray[oldIndex],
        oldArabicArray[oldIndex],
        key,
      );
    });
  }

  if (isObject(nextEnglish)) {
    const oldEnglishObject = isObject(previousEnglish) ? previousEnglish : {};
    const oldArabicObject = isObject(previousArabic) ? previousArabic : {};

    return Object.fromEntries(
      Object.entries(nextEnglish).map(([childKey, childValue]) => [
        childKey,
        syncArabicStructure(
          childValue,
          oldEnglishObject[childKey],
          oldArabicObject[childKey],
          childKey,
        ),
      ]),
    );
  }

  if (
    typeof nextEnglish !== "string" ||
    isStructuralField(key, nextEnglish) ||
    previousArabic === undefined
  ) {
    return nextEnglish;
  }

  return typeof previousArabic === "string" ? previousArabic : nextEnglish;
}

export function applyArabicTranslations(
  english: JsonValue,
  currentArabic: JsonValue | undefined,
  submittedArabic: JsonValue | undefined,
  key = "",
): JsonValue {
  if (Array.isArray(english)) {
    const current = Array.isArray(currentArabic) ? currentArabic : [];
    const submitted = Array.isArray(submittedArabic) ? submittedArabic : [];

    return english.map((item, index) =>
      applyArabicTranslations(item, current[index], submitted[index], key),
    );
  }

  if (isObject(english)) {
    const current = isObject(currentArabic) ? currentArabic : {};
    const submitted = isObject(submittedArabic) ? submittedArabic : {};

    return Object.fromEntries(
      Object.entries(english).map(([childKey, childValue]) => [
        childKey,
        applyArabicTranslations(
          childValue,
          current[childKey],
          submitted[childKey],
          childKey,
        ),
      ]),
    );
  }

  if (typeof english !== "string" || isStructuralField(key, english)) {
    return english;
  }

  if (typeof submittedArabic === "string") return submittedArabic;
  if (typeof currentArabic === "string") return currentArabic;
  return english;
}

export async function saveEnglishAndSyncArabic(
  fileName: string,
  nextEnglish: JsonValue,
) {
  const dataDirectory = path.join(process.cwd(), "app", "data");
  const englishPath = path.join(dataDirectory, fileName);
  const arabicPath = path.join(dataDirectory, "ar", fileName);

  const [previousEnglishText, previousArabicText] = await Promise.all([
    readFile(englishPath, "utf8"),
    readFile(arabicPath, "utf8"),
  ]);

  const nextArabic = syncArabicStructure(
    nextEnglish,
    JSON.parse(previousEnglishText),
    JSON.parse(previousArabicText),
  );

  await Promise.all([
    writeFile(englishPath, JSON.stringify(nextEnglish, null, 2), "utf8"),
    writeFile(arabicPath, JSON.stringify(nextArabic, null, 2), "utf8"),
  ]);
}
