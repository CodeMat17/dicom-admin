import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      <main>{children}</main>
      <Toaster />
    </section>
  );
}
