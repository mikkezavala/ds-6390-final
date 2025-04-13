import {Outlet} from "react-router-dom";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/provider/theme-provider";

export const MainLayout = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <Outlet/>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
