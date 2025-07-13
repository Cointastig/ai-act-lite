import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../styles/globals.css";           // lokale Tailwind-Direktiven

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Head-Block: Manifest UND Tailwind-CDN */}
      <Head>
        {/* PWA-Manifest (404 verschwindet) */}
        <link rel="manifest" href="/manifest.json" />

        {/* temporäres CDN-Tailwind für sofortige Styles */}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      {/* Brand-Header mit Logo */}
      <header className="bg-brand-400 px-6 py-3">
        <Link href="/" className="inline-block">
          {/* Wenn Next-Image zickt → durch <img src="/logo.png" …> ersetzen */}
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
