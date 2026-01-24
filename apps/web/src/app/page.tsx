export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* 
        Accessibility: Every page must have exactly one <h1>. 
        The <main> element identifies the primary content of the document.
      */}
      <h1 className="text-4xl font-bold">Welcome to Vibe Trading</h1>
      <p className="mt-4 text-xl text-muted-foreground">Migration in progress...</p>
    </main>
  );
}
