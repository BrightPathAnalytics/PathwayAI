import { Link } from "react-router-dom"
import { BarChart, BookOpen, Calendar, FileText, HelpCircle, Home, MessageSquare, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/theme-toggle"
import {
  Sidebar as SidebarComponent,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavItem,
  SidebarToggle,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Assistant",
    href: "/assistant",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart,
  },
  {
    title: "Sheets",
    href: "/sheets",
    icon: FileText,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <SidebarHeaderTitle>Pathway AI</SidebarHeaderTitle>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarBody>
        <SidebarNav>
          {navigationItems.map((item) => (
            <SidebarNavItem
              key={item.title}
              asChild
              active={location.pathname === item.href}
              icon={<item.icon className="h-4 w-4" />}
              label={item.title}
            >
              <Link to={item.href}>
                <span>{item.title}</span>
              </Link>
            </SidebarNavItem>
          ))}
        </SidebarNav>
      </SidebarBody>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">Jane Doe</span>
                  <span className="text-xs text-muted-foreground">Science Teacher</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between p-2">
                <span className="text-sm">Theme</span>
                <ModeToggle />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  )
} 