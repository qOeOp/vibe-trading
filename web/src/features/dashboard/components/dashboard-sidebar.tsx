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
  LayoutGrid,
  ChartArea,
  Sparkles,
  LogOut,
  UserCircle,
  CreditCard,
} from "lucide-react";

const menuItems = [
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
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem data-testid="dashboard-sidebar-profile">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="dashboard-sidebar-billing">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="dashboard-sidebar-logout">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
