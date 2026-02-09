import type { Metadata } from "next";
import { Poppins, Inter, Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
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
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import { ThemeProvider } from "@/context/ThemeProvider";

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
  metadataBase: new URL('https://broncstudio.com'),
  title: {
    default: "BroncStudio | Premium Apparel, Tech & Home Essentials",
    template: "%s | BroncStudio"
  },
  description: "Shop premium apparel for men, women, and kids, plus unique tech accessories, home decor, and gifts. Designed for style, crafted for comfort.",
  keywords: [
    "premium clothing", "streetwear", "tech accessories", "home decor",
    "gifts", "mens fashion", "womens fashion", "kids clothing",
    "BroncStudio", "t-shirts", "hoodies", "lifestyle"
  ],
  authors: [{ name: "BroncStudio Team" }],
  creator: "BroncStudio",
  publisher: "BroncStudio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://broncstudio.com",
    title: "BroncStudio | Premium Apparel, Tech & Home Essentials",
    description: "Explore our wide range of premium products including apparel, tech accessories, and home decor. Designed for style, crafted for you.",
    siteName: "BroncStudio",
    images: [
      {
        url: "/og-image.jpg", // Ensure there is a default OG image
        width: 1200,
        height: 630,
        alt: "BroncStudio - Premium Lifestyle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BroncStudio | Premium Apparel, Tech & Home Essentials",
    description: "Shop premium apparel for men, women, and kids, plus unique tech accessories, home decor, and gifts.",
    images: ["/og-image.jpg"],
    creator: "@broncstudio", // Replace if social handle exists
  },
  icons: {
    icon: '/blacklogo.png',
    apple: '/blacklogo.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BroncStudio",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BroncStudio",
  "url": "https://broncstudio.com",
  "logo": "https://broncstudio.com/blacklogo.png",
  "sameAs": [
    "https://facebook.com/broncstudio",
    "https://instagram.com/broncstudio",
    "https://twitter.com/broncstudio"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-1234567890", // Replace with actual
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${inter.variable} ${baloo2.variable} ${nunito.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreSettingsProvider>
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
          </StoreSettingsProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
