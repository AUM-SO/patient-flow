"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ActivityIcon } from "lucide-react";

import AgnosLogo from "@/assets/agnos-logo.svg";
import AgnosNavLogo from "@/assets/agnos-nav-logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/layout/sidebar";
import { StaffNavUser } from "@/features/staff/components/StaffNavUser";

const navMain = [{ title: "Sessions", url: "/staff", icon: ActivityIcon }];

export function StaffSidebar({
  userEmail,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userEmail: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/staff" />}>
              <Image src={AgnosLogo} alt="Agnos Health" className="h-8 w-auto group-data-[collapsible=icon]:hidden" priority />
              <Image
                src={AgnosNavLogo}
                alt="Agnos Health"
                className="hidden size-8 group-data-[collapsible=icon]:block"
                priority
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{ children: item.title }}
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <StaffNavUser userEmail={userEmail} />
      </SidebarFooter>
    </Sidebar>
  );
}
