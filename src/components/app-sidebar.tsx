import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {TerminalSquareIcon, BookOpenIcon, BatteryLowIcon} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
  ],
  navMain: [
    {
      title: "Smart Home",
      url: "#",
      icon: (
        <BatteryLowIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "Eco Flow",
          url: "/app/ecoflow",
        },
      ],
    },
    {
      title: "Finanzen",
      url: "#",
      icon: (
          <BookOpenIcon
          />
      ),
      items: [
        {
          title: "Crypto",
          url: "/app/crypto",
        },
      ],
    },
    {
      title: "Supabase POC",
      url: "#",
      icon: (
          <TerminalSquareIcon
          />
      ),
      items: [
        {
          title: "Todos",
          url: "/app/todos",
        },
        {
          title: "Images",
          url: "/app/img",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
