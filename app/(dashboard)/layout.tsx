import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Securely fetch the session on the server
    const session = await getServerSession(authOptions);

    // 2. Double-check protection (Middleware handles this, but good fallback)
    if (!session?.user) {
        redirect("/login");
    }

    // 3. Render the shell with the user data
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <TopNav user={session.user} />

                {/* This is where the Pipeline or Analytics page actually renders */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}