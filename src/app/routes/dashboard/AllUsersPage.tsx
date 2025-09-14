import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuthToken } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    created_at: string;
}

interface ApiResponse {
    data: {
        data: User[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        last_page: number;
    };
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function AllUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        last_page: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        setError(null);  // Reset the error before making a new request
        try {
            const res = await fetch(`${baseUrl}users?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to fetch users");
            const result: ApiResponse = await res.json();

            setUsers(result.data.data);  // Corrected this part to match the API response
            setPagination({
                current_page: result.data.current_page,
                next_page_url: result.data.next_page_url,
                prev_page_url: result.data.prev_page_url,
                last_page: result.data.last_page,
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleNext = () => {
        if (pagination?.next_page_url) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (pagination?.prev_page_url && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">All Users</h1>

                    {loading ? (
                        <div className="text-center mt-10">
                            <p className="text-gray-300">Loading users...</p>
                            <div className="mt-4 animate-spin w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-gray-800 hover:bg-gray-700 transition p-4 rounded-xl shadow-lg cursor-pointer"
                                        onClick={() => navigate(`/user-details/${user.id}`)}
                                    >
                                        <p className="text-lg font-semibold">
                                            {user.firstname} {user.lastname}
                                        </p>
                                        <p className="text-sm text-gray-400">{user.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Joined: {new Date(user.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-center mt-10 space-x-4">
                                <button
                                    onClick={handlePrevious}
                                    disabled={!pagination?.prev_page_url}
                                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm">
                                    Page {pagination?.current_page} of {pagination?.last_page}
                                </span>
                                <button
                                    onClick={handleNext}
                                    disabled={!pagination?.next_page_url}
                                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
