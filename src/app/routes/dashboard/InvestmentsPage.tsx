import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { useNavigate } from "react-router";

interface Investment {
    id: number;
    amount: number;
    expected_profit: number;
    expected_return: number;
    return_date: string;
    reference: string;
    status: string;
    created_at: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [statusFilter, setStatusFilter] = useState("running");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

// Corrected fetchInvestments function with both parameters
    const fetchInvestments = async (page = 1, status = "running") => {
        setLoading(true);
        try {
            const statusParam = status !== "all" ? `/${status}` : "";
            const res = await fetch(`${baseUrl}investments${statusParam}?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to fetch investments");

            const result = await res.json();
            setInvestments(result?.data?.data || []);
            setLastPage(result.data?.last_page || 1);
            setCurrentPage(result.data?.current_page || 1);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

// Re-fetch when page changes
    useEffect(() => {
        fetchInvestments(currentPage, statusFilter);
    }, [currentPage]);

// Re-fetch when filter changes
    useEffect(() => {
        // Reset to page 1 when status filter changes
        setCurrentPage(1);
        fetchInvestments(1, statusFilter);
    }, [statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-500";
            case "running":
                return "text-yellow-400";
            default:
                return "text-red-500";
        }
    };

    const Pagination = () => (
        <div className="flex justify-center mt-6 space-x-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-gray-300 self-center">Page {currentPage} of {lastPage}</span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                disabled={currentPage === lastPage}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0A0F1E] to-[#1E293B] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">My Investments</h1>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none"
                        >
                            <option value="all">All</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-400">Error: {error}</p>
                    ) : investments.length === 0 ? (
                        <p className="text-center text-gray-500">No investments found.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {investments.map((inv) => (
                                <div
                                    key={inv.id}
                                    onClick={() => navigate(`/investments/${inv.id}`)}
                                    className="cursor-pointer bg-[#1F2937] border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition"
                                >
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Reference:</p>
                                        <p className="font-semibold">{inv.reference}</p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Created:</p>
                                        <p>{new Date(inv.created_at).toLocaleString()}</p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Return Date:</p>
                                        <p>{new Date(inv.return_date).toLocaleString()}</p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Invested Amount:</p>
                                        <p className="text-blue-400 font-bold">
                                            {Number(inv.amount).toLocaleString()} USDT
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Expected Profit:</p>
                                        <p className="text-green-400 font-bold">
                                            +{Number(inv.expected_profit).toLocaleString()} USDT
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-400">Expected Return:</p>
                                        <p className="text-purple-400 font-bold">
                                            {Number(inv.expected_return).toLocaleString()} USDT
                                        </p>
                                    </div>

                                    <div className="mt-2">
                                        <p
                                            className={`text-sm font-semibold ${getStatusColor(
                                                inv.status
                                            )}`}
                                        >
                                            Status: {inv.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination />

                </main>
            </div>
        </div>
    );
}
