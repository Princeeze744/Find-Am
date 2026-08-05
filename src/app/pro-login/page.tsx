import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackLink from "@/components/BackLink";
import ProLoginForm from "@/components/ProLoginForm";

export default function ProLoginPage() {
  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-24">
        <div className="pt-6"><BackLink /></div>
        <div className="pt-8">
          <ProLoginForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}