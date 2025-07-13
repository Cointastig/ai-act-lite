import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI-Act Lite – Beta</title>
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-4 text-3xl font-bold">
            AI-Act paperwork solved in&nbsp;30 minutes
          </h1>
          <p className="mb-6 text-gray-700">
            Generate EU-compliant risk report &amp; technical docs for your
            GPT-powered feature — before the fines hit.
          </p>

          {/* Hero-Button → Wizard */}
          <a
            href="/wizard"
            className="rounded bg-brand-400 px-4 py-2 font-medium text-white hover:bg-brand-500"
          >
            Start free
          </a>
        </div>
      </main>
    </>
  );
}
