import Header from "@/src/components/layout/Header";
import AdminSidebar from "@/src/components/layout/navigation/AdminSidebar";
import ClientSidebar from "@/src/components/layout/navigation/ClientSidebar";
import Footer from "@/src/components/layout/Footer";

export default function DashboardLayout({ children }) {

  const user = {
    name: "Fongang",
    surname: "Bryan",
    email: "fongang.bryan@gmail.com",
    site: "Centre Collecte Yaoundé",
    city: "Yaoundé",
    phone: "655 143 266",
    role: "SUPER_ADMIN"
  };

  const getSidebar = () => {
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return <AdminSidebar role={user.role} />;
    } else {
      return <ClientSidebar />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <aside className="h-screen sticky top-0 overflow-y-auto border-r border-gray-200">
        {getSidebar()}
      </aside>

      <div className="flex flex-col flex-1">

        <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
          <Header user={user} />
        </header>

        <main className="p-8 flex-1 bg-gray-50">
          {children}
        </main>

        <Footer />

      </div>

    </div>
  );
}