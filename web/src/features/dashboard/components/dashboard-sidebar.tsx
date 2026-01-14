import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/dashboard/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/dashboard/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dashboard/dropdown-menu";
import {
  Bot,
  LayoutGrid,
  ChartArea,
  Sparkles,
  HelpCircle,
  Settings,
  ChevronsUpDown,
} from "lucide-react";

const menuItems = [
  {
    title: "AI Assistant",
    icon: Bot,
    href: "/app/dashboard/ai-assistant",
    testId: "dashboard-sidebar-nav-ai-assistant",
  },
  {
    title: "Overview",
    icon: LayoutGrid,
    href: "/app/dashboard/overview",
    testId: "dashboard-sidebar-nav-overview",
  },
  {
    title: "Deals",
    icon: ChartArea,
    href: "/app/dashboard/deals",
    testId: "dashboard-sidebar-nav-deals",
  },
  {
    title: "Analytics",
    icon: Sparkles,
    href: "/app/dashboard/analytics",
    testId: "dashboard-sidebar-nav-analytics",
    disabled: true,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar className="border-r" data-testid="dashboard-sidebar">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-primary-foreground font-semibold text-sm">VT</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Vibe Trading</span>
            <span className="text-muted-foreground text-xs">Pro Plan</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={false}
                    disabled={item.disabled}
                    data-testid={item.testId}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        isActive ? "bg-accent" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.disabled && (
                        <span className="ml-auto text-muted-foreground text-xs">
                          Soon
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="dashboard-sidebar-help">
              <a href="#">
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="dashboard-sidebar-settings">
              <a href="#">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                  data-testid="dashboard-sidebar-user-menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>VX</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start text-left text-sm">
                    <span className="font-medium">Vincent Xu</span>
                    <span className="text-muted-foreground text-xs">vincent@vibe.trading</span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
