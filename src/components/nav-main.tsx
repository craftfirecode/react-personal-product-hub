import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar, // 1. Hook importieren
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  // 2. Zustand für Mobile auslesen
  const { isMobile, setOpenMobile } = useSidebar()

  return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
              <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip={item.title} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                              render={<Link to={subItem.url} />}
                              // 3. onClick Handler hinzufügen
                              onClick={() => {
                                if (isMobile) {
                                  setOpenMobile(false)
                                }
                              }}
                          >
                            <span>{subItem.title} </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}