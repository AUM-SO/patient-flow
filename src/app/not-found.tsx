import Link from "next/link";

import { buttonVariants } from "@/components/ui/form/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-secondary/40 p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="px-6 pt-6 md:px-8 md:pt-8">
          <CardTitle className="text-xl md:text-2xl">Page not found</CardTitle>
          <CardDescription className="text-base">
            This link is invalid or has expired. Please start a new session.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
          >
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
