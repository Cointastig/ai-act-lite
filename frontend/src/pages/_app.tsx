import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../styles/globals.css";          // lokale Tailwind-Direktiven (@tailwind …)

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Head-Block: Manifest + Tailwind-CDN-Fallback */}
      <Head>
        {/* Web-App-Manifest  (404 verschwindet) */}
        <link rel="manifest" href="/manifest.json" />

        {/* Tailwind 3.x  – CDN-Fallback für sofortige Styles */}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      {/* Brand-Header mit Logo */}
      <header className="bg-brand-400 px-6 py-3">
        <Link href="/" className="inline-block">
          {/* Wenn Next-Image Probleme macht, ggf. durch <img …> ersetzen */}
          <Image
            src="/logo.png"
            alt="AI-Act Lite"
            width={140}
            height={32}
            priority
          />
        </Link>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </>
  );
}
