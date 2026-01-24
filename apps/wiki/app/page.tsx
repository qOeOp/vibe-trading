import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Vibe Trading Wiki</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Comprehensive documentation for algorithmic trading, market data analysis, and AI-powered insights.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/docs" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          aria-label="Read Documentation"
        >
          Explore Docs
        </Link>
        <Link 
          href="https://github.com/vibe-trading" 
          target="_blank"
          className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          aria-label="View on GitHub"
        >
          GitHub
        </Link>
      </div>
    </main>
  );
}