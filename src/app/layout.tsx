import { LocaleProvider } from "@/context/LocaleContext";
import { CartProvider } from "@/context/CartContext";
import FloatingWrapper from "@/components/FloatingWrapper";
import PageTransitionBar from "@/components/PageTransitionBar";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        <LocaleProvider>
          <CartProvider>
            <PageTransitionBar />
            <HeaderWrapper />
            <main className="min-h-[calc(100vh-200px)]">{children}</main>
            <Footer />
            <Toaster position="bottom-center" richColors closeButton />
            <FloatingWrapper />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
