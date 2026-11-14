import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartBadge, CartFallback } from "@/components/CartBadge";
import { Cursor } from "@/components/Cursor";
import { DesktopNav, DesktopNavFallback, MobileMenu, MobileMenuFallback } from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: { default: "vitrin", template: "%s · vitrin" },
  description: "Sektör-bağımsız React storefront — tek kod tabanı, config ile değişen dikey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
            <Link href="/" className="text-xl font-semibold">
              vitrin<span className="text-accent">.</span>
            </Link>
            <Suspense fallback={<DesktopNavFallback />}>
              <DesktopNav />
            </Suspense>
            <div className="ml-auto flex items-center gap-2">
              <Suspense fallback={<CartFallback />}>
                <CartBadge />
              </Suspense>
              <Suspense fallback={<MobileMenuFallback />}>
                <MobileMenu />
              </Suspense>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</div>

        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl justify-center px-5 py-8">
            <a
              href="https://github.com/h-kod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              github.com/h-kod
            </a>
          </div>
        </footer>
        <Cursor />
      </body>
    </html>
  );
}
