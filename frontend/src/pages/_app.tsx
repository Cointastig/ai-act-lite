import type { AppProps } from "next/app";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../../public/style.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Head>
        <title>AI-Act Lite</title>
      </Head>

      <header className="px-6 py-3 bg-brand-400 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="AI-Act Lite" width={140} height={32} priority />
        </Link>
        <AuthStatus />
      </header>

      <Component {...pageProps} />

      <footer className="footer">
        Mehr zum Gesetz&nbsp;
        <a
          href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A52021PC0206"
          target="_blank" rel="noopener noreferrer"
        >
          EU AI Act (Entwurfsfassung)
        </a>
      </footer>
    </SessionContextProvider>
  );
}

/* ---------- Kleiner Status-/Logout-Button ---------- */
import { useSessionContext } from "@supabase/auth-helpers-react";
function AuthStatus() {
  const { session, supabaseClient } = useSessionContext();

  if (!session) return <Link href="/login" className="text-white">Login</Link>;

  return (
    <button
      onClick={() => supabaseClient.auth.signOut()}
      className="text-white text-sm"
    >
      Logout&nbsp;({session.user.email})
    </button>
  );
}
