import Link from "next/link";
import { ChevronsLeft } from "lucide-react";

import { Button } from "@/components/ui/form/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import Grainient from "@/components/common/Grainient";
import { CircleCheck } from "@/components/animate-ui/icons/circle-check";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

export default function PatientSubmittedPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center p-6">
      <Grainient
        className="!fixed inset-0 -z-10 blur-[0.2px]"
        color1="#c2c4c9"
        color2="#3e7eec"
        color3="#92afdd"
      />
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center px-6 pt-6 md:px-8 md:pt-8">
          <AnimateIcon animate loop loopDelay={1500}>
            <CircleCheck className="size-18 text-primary mx-auto mb-6" />
          </AnimateIcon>

          <CardTitle className="text-xl md:text-2xl">Thank you</CardTitle>
          <CardDescription className="text-base">
            Your information has been submitted. Please wait to be called by
            staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            render={<Link href="/" />}
          >
            <ChevronsLeft data-icon="inline-start" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
