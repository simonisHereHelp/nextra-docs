"use client";

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LANDING_PATH = "/index";

export default function PageWrapper() {
  return (
    <SessionProvider>
      <MainPage />
    </SessionProvider>
  );
}

function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [driveInfo, setDriveInfo] = useState(null);
  const [error, setError] = useState("");

  // If already logged in, go to landing
  useEffect(() => {
    if (status === "authenticated") router.replace(LANDING_PATH);
  }, [status, router]);

  // While checking session
  if (status === "loading") return null;

  // Not logged in → show Google login
  if (!session) {
    return (
      <main style={{ textAlign: "center", marginTop: "20vh" }}>
        <h1>Sign in</h1>
        <p style={{ opacity: 0.7 }}>Use your Google account to continue.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: LANDING_PATH })}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          Continue with Google
        </button>
      </main>
    );
  }

  // Logged in → optional: quick Drive “about” proof
  async function fetchDriveInfo() {
    if (!session?.accessToken) {
      setError("No access token — please sign in again.");
      return;
    }
    setError("");
    try {
      const r = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=user,storageQuota,kind",
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setDriveInfo(await r.json());
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: 16 }}>
      <h1>Welcome, {session.user?.name || "User"}</h1>
      <p>{session.user?.email}</p>

      <button onClick={fetchDriveInfo} style={{ padding: "6px 12px", marginTop: 12 }}>
        Fetch Google Drive Info
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {driveInfo && (
        <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8, marginTop: 12 }}>
          {JSON.stringify(driveInfo, null, 2)}
        </pre>
      )}
    </main>
  );
}
