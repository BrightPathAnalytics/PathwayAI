"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  useSidebar, 
  SidebarContext, 
  SIDEBAR_COOKIE_NAME, 
  SIDEBAR_COOKIE_MAX_AGE, 
  SIDEBAR_WIDTH_MOBILE, 
  SIDEBAR_WIDTH_ICON, 
  SIDEBAR_KEYBOARD_SHORTCUT 
} from "./use-sidebar"

const SIDEBAR_WIDTH = "16rem"

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(true)
  const [openMobile, setOpenMobile] = React.useState(false)
  const isMobile = useIsMobile()

  // Set the sidebar state based on the cookie value
  React.useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    if (cookie) {
      const value = cookie.split("=")[1]
      setOpen(value === "expanded")
    }
  }, [])

  // Update the cookie when the sidebar state changes
  React.useEffect(() => {
    if (isMobile) return
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${
      open ? "expanded" : "collapsed"
    }; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [open, isMobile])

  // Toggle the sidebar with keyboard shortcut
  React.useEffect(() => {
    if (isMobile) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobile])

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev)
    } else {
      setOpen((prev) => !prev)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      <div ref={ref} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar-background text-sidebar-foreground",
  {
    variants: {
      variant: {
        default: "",
        expanded: "w-[--sidebar-width]",
        collapsed: "w-[--sidebar-width-icon]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const { open, openMobile, isMobile } = useSidebar()
    const Comp = asChild ? Slot : "aside"

    if (isMobile) {
      return (
        <Sheet open={openMobile}>
          <SheetContent
            side="left"
            className="w-[--sidebar-width-mobile] p-0"
            style={
              {
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
          >
            <Comp
              ref={ref}
              className={cn(
                "h-full w-full border-none bg-transparent",
                className
              )}
              {...props}
            />
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          sidebarVariants({
            variant: variant ?? (open ? "expanded" : "collapsed"),
            className,
          })
        )}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4",
        state === "collapsed" && "justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarHeaderTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex-1 truncate text-sm font-semibold", className)}
      {...props}
    />
  )
})
SidebarHeaderTitle.displayName = "SidebarHeaderTitle"

const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto py-2", className)}
      {...props}
    />
  )
})
SidebarBody.displayName = "SidebarBody"

const SidebarSearch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("px-4 py-2", className)}
      {...props}
    />
  )
})
SidebarSearch.displayName = "SidebarSearch"

const SidebarSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn("h-8", className)}
      placeholder="Search..."
      {...props}
    />
  )
})
SidebarSearchInput.displayName = "SidebarSearchInput"

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 py-2", className)}
      {...props}
    />
  )
})
SidebarSection.displayName = "SidebarSection"

const SidebarSectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "mb-1 px-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarSectionTitle.displayName = "SidebarSectionTitle"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-t px-4 py-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", className)}
            onClick={toggleSidebar}
            {...props}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Toggle Sidebar
          <div className="ml-auto text-xs text-muted-foreground">
            ⌘ + B
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
SidebarToggle.displayName = "SidebarToggle"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-1", className)}
      {...props}
    />
  )
})
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    icon?: React.ReactNode
    label?: string
    badge?: React.ReactNode
    asChild?: boolean
  }
>(
  (
    { className, active, icon, label, badge, asChild = false, ...props },
    ref
  ) => {
    const { state } = useSidebar()
    const Comp = asChild ? Slot : "button"

    if (state === "collapsed") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Comp
                ref={ref}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                  className
                )}
                {...props}
              >
                {icon}
                <span className="sr-only">{label}</span>
              </Comp>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex h-8 items-center gap-2 rounded-md px-2 text-muted-foreground",
          active && "bg-sidebar-accent text-sidebar-accent-foreground",
          className
        )}
        {...props}
      >
        {icon}
        <span className="flex-1 truncate">{label}</span>
        {badge}
      </Comp>
    )
  }
)
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <span
      ref={ref}
      className={cn("flex-1 truncate", className)}
      {...props}
    />
  )
})
SidebarNavItemLabel.displayName = "SidebarNavItemLabel"

const SidebarNavItemBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-medium text-sidebar-primary-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarNavItemBadge.displayName = "SidebarNavItemBadge"

const SidebarDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      className={cn("my-2", className)}
      {...props}
    />
  )
})
SidebarDivider.displayName = "SidebarDivider"

const SidebarSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2",
        state === "collapsed" && "justify-center",
        className
      )}
      {...props}
    >
      <Skeleton className="h-8 w-8 rounded-md" />
      {state === "expanded" && (
        <Skeleton className="h-8 flex-1 rounded-md" />
      )}
    </div>
  )
})
SidebarSkeleton.displayName = "SidebarSkeleton"

export {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavItem,
  SidebarNavItemBadge,
  SidebarNavItemLabel,
  SidebarProvider,
  SidebarSearch,
  SidebarSearchInput,
  SidebarSection,
  SidebarSectionTitle,
  SidebarSkeleton,
  SidebarToggle,
} 