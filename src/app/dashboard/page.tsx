import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role?.toLowerCase().replace("_", "-") || "volunteer";
  redirect(`/dashboard/${role}`);
}
