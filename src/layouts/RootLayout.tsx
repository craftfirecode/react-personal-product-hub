import * as React from "react";
import {Link, Outlet, useLocation} from "react-router";
import {useAuth} from "@/features/auth/guards/AuthProvider.tsx";
import {Button} from "@/components/ui/button.tsx";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import LogoutButton from "@/features/auth/guards/LogoutButton.tsx";

interface NavLinkProps {
    to: string;
    pathname: string;
    children: React.ReactNode;
}

function NavLink({ to, pathname, children }: NavLinkProps) {
    const isActive = pathname === to; // Prüfen, ob der Link aktiv ist

    return (
        <NavigationMenuItem>
            <NavigationMenuLink
                render={<Link to={to} />}
                className={cn(
                    navigationMenuTriggerStyle(),
                    "transition-colors duration-200",
                    isActive
                        ? "bg-accent text-accent-foreground font-semibold" // Aktiver Zustand
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                {children}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}

// Hauptkomponente
export default function RootLayout() {
    const { session, loading } = useAuth();
    const location = useLocation();

    return (
        <>
            <header className="border-b bg-background sticky top-0 z-50">
                <nav className="container mx-auto py-4 flex justify-between items-center px-4 md:px-0">

                    <NavigationMenu>
                        <NavigationMenuList className="gap-1">
                            <NavLink to="/" pathname={location.pathname}>Home</NavLink>
                            {/*<NavLink to="/sandbox" pathname={location.pathname}>Sandbox</NavLink>*/}

                            {session && (
                                <NavLink to="/protected" pathname={location.pathname}>Protected</NavLink>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="w-20 h-8 animate-pulse bg-muted rounded" />
                        ) : session ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Hallo, <span className="text-foreground font-semibold">{session.user.email}</span>
                                </span>
                                <LogoutButton />
                            </div>
                        ) : (
                            <Button render={<Link to="/login" />} size="sm" nativeButton={false}>
                                Login
                            </Button>
                        )}
                    </div>
                </nav>
            </header>

            <main className="container mx-auto py-6 px-4 md:px-0">
                <Outlet />
            </main>
        </>
    );
}
