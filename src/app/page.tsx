"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QrCodeIcon } from "lucide-react";

import { Button } from "@/components/ui/form/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card";
import Grainient from "@/components/common/Grainient";
import { SessionLinkDialog } from "@/components/common/SessionLinkDialog";
import AgnosLogo from "@/assets/agnos-logo.svg";

export default function Home() {
  const router = useRouter();
  const [handoffSessionId, setHandoffSessionId] = useState<string | null>(null);

  function startPatientSession() {
    router.push(`/patient/${crypto.randomUUID()}`);
  }

  return (
    <div className="relative flex flex-1 items-center justify-center p-6">
      <Grainient
          className="absolute inset-0 blur-[0.2px] max-h-[80vh] rounded-md"
          color1="#c2c4c9"
          color2="#3e7eec"
          color3="#92afdd"
        />
      <Card className="absolute w-full max-w-md">
        <CardHeader className="px-6 pt-6 md:px-8 md:pt-8">
          <Image src={AgnosLogo} alt="Agnos Health" className="mb-3 h-14 w-auto" priority />
          {/* <CardTitle className="text-xl md:text-2xl">Agnos Health</CardTitle> */}
          <CardDescription className="text-base">
            Patient registration &amp; staff monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-6 pb-6 mt-4 md:px-8 md:pb-8">
          <Button onClick={startPatientSession} size="lg" className="w-full">
            Start Patient Registration
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => router.push("/staff/login")}
          >
            Staff Login
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setHandoffSessionId(crypto.randomUUID())}
          >
            <QrCodeIcon data-icon="inline-start" />
            Open on Another Device
          </Button>
          
        </CardContent>
      </Card>

      <SessionLinkDialog
        sessionId={handoffSessionId}
        open={handoffSessionId !== null}
        onOpenChange={(open) => !open && setHandoffSessionId(null)}
      />
    </div>
  );
}
