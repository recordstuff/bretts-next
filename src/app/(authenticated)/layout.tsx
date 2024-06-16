import "../globals.css";
import LeftDrawer from "@/components/LeftDrawer";
import PrivateRoute from "@/components/PrivateRoute";

export default function AutenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <PrivateRoute>
            <LeftDrawer>
                {children}
            </LeftDrawer>
        </PrivateRoute>
    )
}
