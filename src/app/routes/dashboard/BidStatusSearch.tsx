import { useEffect, useState, useCallback } from "react";
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
    XCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    LinkIcon
} from "@heroicons/react/24/outline";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface Bid {
    id: number;
    amount: number;
    trx: string;
    status: string;
    created_at: string;
}

interface PaginationData {
    data: Bid[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

type StatusType = "pending" | "paired" | "completed" | "failed" | "cancelled";

const STATUS_CONFIG = {
    pending: {
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        icon: ClockIcon,
        label: "Pending"
    },
    paired: {
        color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        icon: LinkIcon,
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
    }
} as const;

export default function BidStatusSearch() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [status, setStatus] = useState<StatusType>("pending");
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelingBidId, setCancelingBidId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalBids, setTotalBids] = useState(0);
    const [perPage, setPerPage] = useState(15);
    const [searchInitiated, setSearchInitiated] = useState(false);

    const token = getAuthToken();

    const fetchBidsByStatus = useCallback(async (page = 1, currentStatus = status) => {
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        setSearchInitiated(true);

        try {
            const res = await fetch(`${baseUrl}bids/${currentStatus}?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const paginationData: PaginationData = data.data;

            setBids(paginationData?.data || []);
            setLastPage(paginationData?.last_page || 1);
            setCurrentPage(paginationData?.current_page || 1);
            setTotalBids(paginationData?.total || 0);
            setPerPage(paginationData?.per_page || 15);
        } catch (err) {
            console.error("Failed to fetch bids", err);
            toast.error("Failed to fetch bids. Please try again.");
            setBids([]);
        } finally {
            setLoading(false);
        }
    }, [status, token]);

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
                toast.success(data.message || "Bid cancelled successfully");
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

    const handleSearch = () => {
        setCurrentPage(1);
        fetchBidsByStatus(1, status);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Auto-fetch on component mount
    useEffect(() => {
        fetchBidsByStatus(1, status);
    }, []);

    // Fetch when page changes
    useEffect(() => {
        if (searchInitiated) {
            fetchBidsByStatus(currentPage, status);
        }
    }, [currentPage]);

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

    const BidCard = ({ bid }: { bid: Bid }) => (
        <div key={bid.id} className="group relative">
            <Link to={`/bids/${bid.id}`} className="block">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group-hover:scale-[1.02]">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm text-slate-400">
                            Bid #{bid.id}
                        </div>
                        <StatusBadge status={bid.status} />
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                        <div className="text-3xl font-bold text-white mb-1">
                            {bid.amount.toLocaleString()}
                            <span className="text-lg font-medium text-slate-300 ml-2">USDT</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatDistanceToNow(new Date(bid.created_at))} ago
                        </div>
                    </div>

                    {/* Transaction Hash */}
                    <div className="space-y-2">
                        <div className="text-xs text-slate-400">Transaction Hash</div>
                        <div className="text-sm text-slate-300 font-mono bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 truncate">
                            {bid.trx}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Cancel Button */}
            {bid.status === "pending" && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        cancelBid(bid.id);
                    }}
                    disabled={cancelingBidId === bid.id}
                    className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100"
                >
                    {cancelingBidId === bid.id ? (
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

    const Pagination = () => {
        if (lastPage <= 1) return null;

        const getPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;

            if (lastPage <= maxVisible) {
                for (let i = 1; i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(lastPage);
                } else if (currentPage >= lastPage - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(lastPage);
                }
            }

            return pages;
        };

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                <div className="text-sm text-slate-400">
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalBids)} of {totalBids} bids
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={page === '...' || page === currentPage}
                                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                                    page === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : page === '...'
                                            ? 'text-slate-500 cursor-default'
                                            : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">No bids found</h3>
            <p className="text-slate-500 max-w-md">
                {searchInitiated
                    ? `No bids with "${STATUS_CONFIG[status].label}" status were found.`
                    : "Use the search above to find bids by status."
                }
            </p>
        </div>
    );

    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
                <span>Loading bids...</span>
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
                                Bid Status Search
                            </h1>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Search and filter your bids by status to track their progress and manage your transactions.
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
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        {loading ? "Searching..." : "Search Bids"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="relative">
                            {loading && <LoadingOverlay />}

                            <div className={`transition-all duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {bids.length > 0 ? (
                                        bids.map((bid) => <BidCard key={bid.id} bid={bid} />)
                                    ) : !loading ? (
                                        <EmptyState />
                                    ) : null}
                                </div>

                                {bids.length > 0 && <Pagination />}
                            </div>
                        </div>

                        {/* Results Summary */}
                        {!loading && searchInitiated && bids.length > 0 && (
                            <div className="mt-8 text-center">
                                <p className="text-slate-400 text-sm">
                                    Found {totalBids} bid{totalBids === 1 ? '' : 's'} with "{STATUS_CONFIG[status].label}" status
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
