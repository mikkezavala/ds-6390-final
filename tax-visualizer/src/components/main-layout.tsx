import {useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ThemeProvider} from "@/provider/theme-provider";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const MainLayout = () => {
    const {pathname} = useLocation();
    const [crumb, setCrumb] = useState<string>("Dashboard");

    useEffect(() => {
        if (pathname === '/prediction') {
            setCrumb("Prediction");
        } else if (pathname === '/embeddings') {
            setCrumb("Embeddings Viewer");
        } else if (pathname === '/cluster') {
            setCrumb("Cluster Viewer");
        }
    }, [pathname]);


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Tax Anomaly Detector
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block"/>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
