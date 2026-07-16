import { useState, useEffect } from "react" // React Hooks importieren
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
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { Link, useLocation } from "react-router" // useLocation hinzufügen

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { pathname } = useLocation() // Aktuellen Pfad auslesen

  return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
              <NavGroupItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  isMobile={isMobile}
                  setOpenMobile={setOpenMobile}
              />
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}

// Unterkomponente für jedes Haupt-Menü-Item
function NavGroupItem({
                        item,
                        pathname,
                        isMobile,
                        setOpenMobile,
                      }: {
  item: NavItem
  pathname: string
  isMobile: boolean
  setOpenMobile: (open: boolean) => void
}) {
  // Prüfen, ob der aktuelle Pfad der Hauptgruppe oder einem der Unterpunkte entspricht
  const hasActiveChild =
      item.items?.some((subItem) => pathname === subItem.url) || pathname === item.url

  // State zur Steuerung, ob dieses Accordion offen ist
  const [isOpen, setIsOpen] = useState(item.isActive || hasActiveChild)

  // Wenn der User über einen Link navigiert und ein Unterpunkt dieser Gruppe aktiv wird,
  // soll sich das Accordion automatisch öffnen
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true)
    }
  }, [pathname, hasActiveChild])

  return (
      <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen} // Ermöglicht manuelles Auf-/Zuklappen
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
            {item.items?.map((subItem) => {
              const isSubItemActive = pathname === subItem.url
              return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                        render={<Link to={subItem.url} />}
                        isActive={isSubItemActive} // Hebt den aktiven Link optisch hervor
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false) // Schließt die Sidebar auf Mobilgeräten
                          }
                        }}
                    >
                      <span>{subItem.title} </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
  )
}