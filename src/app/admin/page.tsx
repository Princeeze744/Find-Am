import SiteHeader from "@/components/SiteHeader";
import AdminView from "@/components/AdminView";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5">
        <AdminView />
      </main>
    </div>
  );
}