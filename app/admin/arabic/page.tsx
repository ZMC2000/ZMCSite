import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminUiEditor from "../ui/admin-ui-editor";
import path from "path";
import { readFile, readdir } from "fs/promises";

const publicPath = path.join(process.cwd(), "public");
const arabicDataPath = path.join(process.cwd(), "app", "data", "ar");
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

const pages = [
  {
    key: "arUi",
    label: "Common · Interface Labels",
    description: "Buttons, filters, badges, and other small interface labels.",
    file: "ui.json",
  },
  {
    key: "arNavbar",
    label: "Common · Navbar",
    description: "Navigation, location, hours, and contact details.",
    file: "navbar.json",
  },
  {
    key: "arFooter",
    label: "Common · Footer",
    description: "Footer links, contact details, and labels.",
    file: "footer.json",
  },
  {
    key: "arHeader",
    label: "Homepage · Header",
    description: "Homepage hero heading and call to action.",
    file: "header.json",
  },
  {
    key: "arAboutIntro",
    label: "Homepage · About Intro",
    description: "Homepage introductory content.",
    file: "aboutIntro.json",
  },
  {
    key: "arServices",
    label: "Homepage · Services",
    description: "Homepage medical service cards.",
    file: "services.json",
  },
  {
    key: "arSupportServices",
    label: "Homepage · Support Services",
    description: "Homepage supportive services section.",
    file: "supportServices.json",
  },
  {
    key: "arAboutPage",
    label: "Pages · About",
    description: "Full Arabic About page content.",
    file: "aboutPage.json",
  },
  {
    key: "arServicesPage",
    label: "Pages · Services",
    description: "Full Arabic Services page content.",
    file: "servicesPage.json",
  },
  {
    key: "arSchedulePage",
    label: "Pages · Schedule",
    description: "Arabic specialties, doctors, and schedules.",
    file: "schedulePage.json",
  },
  {
    key: "arStaffPage",
    label: "Pages · Staff",
    description: "Arabic staff names, roles, and page content.",
    file: "staffPage.json",
  },
  {
    key: "arContactPage",
    label: "Pages · Contact",
    description: "Arabic contact details, location, and form labels.",
    file: "contactPage.json",
  },
];

type PublicImage = { src: string; name: string; folder: string };

async function getImagesFromDirectory(
  directoryPath: string,
  basePath = "",
): Promise<PublicImage[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const images: PublicImage[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    const publicUrl = `${basePath}/${entry.name}`.replace(/\/+/g, "/");

    if (entry.isDirectory()) {
      images.push(...(await getImagesFromDirectory(fullPath, publicUrl)));
      continue;
    }

    if (
      entry.isFile() &&
      allowedExtensions.includes(path.extname(entry.name).toLowerCase())
    ) {
      images.push({
        src: publicUrl.startsWith("/") ? publicUrl : `/${publicUrl}`,
        name: entry.name,
        folder: basePath || "/",
      });
    }
  }

  return images;
}

export default async function AdminArabicPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") redirect("/admin/login");

  const editablePages = await Promise.all(
    pages.map(async (page) => ({
      key: page.key,
      label: page.label,
      description: page.description,
      data: JSON.parse(
        await readFile(path.join(arabicDataPath, page.file), "utf8"),
      ),
    })),
  );

  const publicImages = await getImagesFromDirectory(publicPath);

  return (
    <AdminUiEditor
      title="Arabic Content"
      subtitle="Translate the Arabic wording here. Items, images, links, and ordering are managed by the English panels and synchronized automatically."
      pages={editablePages}
      initialImages={publicImages.sort((a, b) => a.src.localeCompare(b.src))}
      translationOnly
    />
  );
}
