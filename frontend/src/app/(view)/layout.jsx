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
    //role: "SUPER_ADMIN"
    role: "UTILISATEUR"
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

      {/* SIDEBAR */}
      <div className="flex-shrink-0">
        {getSidebar()}
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-col flex-1 h-full">

        {/* HEADER */}
        <div className="flex-shrink-0">
          <Header user={user} />
        </div>

        {/* CONTENU SCROLLABLE */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>

        {/* FOOTER */}
        <div className="flex-shrink-0">
          <Footer />
        </div>

      </div>

    </div>
  );
}