// 👈 POINTER: Frontend router setup
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// 👈 POINTER: Clerk authentication key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Please check your .env file.");
}

function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#8B5CF6",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
          }
        }}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#8B5CF6",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
          }
        }}
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/results">
        <SignedIn>
          <Results />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#8B5CF6',
        },
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
          card: 'shadow-2xl',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background text-foreground border-border',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
        }
      }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
