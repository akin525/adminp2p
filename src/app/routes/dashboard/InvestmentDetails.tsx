import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthToken } from "@/utils/auth.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function InvestmentDetails() {
    const { id } = useParams();
    const [investment, setInvestment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${baseUrl}investment-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch investment details");

                const result = await res.json();
                setInvestment(result?.data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const StatusBadge = ({ status }: { status: string }) => {
        let color = "bg-gray-600";
        if (status === "running") color = "bg-yellow-500";
        else if (status === "completed") color = "bg-green-500";
        else if (status === "failed") color = "bg-red-500";

        return (
            <span className={`px-3 py-1 text-sm rounded-full text-white ${color}`}>
                {status.toUpperCase()}
            </span>
        );
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
                <main className="p-6 max-w-6xl mx-auto w-full">
                    <h1 className="text-4xl font-bold text-center mb-10 tracking-tight">📊 Investment Overview</h1>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-400">Error: {error}</p>
                    ) : !investment ? (
                        <p className="text-center text-gray-400">No investment found.</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Investment Card */}
                            <div className="bg-[#1E293B] rounded-2xl p-6 shadow-lg border border-gray-700">
                                <h2 className="text-2xl font-semibold mb-4">💼 Investment Details</h2>
                                <div className="space-y-3 text-base">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Reference:</span>
                                        <span className="font-medium">{investment.reference}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount:</span>
                                        <span className="font-medium">{investment.amount} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Expected Profit:</span>
                                        <span className="font-medium">{investment.expected_profit} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Expected Return:</span>
                                        <span className="font-medium">{investment.expected_return} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Return Date:</span>
                                        <span className="font-medium">{new Date(investment.return_date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Created:</span>
                                        <span className="font-medium">{new Date(investment.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Status:</span>
                                        <StatusBadge status={investment.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Bid Card */}
                            {investment.bid && (
                                <div className="bg-[#1E293B] rounded-2xl p-6 shadow-lg border border-gray-700">
                                    <h2 className="text-2xl font-semibold mb-4">🧾 Bid Details</h2>
                                    <div className="space-y-3 text-base">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Transaction ID:</span>
                                            <span className="font-medium">{investment.bid.trx}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Bid Amount:</span>
                                            <span className="font-medium">{investment.bid.amount} USDT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Paired Amount:</span>
                                            <span className="font-medium">{investment.bid.paired_amount} USDT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Amount to Pair:</span>
                                            <span className="font-medium">{investment.bid.amount_to_pair} USDT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Created:</span>
                                            <span className="font-medium">{new Date(investment.bid.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Status:</span>
                                            <StatusBadge status={investment.bid.status} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
