import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import { toast } from "react-toastify";
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Eye,
    Check,
    X,
    UserX,
    Unlink,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    User,
    CreditCard,
    Calendar,
    Hash,
    DollarSign,
    Shield,
    AlertCircle
} from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface User {
    id: number;
    username: string;
    email: string;
}

interface Ask {
    amount: number;
    paired_amount: number;
    bep_address: string;
    bal_source: string;
    bal_before: number;
    bal_after: number;
    trx: string;
}

interface Bid {
    amount: number;
    paired_amount: number;
    plan_id: number;
    invest_id: number;
    trx: string;
}

interface Peer {
    id: number;
    reference: string;
    status: string;
    payment_status: string;
    pair_amount: number;
    due_at: string;
    paid_at?: string;
    confirmed_at?: string;
    hash_tag: string;
    bid_user: User;
    ask_user: User;
    ask: Ask;
    bid: Bid;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
}

type ActionType = "approve" | "unpeer" | "reject" | "block-bidder" | "block-asker" | null;

const statusTabs = [
    {
        label: "Awaiting Payment",
        value: "awaiting_payment",
        icon: Clock,
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20"
    },
    {
        label: "Payment Submitted",
        value: "payment_submitted",
        icon: CheckCircle,
        color: "text-blue-400 bg-blue-400/10 border-blue-400/20"
    },
    {
        label: "Payment Confirmed",
        value: "payment_confirmed",
        icon: CheckCircle,
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    },
    {
        label: "Payment Declined",
        value: "payment_declined",
        icon: XCircle,
        color: "text-red-400 bg-red-400/10 border-red-400/20"
    },
];

const PeerStatusPage = () => {
    const [activeStatus, setActiveStatus] = useState("awaiting_payment");
    const [peers, setPeers] = useState<Peer[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        total: 0,
        per_page: 15
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
    const [actionLoading, setActionLoading] = useState<ActionType>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const token = getAuthToken();

    const fetchPeers = useCallback(async (status: string, url?: string) => {
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        try {
            const endpoint = url || `${baseUrl}peers/${status}`;
            const res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const json = await res.json();
            if (json.success && json.data) {
                setPeers(json.data.data || []);
                setPagination({
                    current_page: json.data.current_page || 1,
                    last_page: json.data.last_page || 1,
                    next_page_url: json.data.next_page_url,
                    prev_page_url: json.data.prev_page_url,
                    total: json.data.total || 0,
                    per_page: json.data.per_page || 15
                });
            } else {
                setPeers([]);
            }
        } catch (error) {
            console.error("Error fetching peers:", error);
            toast.error("Failed to fetch peer data");
            setPeers([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPeers(activeStatus);
    }, [activeStatus, fetchPeers]);

    const getStatusConfig = (status: string) => {
        const tab = statusTabs.find(tab => tab.value === status);
        return tab || statusTabs[0];
    };

    const handleAction = async (
        action: ActionType,
        peerId: number,
        endpoint: string,
        method: string = "POST",
        body?: any,
        confirmMessage?: string
    ) => {
        if (confirmMessage && !confirm(confirmMessage)) return;

        setActionLoading(action);
        try {
            const res = await fetch(`${baseUrl}${endpoint}`, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                ...(body && { body: JSON.stringify(body) })
            });

            const json = await res.json();
            if (json.success) {
                toast.success(json.message || "Action completed successfully!");
                setSelectedPeer(null);
                if (action === "reject") {
                    setShowRejectModal(false);
                    setRejectReason("");
                }
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message || "Action failed");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    const approvePayment = (peerId: number) => {
        handleAction(
            "approve",
            peerId,
            `approve-payment/${peerId}`,
            "POST",
            { status: "approved" },
            "Are you sure you want to APPROVE this payment?"
        );
    };

    const unpeer = (id: number) => {
        handleAction(
            "unpeer",
            id,
            `unpair-peering/${id}`,
            "GET",
            undefined,
            "Are you sure you want to Unpair?"
        );
    };

    const blockUser = (userId: number, type: "bidder" | "asker") => {
        handleAction(
            type === "bidder" ? "block-bidder" : "block-asker",
            userId,
            `user-status-update/${userId}/blocked`,
            "GET",
            undefined,
            `Are you sure you want to block this ${type}?`
        );
    };

    const rejectPayment = () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }

        if (!selectedPeer) return;

        handleAction(
            "reject",
            selectedPeer.id,
            `approve-payment/${selectedPeer.id}`,
            "POST",
            { status: "declined", reason: rejectReason }
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const config = getStatusConfig(status);
        const Icon = config.icon;

        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                <Icon className="w-3 h-3" />
                {status.replace(/_/g, " ")}
            </div>
        );
    };

    const PeerRow = ({ peer }: { peer: Peer }) => (
        <tr
            className="border-t border-slate-700/50 hover:bg-slate-800/30 cursor-pointer transition-colors group"
            onClick={() => setSelectedPeer(peer)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-sm">{peer.reference}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{peer.bid_user?.username || "N/A"}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{peer.ask_user?.username || "N/A"}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold">{peer.pair_amount.toLocaleString()} USDT</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={peer.status} />
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{new Date(peer.due_at).toLocaleDateString()}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <Eye className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </td>
        </tr>
    );

    const DetailModal = () => {
        if (!selectedPeer) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                                <p className="text-sm text-slate-400">Reference: {selectedPeer.reference}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedPeer(null)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Transaction Info */}
                            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    Transaction Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Status:</span>
                                        <StatusBadge status={selectedPeer.status} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Payment Status:</span>
                                        <span className="text-white">{selectedPeer.payment_status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Amount:</span>
                                        <span className="text-emerald-400 font-semibold">{selectedPeer.pair_amount} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Due At:</span>
                                        <span className="text-white">{new Date(selectedPeer.due_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Paid At:</span>
                                        <span className="text-white">{selectedPeer.paid_at ? new Date(selectedPeer.paid_at).toLocaleString() : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Confirmed At:</span>
                                        <span className="text-white">{selectedPeer.confirmed_at ? new Date(selectedPeer.confirmed_at).toLocaleString() : "N/A"}</span>
                                    </div>
                                    {selectedPeer.hash_tag && (
                                        <div className="pt-2 border-t border-slate-700/50">
                                            <span className="text-slate-400 text-xs">Transaction Hash:</span>
                                            <a
                                                href={selectedPeer.hash_tag}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors mt-1"
                                            >
                                                <span className="font-mono text-xs truncate">{selectedPeer.hash_tag}</span>
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ask Details */}
                            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-400" />
                                    Ask Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-slate-400">User:</span>
                                        <div className="mt-1">
                                            <p className="text-white font-medium">{selectedPeer.ask_user?.username}</p>
                                            <p className="text-slate-400 text-xs">{selectedPeer.ask_user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Amount:</span>
                                        <span className="text-white">{selectedPeer.ask?.amount} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Paired:</span>
                                        <span className="text-white">{selectedPeer.ask?.paired_amount} USDT</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">BEP Address:</span>
                                        <p className="text-white font-mono text-xs mt-1 break-all">{selectedPeer.ask?.bep_address}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Balance Source:</span>
                                        <span className="text-white">{selectedPeer.ask?.bal_source}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Balance Before:</span>
                                        <span className="text-white">{selectedPeer.ask?.bal_before}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Balance After:</span>
                                        <span className="text-white">{selectedPeer.ask?.bal_after}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Transaction:</span>
                                        <p className="text-white font-mono text-xs mt-1 break-all">{selectedPeer.ask?.trx}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bid Details */}
                            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    Bid Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-slate-400">User:</span>
                                        <div className="mt-1">
                                            <p className="text-white font-medium">{selectedPeer.bid_user?.username}</p>
                                            <p className="text-slate-400 text-xs">{selectedPeer.bid_user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Amount:</span>
                                        <span className="text-white">{selectedPeer.bid?.amount} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Paired:</span>
                                        <span className="text-white">{selectedPeer.bid?.paired_amount} USDT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Plan ID:</span>
                                        <span className="text-white">{selectedPeer.bid?.plan_id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Invest ID:</span>
                                        <span className="text-white">{selectedPeer.bid?.invest_id}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Transaction:</span>
                                        <p className="text-white font-mono text-xs mt-1 break-all">{selectedPeer.bid?.trx}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => approvePayment(selectedPeer.id)}
                                disabled={actionLoading === "approve"}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {actionLoading === "approve" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Approve Payment
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={actionLoading === "reject"}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                                Reject Payment
                            </button>

                            <button
                                onClick={() => unpeer(selectedPeer.id)}
                                disabled={actionLoading === "unpeer"}
                                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {actionLoading === "unpeer" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Unpairing...
                                    </>
                                ) : (
                                    <>
                                        <Unlink className="w-4 h-4" />
                                        Unpair
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => blockUser(selectedPeer.bid_user.id, "bidder")}
                                disabled={actionLoading === "block-bidder"}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {actionLoading === "block-bidder" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Blocking...
                                    </>
                                ) : (
                                    <>
                                        <UserX className="w-4 h-4" />
                                        Block Bidder
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => blockUser(selectedPeer.ask_user.id, "asker")}
                                disabled={actionLoading === "block-asker"}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {actionLoading === "block-asker" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Blocking...
                                    </>
                                ) : (
                                    <>
                                        <UserX className="w-4 h-4" />
                                        Block Asker
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RejectModal = () => {
        if (!showRejectModal) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Reject Payment</h2>
                        </div>
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                            Reason for rejection <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            className="w-full p-4 bg-slate-800/50 border border-slate-600 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Please provide a detailed reason for rejecting this payment..."
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={rejectPayment}
                                disabled={actionLoading === "reject" || !rejectReason.trim()}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {actionLoading === "reject" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        Reject Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const Pagination = () => {
        if (pagination.last_page <= 1) return null;

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                <div className="text-sm text-slate-400">
                    Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} peers
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchPeers(activeStatus, pagination.prev_page_url!)}
                        disabled={!pagination.prev_page_url}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <span className="px-4 py-2 text-slate-300">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>

                    <button
                        onClick={() => fetchPeers(activeStatus, pagination.next_page_url!)}
                        disabled={!pagination.next_page_url}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">No peers found</h3>
            <p className="text-slate-500">
                No peer transactions found for the selected status.
            </p>
        </div>
    );

    const LoadingState = () => (
        <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Loading peers...</h3>
            <p className="text-slate-500">Please wait while we fetch the peer data.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Peer Payment Status</h1>
                                    <p className="text-slate-400">Monitor and manage peer-to-peer payment transactions</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Tabs */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-3">
                                {statusTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeStatus === tab.value;

                                    return (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveStatus(tab.value)}
                                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 border ${
                                                isActive
                                                    ? `${tab.color} shadow-lg`
                                                    : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600/50"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                            {loading ? (
                                <LoadingState />
                            ) : peers.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="bg-slate-800/50 border-b border-slate-700/50">
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Reference
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Bid User
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Ask User
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Due Date
                                                </th>
                                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {peers.map((peer) => (
                                                <PeerRow key={peer.id} peer={peer} />
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <Pagination />
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <DetailModal />
            <RejectModal />
        </div>
    );
};

export default PeerStatusPage;

