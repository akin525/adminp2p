import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuthToken } from "../utils/auth";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { useUser } from "@/context/UserContext.tsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { setAdmin } = useUser();
    const { setUser } = useUser();

    useEffect(() => {
        const verifyToken = async () => {
            const token = getAuthToken();

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${baseUrl}dashboard`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                console.log(data);

                if (response.ok) {
                    if (data.message === "Telegram Id Verification Required.") {
                        navigate("/verify-telegram");
                        return;
                    }

                    if (data.success === true) {
                        // Set user, recentBids, and recentAsks
                        setUser({
                            ...data.data.admin,
                        });
                        setAdmin({
                            ...data.data,
                        })
                        setIsValid(true);
                        return;
                    }
                }

                throw new Error(data.message || "Unauthorized");
            } catch (error: any) {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                toast.error(error.message || "Session expired. Please login again.");
                navigate("/login");
            }
        };

        verifyToken();
    }, [navigate]);

    if (isValid === null) {
        return (
            <div className="min-h-screen text-white flex bg-[#050B1E]">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader setSidebarOpen={setSidebarOpen} />

                    {/* Loader */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"></div>
                    </div>
                </div>
            </div>
        );
    }
    return <>{children}</>;
}
