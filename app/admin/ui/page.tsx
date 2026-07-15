import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminUiEditor from "./admin-ui-editor";
import path from "path";
import { readFile, readdir } from "fs/promises";

const publicPath = path.join(process.cwd(), "public");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

const pages = [
  {
    key: "homeHeader",
    label: "Home Header",
    description: "Main homepage hero section.",
    file: "header.json",
  },
  {
    key: "homeAboutIntro",
    label: "Home About Intro",
    description: "Homepage intro section.",
    file: "aboutIntro.json",
  },
  {
    key: "homeServices",
    label: "Home Services",
    description: "Homepage services cards.",
    file: "services.json",
  },
  {
    key: "homeSupportServices",
    label: "Home Support Services",
    description: "Homepage supportive services section.",
    file: "supportServices.json",
  },
  {
    key: "navbar",
    label: "Navbar",
    description: "Website logo, links, contact, and appointment button.",
    file: "navbar.json",
  },
  {
    key: "aboutPage",
    label: "About Page",
    description: "Full About page content.",
    file: "aboutPage.json",
  },
  {
    key: "servicesPage",
    label: "Services Page",
    description: "Full Services page content.",
    file: "servicesPage.json",
  },
  {
    key: "schedulePage",
    label: "Schedule Page",
    description: "Doctors, categories, and schedules.",
    file: "schedulePage.json",
  },
  {
    key: "staffPage",
    label: "Staff Page",
    description: "Staff members and staff page content.",
    file: "staffPage.json",
  },
  {
    key: "contactPage",
    label: "Contact Page",
    description: "Contact page details and form labels.",
    file: "contactPage.json",
  },
  {
    key: "footer",
    label: "Footer",
    description: "Footer contact details, links, and labels.",
    file: "footer.json",
  },
];

type PublicImage = {
  src: string;
  name: string;
  folder: string;
};

async function readJsonFile(fileName: string) {
  const filePath = path.join(process.cwd(), "app", "data", fileName);
  const file = await readFile(filePath, "utf-8");
  return JSON.parse(file);
}

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
      const childImages = await getImagesFromDirectory(fullPath, publicUrl);
      images.push(...childImages);
      continue;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();

      if (allowedExtensions.includes(extension)) {
        images.push({
          src: publicUrl.startsWith("/") ? publicUrl : `/${publicUrl}`,
          name: entry.name,
          folder: basePath || "/",
        });
      }
    }
  }

  return images;
}

export default async function AdminUiPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  const editablePages = await Promise.all(
    pages.map(async (page) => ({
      key: page.key,
      label: page.label,
      description: page.description,
      data: await readJsonFile(page.file),
    })),
  );

  const publicImages = await getImagesFromDirectory(publicPath);

  return (
    <AdminUiEditor
      title="Admin UI"
      subtitle="Compact control panel for editing website content."
      pages={editablePages}
      initialImages={publicImages.sort((a, b) => a.src.localeCompare(b.src))}
    />
  );
}
