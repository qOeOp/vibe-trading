import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/dashboard/sidebar";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dashboard/dropdown-menu";
import {
  Search,
  Command,
  MoreVertical,
  Github,
} from "lucide-react";

export function DashboardHeader() {
  return (
    <header
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b bg-card sticky top-0 z-10 w-full"
      data-testid="dashboard-header"
    >
      <SidebarTrigger className="-ml-1 sm:-ml-2" data-testid="dashboard-header-sidebar-trigger" />
      <h1 className="text-base sm:text-lg font-medium flex-1 truncate">Dashboard</h1>

      <div className="hidden md:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          placeholder="Search Anything..."
          className="pl-10 pr-14 w-[180px] lg:w-[220px] h-9 bg-card border"
          data-testid="dashboard-header-search"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-muted px-1 py-0.5 rounded text-xs text-muted-foreground">
          <Command className="size-3" />
          <span>K</span>
        </div>
      </div>

      <ThemeToggle />

      <Button variant="ghost" size="icon" asChild>
        <a
          href="https://github.com/qOeOp/vibe-trading"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="dashboard-header-github-link"
        >
          <Github className="size-5" />
          <span className="sr-only">GitHub Repository</span>
        </a>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-8 w-8"
            data-testid="dashboard-header-menu"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem data-testid="dashboard-header-menu-search">
            <Search className="size-4 mr-2" />
            Search
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
