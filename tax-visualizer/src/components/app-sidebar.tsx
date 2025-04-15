import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import {Bot, BrainIcon, Lightbulb, LightbulbOff, SquareStackIcon} from "lucide-react";
import {useTheme} from "../provider/theme-provider";
import {Label} from "./ui/label";
import {Switch} from "./ui/switch";

const data = {
  user: {
    name: "Miguel Zavala",
    email: "miguel@mikkezavala.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Prediction",
      url: "#prediction",
      icon: Bot,
    },
    {
      title: "Embeddings",
      url: "#embeddings",
      icon: BrainIcon,
    },
    {
      title: "Cluster View",
      url: "#cluster",
      icon: SquareStackIcon,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {theme, setTheme} = useTheme()
  const switchTheme = (e: boolean) => {
    setTheme(e ? "light" : "dark")
  }

  const isDarkMode = theme === "dark"
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              🧠 Tax Visualizer
            </div>
            <Label className="flex items-center gap-2 text-sm">
              {isDarkMode ? <LightbulbOff size={16}/> : <Lightbulb size={16}/>}
              <Switch checked={!isDarkMode} onCheckedChange={switchTheme} className="shadow-none" />
            </Label>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
