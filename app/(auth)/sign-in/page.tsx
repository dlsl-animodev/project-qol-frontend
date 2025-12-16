import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SearchParams = Record<string, string | string[] | undefined>;

function resolveParam(
  value: string | string[] | undefined
): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeRedirect(target: string | undefined): string | undefined {
  if (!target) return undefined;
  if (!target.startsWith("/")) return undefined;
  if (target.startsWith("//")) return undefined;
  return target;
}

type SignInPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedParams = await Promise.resolve(searchParams ?? {});
  const errorMessage = resolveParam(resolvedParams.error);
  const redirectParam = sanitizeRedirect(
    resolveParam(resolvedParams.redirectTo)
  );
  const code = resolveParam(resolvedParams.code);

  const supabase = await createSupabaseServerClient();

  // if redirected to /sign-in with a code, forward to the official callback route
  if (code) {
    const callback = new URL(
      "/auth/callback",
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    );
    callback.searchParams.set("code", code);
    if (redirectParam) {
      callback.searchParams.set("redirectTo", redirectParam);
    }
    redirect(callback.toString());
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(redirectParam ?? "/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Continue with your Google account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <Button asChild className="w-full">
              <Link
                href={`/auth/login${
                  redirectParam
                    ? `?redirectTo=${encodeURIComponent(redirectParam)}`
                    : ""
                }`}
              >
                Continue with Google
              </Link>
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Need access? Contact the admin team.
          </div>
          <div className="mt-2 text-sm text-muted-foreground text-center">
            <Link href="/">Back to landing page</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInPage;
