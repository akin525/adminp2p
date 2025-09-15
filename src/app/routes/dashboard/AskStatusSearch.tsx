import { useState, useCallback, useEffect } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
    MagnifyingGlassIcon,
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface Ask {
    id: number;
    amount: number;
    trx: string;
    status: string;
    created_at: string;
}

type StatusType = "pending" | "paired" | "completed" | "failed" | "cancelled" | "reversed";

const STATUS_CONFIG = {
    pending: {
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        icon: ClockIcon,
        label: "Pending"
    },
    paired: {
        color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        icon: CheckCircleIcon,
        label: "Paired"
    },
    completed: {
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        icon: CheckCircleIcon,
        label: "Completed"
    },
    failed: {
        color: "text-red-400 bg-red-400/10 border-red-400/20",
        icon: XCircleIcon,
        label: "Failed"
    },
    cancelled: {
        color: "text-gray-400 bg-gray-400/10 border-gray-400/20",
        icon: XMarkIcon,
        label: "Cancelled"
    },
    reversed: {
        color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
        icon: ExclamationTriangleIcon,
        label: "Reversed"
    }
} as const;

export default function AskStatusSearch() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [status, setStatus] = useState<StatusType>("pending");
    const [asks, setAsks] = useState<Ask[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelingAskId, setCancelingAskId] = useState<number | null>(null);
    const [searchInitiated, setSearchInitiated] = useState(false);

    const token = getAuthToken();

    const fetchAsksByStatus = useCallback(async () => {
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        setSearchInitiated(true);

        try {
            const res = await fetch(`${baseUrl}asks/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setAsks(data.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch asks by status", err);
            toast.error("Failed to fetch asks. Please try again.");
            setAsks([]);
        } finally {
            setLoading(false);
        }
    }, [status, token]);

    const cancelAsk = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this ask?")) return;

        setCancelingAskId(id);
        try {
            const res = await fetch(`${baseUrl}cancel-ask/${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || "Ask cancelled successfully");
                fetchAsksByStatus();
            } else {
                toast.error(data.message || "Failed to cancel ask");
            }
        } catch (err) {
            console.error("Failed to cancel ask:", err);
            toast.error("An error occurred while canceling ask.");
        } finally {
            setCancelingAskId(null);
        }
    };

    // Auto-fetch on component mount
    useEffect(() => {
        fetchAsksByStatus();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const config = STATUS_CONFIG[status as StatusType] || STATUS_CONFIG.failed;
        const Icon = config.icon;

        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </div>
        );
    };

    const AskCard = ({ ask }: { ask: Ask }) => (
        <div key={ask.id} className="group relative">
            <Link to={`/asks/${ask.id}`} className="block">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group-hover:scale-[1.02]">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm text-slate-400">
                            Ask #{ask.id}
                        </div>
                        <StatusBadge status={ask.status} />
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                        <div className="text-3xl font-bold text-white mb-1">
                            {ask.amount.toLocaleString()}
                            <span className="text-lg font-medium text-slate-300 ml-2">USDT</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatDistanceToNow(new Date(ask.created_at))} ago
                        </div>
                    </div>

                    {/* Transaction Hash */}
                    <div className="space-y-2">
                        <div className="text-xs text-slate-400">Transaction Hash</div>
                        <div className="text-sm text-slate-300 font-mono bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 truncate">
                            {ask.trx}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Cancel Button */}
            {ask.status === "pending" && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        cancelAsk(ask.id);
                    }}
                    disabled={cancelingAskId === ask.id}
                    className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100"
                >
                    {cancelingAskId === ask.id ? (
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            Canceling...
                        </div>
                    ) : (
                        "Cancel"
                    )}
                </button>
            )}
        </div>
    );

    const EmptyState = () => (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">No asks found</h3>
            <p className="text-slate-500 max-w-md">
                {searchInitiated
                    ? `No asks with "${STATUS_CONFIG[status].label}" status were found.`
                    : "Use the search above to find asks by status."
                }
            </p>
        </div>
    );

    const LoadingState = () => (
        <div className="col-span-full flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
                <span>Loading asks...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-8 px-4 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                                Ask Status Search
                            </h1>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Search and filter your asks by status to track their progress and manage your transactions.
                            </p>
                        </div>

                        {/* Search Controls */}
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <div className="flex-1 max-w-xs">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Filter by Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as StatusType)}
                                        className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key}>
                                                {config.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="h-6" /> {/* Spacer for alignment */}
                                    <button
                                        onClick={fetchAsksByStatus}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        {loading ? "Searching..." : "Search Asks"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loading ? (
                                <LoadingState />
                            ) : asks.length > 0 ? (
                                asks.map((ask) => <AskCard key={ask.id} ask={ask} />)
                            ) : (
                                <EmptyState />
                            )}
                        </div>

                        {/* Results Summary */}
                        {!loading && searchInitiated && (
                            <div className="mt-8 text-center">
                                <p className="text-slate-400 text-sm">
                                    {asks.length > 0
                                        ? `Found ${asks.length} ask${asks.length === 1 ? '' : 's'} with "${STATUS_CONFIG[status].label}" status`
                                        : `No asks found with "${STATUS_CONFIG[status].label}" status`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
