import { useState } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function AskStatusSearch() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [status, setStatus] = useState("pending");
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelingAskId, setCancelingAskId] = useState<number | null>(null);

    const fetchBidsByStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}asks/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBids(data.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch asks by status", err);
            setBids([]);
        } finally {
            setLoading(false);
        }
    };

    const cancelAsk = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this ask?")) return;
        setCancelingAskId(id);
        try {
            const res = await fetch(`${baseUrl}cancel-ask/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success === true) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            fetchBidsByStatus(); // refresh
        } catch (err) {
            console.error("Failed to cancel ask:", err);
            toast.error("An error occurred while canceling ask.");
        } finally {
            setCancelingAskId(null);
        }
    };

    const statusColor = (s: string) => {
        return s === "pending" ? "text-yellow-400" :
            s === "completed" ? "text-green-500" :
                s === "paired" ? "text-blue-400" :
                    "text-red-500";
    };

    const renderCard = (item: any) => (
        <div key={item.id} className="relative">
            <Link to={`/asks/${item.id}`}>
                <div className="bg-gradient-to-br from-[#1a202c] to-[#111827] border border-[#2D3748] p-6 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                        {/*<span>Ask ID</span>*/}
                        {/*<span className="text-white font-medium">{item.id}</span>*/}
                    </div>

                    <div className="text-3xl font-bold text-white mb-2">{item.amount} <span className="text-base font-semibold">USDT</span></div>

                    <p className="text-xs text-gray-500 mb-4">{formatDistanceToNow(new Date(item.created_at))} ago</p>

                    <p className="text-sm text-gray-400 mb-1">TRX: <span className="text-white break-all">{item.trx}</span></p>

                    <p className="text-sm text-gray-400">
                        Status: <span className={`font-semibold ${statusColor(item.status)}`}>{item.status}</span>
                    </p>
                </div>
            </Link>

            {item.status === "pending" && (
                <button
                    onClick={() => cancelAsk(item.id)}
                    disabled={cancelingAskId === item.id}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition disabled:opacity-50 z-10"
                >
                    {cancelingAskId === item.id ? "Canceling..." : "Cancel Ask"}
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b1120] text-white flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-12 px-6 lg:px-16">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-extrabold text-center mb-12">🎯 Filter Asks by Status</h1>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-[#1F2937] border border-gray-700 text-white px-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="paired">Paired</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="reversed">Reversed</option>
                            </select>

                            <button
                                onClick={fetchBidsByStatus}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
                            >
                                🔍 Search
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-center text-gray-400">Fetching data...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {bids.length ? (
                                    bids.map((bid) => renderCard(bid))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 text-sm">
                                        No asks found for status: <span className="italic">{status}</span>.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
