import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import {
  applyArabicTranslations,
  saveEnglishAndSyncArabic,
} from "@/app/lib/sync-arabic-data";

export const runtime = "nodejs";

const fileMap: Record<string, string> = {
  arUi: "ar/ui.json",
  arNavbar: "ar/navbar.json",
  arFooter: "ar/footer.json",
  arHeader: "ar/header.json",
  arAboutIntro: "ar/aboutIntro.json",
  arServices: "ar/services.json",
  arSupportServices: "ar/supportServices.json",
  arAboutPage: "ar/aboutPage.json",
  arServicesPage: "ar/servicesPage.json",
  arSchedulePage: "ar/schedulePage.json",
  arStaffPage: "ar/staffPage.json",
  arContactPage: "ar/contactPage.json",
  homeHeader: "header.json",
  homeAboutIntro: "aboutIntro.json",
  homeServices: "services.json",
  homeSupportServices: "supportServices.json",
  navbar: "navbar.json",
  aboutPage: "aboutPage.json",
  servicesPage: "servicesPage.json",
  schedulePage: "schedulePage.json",
  staffPage: "staffPage.json",
  contactPage: "contactPage.json",
  footer: "footer.json",
};

const arabicFileMap: Record<string, string> = {
  arNavbar: "navbar.json",
  arFooter: "footer.json",
  arHeader: "header.json",
  arAboutIntro: "aboutIntro.json",
  arServices: "services.json",
  arSupportServices: "supportServices.json",
  arAboutPage: "aboutPage.json",
  arServicesPage: "servicesPage.json",
  arSchedulePage: "schedulePage.json",
  arStaffPage: "staffPage.json",
  arContactPage: "contactPage.json",
};

type UnknownJson =
  | string
  | number
  | boolean
  | null
  | UnknownJson[]
  | { [key: string]: UnknownJson };

function updateArabicUiLeaves(
  current: UnknownJson,
  submitted: UnknownJson,
  key = "",
): UnknownJson {
  if (Array.isArray(current)) {
    const submittedArray = Array.isArray(submitted) ? submitted : [];
    return current.map((item, index) =>
      updateArabicUiLeaves(item, submittedArray[index], key),
    );
  }

  if (typeof current === "object" && current !== null) {
    const submittedObject =
      typeof submitted === "object" &&
      submitted !== null &&
      !Array.isArray(submitted)
        ? submitted
        : {};

    return Object.fromEntries(
      Object.entries(current).map(([childKey, childValue]) => [
        childKey,
        updateArabicUiLeaves(childValue, submittedObject[childKey], childKey),
      ]),
    );
  }

  return key === "ar" && typeof submitted === "string" ? submitted : current;
}

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const key = String(body.key || "");
    const data = body.data;

    const fileName = fileMap[key];

    if (!fileName) {
      return NextResponse.json(
        { message: "Invalid admin UI page key." },
        { status: 400 },
      );
    }

    const arabicFileName = arabicFileMap[key];

    if (key === "arUi") {
      const uiPath = path.join(process.cwd(), "app", "data", "ar", "ui.json");
      const currentUi = JSON.parse(await readFile(uiPath, "utf8"));
      const translatedUi = updateArabicUiLeaves(currentUi, data);
      await writeFile(uiPath, JSON.stringify(translatedUi, null, 2), "utf8");
    } else if (arabicFileName) {
      const dataDirectory = path.join(process.cwd(), "app", "data");
      const english = JSON.parse(
        await readFile(path.join(dataDirectory, arabicFileName), "utf8"),
      );
      const arabicPath = path.join(dataDirectory, "ar", arabicFileName);
      const currentArabic = JSON.parse(await readFile(arabicPath, "utf8"));
      const translatedData = applyArabicTranslations(
        english,
        currentArabic,
        data,
      );

      await writeFile(
        arabicPath,
        JSON.stringify(translatedData, null, 2),
        "utf8",
      );
    } else {
      await saveEnglishAndSyncArabic(fileName, data);
    }

    return NextResponse.json({
      message: "Content saved successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save content.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
