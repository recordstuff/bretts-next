import "../globals.css";
import LeftDrawer from "@/components/LeftDrawer";
import { LeftDrawerProvider } from "@/components/LeftDrawerProvider";
import PrivateRoute from "@/components/PrivateRoute";

export default function AutenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <PrivateRoute>
            <LeftDrawerProvider>
                <LeftDrawer>
                    {children}
                </LeftDrawer>
            </LeftDrawerProvider>
        </PrivateRoute>
    )
}
