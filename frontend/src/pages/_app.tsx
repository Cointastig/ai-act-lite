import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* PWA-Manifest, falls benötigt */}
        <link rel="manifest" href="/manifest.json" />
        {/* ► einziges Stylesheet: fest eingecheckte style.css */}
        <link rel="stylesheet" href="/style.css" />
        <title>AI-Act Lite</title>
      </Head>

      {/* einfacher Brand-Header */}
      <header className="px-6 py-3">
        <Link href="/" className="inline-block">
          {/* falls Next/Image zickt, durch <img> ersetzen */}
          <Image src="/logo.png" alt="AI-Act Lite" width={140} height={32} priority />
        </Link>
      </header>

      <Component {...pageProps} />
    </>
  );
}
