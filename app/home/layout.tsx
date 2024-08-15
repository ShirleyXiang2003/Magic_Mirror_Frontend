import Header from "../components/HomePageComponents/Header";
import Navigation from "../components/HomePageComponents/Navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto">
      <header className="flex flex-col items-start mb-8 gap-4 mt-20">
        <Header />
        <Navigation />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
