import { createBrowserRouter, Navigate } from "react-router";
import Sandbox from "./routes/Sandbox.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import Crypto from "./routes/Crypto.tsx"; // Wird für /app/crypto genutzt
import ProtectedRoute from "@/features/guards/ProtectedRoute.tsx";
import Login from "@/routes/Login.tsx";
import EcoFlow from "@/routes/EcoFlow.tsx";
import Dashboard from "@/routes/Dashboard.tsx";
import Home from "@/routes/Home.tsx";
import ErrorPage from "@/routes/ErrorPage.tsx";
import Todos from "@/routes/Todos.tsx";
import ImageManager from "@/routes/ImageManager.tsx";

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
                        path: "",
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: "crypto",
                        element: <Crypto/>,
                    },
                    {
                        path: "ecoflow",
                        element: <EcoFlow/>,
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "todos",
                        element: <Todos/>,
                    },
                    {
                        path: "img",
                        element: <ImageManager/>,
                    },
                ],
            },
        ],
    },
]);