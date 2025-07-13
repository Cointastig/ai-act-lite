import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // wenn Magic-Link zurückkommt
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.replace("/wizard");
    });
  }, [router]);

  const sendLink = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/login` },
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="flex justify-center">
      <div className="container max-w-xl">
        <h1 className="mb-4 text-3xl font-bold">Login</h1>

        {sent ? (
          <p>Checke dein Postfach und klicke auf den Link 🚀</p>
        ) : (
          <>
            <label className="text-sm">E-Mail</label>
            <input
              type="email"
              className="mt-1 w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn w-full" onClick={sendLink}>
              Magic-Link schicken
            </button>

            {error && <p className="text-sm text-red-700 mt-4">{error}</p>}

            <hr className="my-6" />

            <button
              className="btn w-full bg-gray-700 hover:bg-gray-800"
              onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            >
              Mit Google einloggen
            </button>
          </>
        )}

        <p className="text-sm mt-6">
          <Link href="/" className="text-brand-400">← Zurück</Link>
        </p>
      </div>
    </main>
  );
}
