import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronsLeft } from "lucide-react";

import Grainient from "@/components/common/Grainient";
import { FeatureCarousel } from "@/components/common/FeatureCarousel";
import { Button } from "@/components/ui/form/button";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createClient } from "@/lib/supabase/server";
// import agnosHealthImage from "@/assets/agnos-health.webp";

import AgnosLogo from "@/assets/agnos-logo.svg";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = redirectParam?.startsWith("/staff")
    ? redirectParam
    : "/staff";

  // Supabase env vars may not be configured yet (project not provisioned) —
  // createClient()/getUser() throws in that case. Treat as signed-out rather
  // than crashing the page; LoginForm itself surfaces a clear error on submit.
  // redirect() must stay OUTSIDE the try: it works by throwing internally,
  // which a catch-all here would otherwise swallow.
  let alreadySignedIn = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    alreadySignedIn = !!user;
  } catch {
    alreadySignedIn = false;
  }

  if (alreadySignedIn) {
    redirect(redirectTo);
  }

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden p-8 lg:flex">
        <Grainient
          className="absolute inset-0 blur-[0.2px] rounded-lg max-h-[100%]"
          color1="#c2c4c9"
          color2="#3e7eec"
          color3="#92afdd"
        />
        <FeatureCarousel className="absolute shrink-0" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            render={<Link href="/" />}
          >
            <ChevronsLeft data-icon="inline-start" />
            Back
          </Button>
          <Image src={AgnosLogo} alt="Agnos Health" className="h-8 w-auto" priority />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </div>
  );
}
