"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import { LoaderIcon } from "@/components/animate-ui/icons/loader"

function ToastIconChip({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        className
      )}
    >
      {children}
    </span>
  )
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      icons={{
        success: (
          <ToastIconChip className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CircleCheckIcon className="size-4" />
          </ToastIconChip>
        ),
        info: (
          <ToastIconChip className="bg-primary/15 text-primary">
            <InfoIcon className="size-4" />
          </ToastIconChip>
        ),
        warning: (
          <ToastIconChip className="bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <TriangleAlertIcon className="size-4" />
          </ToastIconChip>
        ),
        error: (
          <ToastIconChip className="bg-destructive/15 text-destructive">
            <OctagonXIcon className="size-4" />
          </ToastIconChip>
        ),
        loading: (
          <ToastIconChip className="bg-muted text-muted-foreground">
            <AnimateIcon animate loop>
              <LoaderIcon className="size-4" />
            </AnimateIcon>
          </ToastIconChip>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
