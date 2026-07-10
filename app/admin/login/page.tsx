import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminLoginForm from "./admin-login-form";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
