import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

const statusTabs = [
    { label: "Awaiting Payment", value: "awaiting_payment" },
    { label: "Payment Submitted", value: "payment_submitted" },
    { label: "Payment Confirmed", value: "payment_confirmed" },
    { label: "Payment Declined", value: "payment_declined" },
];

const PeerStatusPage = () => {
    const [activeStatus, setActiveStatus] = useState("awaiting_payment");
    const [peers, setPeers] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null as string | null,
        prev_page_url: null as string | null,
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState<"approve" | "unpeer" | "reject" | "block-bidder" | "block-asker" | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const fetchPeers = async (status: string, url?: string) => {
        setLoading(true);
        try {
            const endpoint = url || `${baseUrl}peers/${status}`;
            const res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success && json.data) {
                setPeers(json.data.data);
                setPagination({
                    current_page: json.data.current_page,
                    last_page: json.data.last_page,
                    next_page_url: json.data.next_page_url,
                    prev_page_url: json.data.prev_page_url,
                });
            } else {
                setPeers([]);
            }
        } catch (error) {
            console.error("Error fetching peers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeers(activeStatus);
    }, [activeStatus]);

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "awaiting_payment":
                return "bg-yellow-500";
            case "payment_submitted":
                return "bg-blue-500";
            case "payment_confirmed":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const approvePayment = async (peerId: number) => {
        if (!confirm("Are you sure you want to APPROVE this payment?")) return;
        setActionLoading("approve");
        try {
            const res = await fetch(`${baseUrl}approve-payment/${peerId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success(json.message || "Payment approved successfully!");
                setSelectedPeer(null);
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message || "Failed to approve payment.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "An error occurred.");
        } finally {
            setActionLoading(null);
        }
    };
    const unpeer = async (id: number) => {
        if (!confirm("Are you sure you want to Unpair?")) return;
        setActionLoading("unpeer");
        try {
            const res = await fetch(`${baseUrl}unpair-peering/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            const json = await res.json();
            if (json.success) {
                toast.success(json.message);
                setSelectedPeer(null);
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message );
        } finally {
            setActionLoading(null);
        }
    };
    const blockBidder = async (peerId: number) => {
        setActionLoading("block-bidder");
        try {
            const res = await fetch(`${baseUrl}user-status-update/${peerId}/blocked`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            if (json.success) {
                toast.success(json.message );
                setSelectedPeer(null);
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message );
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message );
        } finally {
            setActionLoading(null);
        }
    };
    const blockAsker = async (peerId: number) => {
        setActionLoading("block-asker");
        try {
            const res = await fetch(`${baseUrl}user-status-update/${peerId}/blocked`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            if (json.success) {
                toast.success(json.message );
                setSelectedPeer(null);
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message );
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message );
        } finally {
            setActionLoading(null);
        }
    };

    const rejectPayment = async (peerId: number, reason: string) => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }

        setActionLoading("reject");
        try {
            const res = await fetch(`${baseUrl}approve-payment/${peerId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "declined", reason }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Payment rejected successfully!");
                setSelectedPeer(null);
                setShowRejectModal(false);
                setRejectReason("");
                fetchPeers(activeStatus);
            } else {
                toast.error(json.message || "Failed to reject payment.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "An error occurred.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <div className="p-6 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-semibold mb-6">Peer Payment Status</h1>

                    <div className="flex gap-4 mb-6">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveStatus(tab.value)}
                                className={`px-5 py-2 rounded-full font-medium transition ${
                                    activeStatus === tab.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : (
                        <div className="bg-[#111827] border border-gray-700 rounded-xl overflow-x-auto shadow-lg">
                            <table className="min-w-full table-auto text-sm">
                                <thead>
                                <tr className="bg-[#1f2937] text-gray-300 text-left uppercase text-xs">
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Bid User</th>
                                    <th className="px-6 py-4">Ask User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Due At</th>
                                </tr>
                                </thead>
                                <tbody>
                                {peers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            No data found.
                                        </td>
                                    </tr>
                                ) : (
                                    peers.map((peer: any) => (
                                        <tr
                                            key={peer.id}
                                            className="border-t border-gray-700 hover:bg-[#1e293b] cursor-pointer"
                                            onClick={() => setSelectedPeer(peer)}
                                        >
                                            <td className="px-6 py-4">{peer.reference}</td>
                                            <td className="px-6 py-4">{peer.bid_user?.username || "N/A"}</td>
                                            <td className="px-6 py-4">{peer.ask_user?.username || "N/A"}</td>
                                            <td className="px-6 py-4">{peer.pair_amount} USDT</td>
                                            <td className="px-6 py-4">
                          <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                  peer.status
                              )}`}
                          >
                            {peer.status.replace(/_/g, " ")}
                          </span>
                                            </td>
                                            <td className="px-6 py-4">{peer.due_at}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                        <button
                            disabled={!pagination.prev_page_url}
                            onClick={() => fetchPeers(activeStatus, pagination.prev_page_url!)}
                            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 text-white"
                        >
                            Previous
                        </button>
                        <span>
              Page {pagination.current_page} of {pagination.last_page}
            </span>
                        <button
                            disabled={!pagination.next_page_url}
                            onClick={() => fetchPeers(activeStatus, pagination.next_page_url!)}
                            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 text-white"
                        >
                            Next
                        </button>
                    </div>

                    {selectedPeer && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                            <div className="bg-[#1f2937] p-6 rounded-lg shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
                                    onClick={() => setSelectedPeer(null)}
                                >
                                    ✕
                                </button>
                                <h2 className="text-2xl font-bold mb-4">Peer Transaction Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><strong>Reference:</strong> {selectedPeer.reference}</p>
                                        <p><strong>Status:</strong> {selectedPeer.status.replace(/_/g, ' ')}</p>
                                        <p><strong>Payment Status:</strong> {selectedPeer.payment_status}</p>
                                        <p><strong>Pair Amount:</strong> {selectedPeer.pair_amount} USDT</p>
                                        <p><strong>Due At:</strong> {selectedPeer.due_at}</p>
                                        <p><strong>Paid At:</strong> {selectedPeer.paid_at || "N/A"}</p>
                                        <p><strong>Confirmed At:</strong> {selectedPeer.confirmed_at || "N/A"}</p>
                                        <p><strong>Hash Tag:</strong> <a href={selectedPeer.hash_tag} className="text-blue-400 underline" target="_blank">{selectedPeer.hash_tag}</a></p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mt-4 mb-2">Ask Details</h3>
                                        <p><strong>User:</strong> {selectedPeer.ask_user?.username} ({selectedPeer.ask_user?.email})</p>
                                        <p><strong>Amount:</strong> {selectedPeer.ask?.amount} USDT</p>
                                        <p><strong>Paired:</strong> {selectedPeer.ask?.paired_amount} USDT</p>
                                        <p><strong>BEP Address:</strong> {selectedPeer.ask?.bep_address}</p>
                                        <p><strong>Balance Source:</strong> {selectedPeer.ask?.bal_source}</p>
                                        <p><strong>Balance Before:</strong> {selectedPeer.ask?.bal_before}</p>
                                        <p><strong>Balance After:</strong> {selectedPeer.ask?.bal_after}</p>
                                        <p><strong>Trx:</strong> {selectedPeer.ask?.trx}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mt-4 mb-2">Bid Details</h3>
                                        <p><strong>User:</strong> {selectedPeer.bid_user?.username} ({selectedPeer.bid_user?.email})</p>
                                        <p><strong>Amount:</strong> {selectedPeer.bid?.amount} USDT</p>
                                        <p><strong>Paired:</strong> {selectedPeer.bid?.paired_amount} USDT</p>
                                        <p><strong>Plan ID:</strong> {selectedPeer.bid?.plan_id}</p>
                                        <p><strong>Invest ID:</strong> {selectedPeer.bid?.invest_id}</p>
                                        <p><strong>Trx:</strong> {selectedPeer.bid?.trx}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => approvePayment(selectedPeer.id)}
                                        disabled={actionLoading === "approve"}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {actionLoading === "approve" ? "Approving..." : "Approve Payment"}
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={actionLoading === "reject"}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {actionLoading === "reject" ? "Rejecting..." : "Reject Payment"}
                                    </button>

                                    <button
                                        onClick={() => blockBidder(selectedPeer.bid_user.id)}
                                        disabled={actionLoading === "block-bidder"}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {actionLoading === "block-bidder" ? "Blocking..." : "Block Bidder"}
                                    </button>
                                    <button
                                        onClick={() => blockAsker(selectedPeer.ask_user.id)}
                                        disabled={actionLoading === "block-asker"}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {actionLoading === "block-asker" ? "Blocking..." : "Block Asker"}
                                    </button>
                                    <button
                                        onClick={() => unpeer(selectedPeer.id)}
                                        disabled={actionLoading === "unpeer"}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {actionLoading === "unpeer" ? "Unpairing..." : "Unpair"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-[#1f2937] p-6 rounded-lg shadow-xl w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
                            onClick={() => setShowRejectModal(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Reject Payment</h2>
                        <label className="block text-sm mb-2">Reason for rejection:</label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-gray-800 text-white rounded resize-none"
                            placeholder="Enter reason..."
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => rejectPayment(selectedPeer.id, rejectReason)}
                                disabled={actionLoading === "reject"}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                            >
                                {actionLoading === "reject" ? "Rejecting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PeerStatusPage;
