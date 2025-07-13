import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import Image from "next/image";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="bg-brand-400 px-6 py-3">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="AI-Act Lite" width={140} height={32} />
        </Link>
      </header>

      <Component {...pageProps} />
    </>
  );
}
