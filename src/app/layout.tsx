import type { Metadata } from "next";
import { Poppins, Inter, Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Broncstudio",
  description: "Stories, Style & Smiles — All in One Place",
  icons: {
    icon: '/BroncStudio (2).png',
    apple: '/BroncStudio (2).png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BroncStudio",
  },
};

import Header from "@/components/Header/Header";
import MobileNav from "@/components/Header/MobileNav";
import PremiumFooter from "@/components/Footer/PremiumFooter";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import { UIProvider } from "@/context/UIContext";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import SplashScreen from "@/components/Layout/SplashScreen";
import SearchOverlay from "@/components/Search/SearchOverlay";
import WishlistDrawer from "@/components/Wishlist/WishlistDrawer";
import QuickViewModal from "@/components/Product/QuickViewModal";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${baloo2.variable} ${nunito.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <UIProvider>
                <SplashScreen />
                <AnnouncementBar />
                <Header />
                <main className="pb-[calc(64px+env(safe-area-inset-bottom)+20px)] md:pb-0">
                  {children}
                </main>
                <FooterWrapper>
                  <PremiumFooter />
                </FooterWrapper>
                <MobileNav />
                <SearchOverlay />
                <WishlistDrawer />
                <QuickViewModal />
                {/* Global Overlays will be injected here later */}
              </UIProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
