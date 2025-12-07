import { mode_toggle as ModeToggle } from "@/components/mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles } from "lucide-react";

export function Layout({ children }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="size-6 text-primary" />
            <span className="font-bold text-lg">ArixAI Resume Analyzer</span>
          </button>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button onClick={() => setLocation("/sign-in")} variant="outline" size="sm">
                Sign In
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 py-8">
        <div className="container max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ArixAI Resume Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
