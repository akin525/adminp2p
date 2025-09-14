import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import {Link} from "react-router";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function BidAskHistory() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bids, setBids] = useState<any[]>([]);
    const [asks, setAsks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bids"); // Track active tab

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bidsRes, asksRes] = await Promise.all([
                    fetch(`${baseUrl}bids`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${baseUrl}asks`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const bidsData = await bidsRes.json();
                const asksData = await asksRes.json();

                setBids(bidsData.data?.data || []);
                setAsks(asksData.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderCard = (item: any, type: "bid" | "ask") => (
        <Link to={type === "bid" ? `/bids/${item.id}` : `/asks/${item.id}`} key={item.id}>
            <div className="p-6 rounded-2xl bg-[#1A202C] border border-[#2D3748] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <p className="text-sm text-gray-400">
                    {type === "bid" ? "Bid" : "Ask"} ID: <span className="text-white">{item.id}</span>
                </p>
                <p className="text-white font-semibold text-2xl mt-2">{item.amount} USDT</p>
                <p className="text-gray-400 text-xs mt-2">{formatDistanceToNow(new Date(item.created_at))} ago</p>
                <p className="text-gray-400 text-sm mt-2">TRX: <span className="text-white">{item.trx}</span></p>
                <p className="text-gray-400 text-sm mt-2">Status: <span className={`text-sm font-medium ${item.status === "pending" ? "text-yellow-400" :
                    item.status === "completed" ? "text-green-500" : "text-red-500"}`}>{item.status}</span></p>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#050B1E] text-white flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-10 px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-center">Bid & Ask History</h1>

                        {loading ? (
                            <p className="text-gray-400 text-center">Loading history...</p>
                        ) : (
                            <div className="space-y-6">
                                {/* Manually toggle between tabs */}
                                <div className="flex space-x-4 bg-[#070D20] p-2 rounded-lg border border-gray-700">
                                    <button onClick={() => setActiveTab("bids")} className={`flex-1 text-center text-lg font-semibold transition-all duration-300 p-2 rounded-md ${activeTab === "bids" ? "bg-[#0A1128] text-white" : "bg-transparent text-gray-400 hover:bg-[#1A202C]"}`}>
                                        Bids
                                    </button>
                                    <button onClick={() => setActiveTab("asks")} className={`flex-1 text-center text-lg font-semibold transition-all duration-300 p-2 rounded-md ${activeTab === "asks" ? "bg-[#0A1128] text-white" : "bg-transparent text-gray-400 hover:bg-[#1A202C]"}`}>
                                        Asks
                                    </button>
                                </div>

                                {/* Display content based on the active tab */}
                                {activeTab === "bids" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                        {bids.length ? bids.map((bid) => renderCard(bid, "bid")) : (
                                            <p className="text-gray-400 text-center">No bids yet.</p>
                                        )}
                                    </div>
                                )}
                                {activeTab === "asks" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                        {asks.length ? asks.map((ask) => renderCard(ask, "ask")) : (
                                            <p className="text-gray-400 text-center">No asks yet.</p>
                                        )}
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
