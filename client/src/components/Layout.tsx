import { Link } from "wouter";
import { FileText, Sparkles } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center px-4 md:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <span className="hidden font-display font-bold sm:inline-block text-lg">
              AI Resume Analyzer
            </span>
          </Link>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <a
              href="https://github.com/replit"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-8 max-w-screen-xl">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with <span className="font-semibold text-foreground">Replit</span>. Powered by Perplexity API.
          </p>
        </div>
      </footer>
    </div>
  );
}
