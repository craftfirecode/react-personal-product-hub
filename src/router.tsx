import { createBrowserRouter, Navigate } from "react-router";
import Sandbox from "./routes/Sandbox.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import Crypto from "./routes/Crypto.tsx"; // Wird für /app/crypto genutzt
import ProtectedRoute from "@/features/auth/guards/ProtectedRoute.tsx";
import Login from "@/routes/Login.tsx";
import EcoFlow from "@/routes/EcoFlow.tsx";
import Dashboard from "@/routes/Dashboard.tsx";
import Home from "@/routes/Home.tsx";
import ErrorPage from "@/routes/ErrorPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home/>,
            },
            {
                path: "sandbox",
                element: <Sandbox/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
        ],
    },
    {
        path: "app",
        element: <ProtectedRoute/>,
        children: [
            {
                element: <ProtectedLayout/>,
                children: [
                    {
                        // Falls jemand nur "/app" aufruft, wird er direkt zum Dashboard weitergeleitet
                        path: "",
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: "crypto", // <--- Erreichbar unter "/app/crypto"
                        element: <Crypto/>,
                    },
                    {
                        path: "ecoflow", // <--- Erreichbar unter "/app/ecoflow"
                        element: <EcoFlow/>,
                    },
                    {
                        path: "dashboard", // <--- Erreichbar unter "/app/dashboard"
                        element: <Dashboard />,
                    },
                ],
            },
        ],
    },
]);