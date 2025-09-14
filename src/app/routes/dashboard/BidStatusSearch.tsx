import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function BidStatusSearch() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [status, setStatus] = useState("pending");
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelingBidId, setCancelingBidId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        fetchBidsByStatus(currentPage, status);
    }, [currentPage]);

    const fetchBidsByStatus = async (page = 1, currentStatus = status) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}bids/${currentStatus}?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBids(data.data?.data || []);
            setLastPage(data.data?.last_page || 1);
            setCurrentPage(data.data?.current_page || 1);
        } catch (err) {
            console.error("Failed to fetch bids", err);
            setBids([]);
        } finally {
            setLoading(false);
        }
    };

    const cancelBid = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this bid?")) return;
        setCancelingBidId(id);
        try {
            const res = await fetch(`${baseUrl}cancel-bid/${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message || "Failed to cancel bid");
            }

            await fetchBidsByStatus(currentPage, status);
        } catch (err) {
            console.error("Error cancelling bid:", err);
            toast.error("Failed to cancel the bid.");
        } finally {
            setCancelingBidId(null);
        }
    };

    const renderCard = (item: any) => (
        <div key={item.id} className="bg-[#1F2937] border border-gray-700 p-5 rounded-2xl hover:shadow-lg hover:border-blue-500 transition-all duration-200 group relative">
            <Link to={`/bids/${item.id}`}>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">
                            ID: <span className="text-white">{item.id}</span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            item.status === "pending" ? "bg-yellow-500 text-black" :
                                item.status === "completed" ? "bg-green-600 text-white" :
                                    item.status === "cancelled" ? "bg-red-500 text-white" :
                                        "bg-gray-500 text-white"
                        }`}>
                            {item.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{item.amount} <span className="text-sm text-gray-300">USDT</span></p>
                    <p className="text-sm text-gray-400 mb-2">Created {formatDistanceToNow(new Date(item.created_at))} ago</p>
                    <p className="text-sm text-gray-400 truncate">TRX: <span className="text-white">{item.trx}</span></p>
                </div>
            </Link>

            {item.status === "pending" && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => cancelBid(item.id)}
                        disabled={cancelingBidId === item.id}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {cancelingBidId === item.id ? (
                            <>
                                <FaSpinner className="animate-spin" /> Canceling...
                            </>
                        ) : (
                            "Cancel Bid"
                        )}
                    </button>
                </div>
            )}
        </div>
    );

    const Pagination = () => (
        <div className="flex justify-center mt-6 space-x-4">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-gray-300 self-center">Page {currentPage} of {lastPage}</span>
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                disabled={currentPage === lastPage}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex relative">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col relative">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-12 px-4 sm:px-8 lg:px-16">
                    <div className="max-w-6xl mx-auto relative">
                        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">🎯 Filter Bids by Status</h1>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-[#1F2937] border border-gray-600 text-white px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="pending">Pending</option>
                                <option value="paired">Paired</option>
                                <option value="failed">Failed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                                onClick={() => fetchBidsByStatus(1, status)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow"
                            >
                                🔍 Search
                            </button>
                        </div>

                        <div className="relative">
                            {loading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                                    <FaSpinner className="text-white text-3xl animate-spin" />
                                </div>
                            )}
                            <div className={`${loading ? "blur-sm pointer-events-none" : ""}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {bids.length ? (
                                        bids.map(renderCard)
                                    ) : (
                                        <div className="col-span-full text-center text-gray-500">
                                            No bids found for the selected status.
                                        </div>
                                    )}
                                </div>
                                <Pagination />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
