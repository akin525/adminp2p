import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function AskDetail() {
    const { id } = useParams();
    const [ask, setAsk] = useState<any>(null);
    const [peers, setPeers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Modals
    const [modalOpen, setModalOpen] = useState(false);
    const [peerDetailModalOpen, setPeerDetailModalOpen] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState<any>(null);

    // Action
    const [actionType, setActionType] = useState<"confirm" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchAsk = async () => {
            try {
                const res = await fetch(`${baseUrl}ask-details/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setAsk(json.data);
                    setPeers(json.peers || []);
                }
            } catch (err) {
                console.error("Failed to fetch ask details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAsk();
    }, [id]);

    const handleActionClick = (peer: any) => {
        setSelectedPeer(peer);
        setActionType(null);
        setRejectReason("");
        setModalOpen(true);
    };

    const handlePeerDetailClick = (peer: any) => {
        setSelectedPeer(peer);
        setPeerDetailModalOpen(true);
    };

    const handleSubmitAction = async () => {
        if (!selectedPeer || !actionType) return;

        setProcessing(true);
        try {
            const endpoint = `${baseUrl}ask-confirmation/${id}/${selectedPeer.id}`;
            const bodyData = actionType === "reject"
                ? { status: "declined", reason: rejectReason }
                : { status: "approved" };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const json = await res.json();

            if (json.success === true) {
                toast.success(
                    actionType === "confirm"
                        ? "Peer confirmed successfully."
                        : "Peer rejected successfully."
                );
                window.location.reload();
            } else {
                toast.error(json.message || "Action failed.");
            }
        } catch (err) {
            console.error("Error submitting action:", err);
            toast.error("Something went wrong.");
        } finally {
            setProcessing(false);
            setModalOpen(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Loading...</div>;
    if (!ask) return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Ask not found.</div>;

    return (
        <div className="min-h-screen bg-[#050B1E] text-white flex">
            {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto space-y-10">
                        {/* Ask Info */}
                        <section className="bg-[#1A202C] p-6 sm:p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">Ask Details</h2>
                            <div className="grid gap-4 sm:grid-cols-2 text-sm">
                                <p><span className="font-semibold">BEP Address:</span> {ask.bep_address}</p>
                                <p><span className="font-semibold">Amount:</span> {ask.amount} USDT</p>
                                <p><span className="font-semibold">Amount to Pair:</span> {ask.amount_to_pair} USDT</p>
                                <p><span className="font-semibold">Paired Amount:</span> {ask.paired_amount} USDT</p>
                                <p><span className="font-semibold">Balance Source:</span> {ask.bal_source}</p>
                                <p><span className="font-semibold">Balance Before:</span> {ask.bal_before}</p>
                                <p><span className="font-semibold">Balance After:</span> {ask.bal_after}</p>
                                <p><span className="font-semibold">Transaction ID:</span> {ask.trx}</p>
                                <p><span className="font-semibold">Status:</span> {ask.status}</p>
                                <p><span className="font-semibold">Created At:</span> {new Date(ask.created_at).toLocaleString()}</p>
                            </div>
                        </section>

                        {/* Peers Table */}
                        <section className="bg-[#1A202C] p-6 sm:p-8 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-6">Peers</h2>
                            {peers.length === 0 ? (
                                <p className="text-gray-400 text-sm">No peers found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left text-gray-300">
                                        <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                                        <tr>
                                            <th className="px-4 py-3">Reference</th>
                                            <th className="px-4 py-3">Bid User</th>
                                            <th className="px-4 py-3">Pair Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Payment Status</th>
                                            <th className="px-4 py-3">Due At</th>
                                            <th className="px-4 py-3 text-center">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {peers.map((peer) => (
                                            <tr key={peer.id} className="cursor-pointer hover:bg-gray-700" onClick={() => handlePeerDetailClick(peer)}>
                                                <td className="px-4 py-2">{peer.reference}</td>
                                                <td className="px-4 py-2">{peer.bid_user?.username ?? "N/A"}</td>
                                                <td className="px-4 py-2">{peer.pair_amount} USDT</td>
                                                <td className="px-4 py-2 capitalize">{peer.status.replace(/_/g, ' ')}</td>
                                                <td className="px-4 py-2">{peer.payment_status}</td>
                                                <td className="px-4 py-2">{peer.due_at ? new Date(peer.due_at).toLocaleString() : "N/A"}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleActionClick(peer); }}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                                                    >
                                                        Action
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            {/* Confirm/Reject Modal */}
            {modalOpen && selectedPeer && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6 border border-gray-700">
                        <h2 className="text-2xl font-semibold text-white text-center">Take Action</h2>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setActionType("confirm")} className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition duration-200 ${actionType === "confirm" ? "bg-green-600 ring-2 ring-green-400" : "bg-gray-800 hover:bg-green-700"}`}>✅ Confirm</button>
                            <button onClick={() => setActionType("reject")} className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition duration-200 ${actionType === "reject" ? "bg-red-600 ring-2 ring-red-400" : "bg-gray-800 hover:bg-red-700"}`}>❌ Decline</button>
                        </div>

                        {actionType === "reject" && (
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Reason for Declining :</label>
                                <textarea className="w-full rounded-xl bg-gray-800 text-white p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Provide the reason for declining this ask..."></textarea>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={() => setModalOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSubmitAction} disabled={processing} className={`bg-blue-600 text-white py-2 px-4 rounded-md font-medium ${processing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>{processing ? "Processing..." : "Submit Action"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Peer Detail Modal */}
            {peerDetailModalOpen && selectedPeer && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
                    <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl w-full max-w-xl space-y-4">
                        <h3 className="text-xl font-semibold text-white text-center">Peer Detail</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                            <p><strong>Reference:</strong> {selectedPeer.reference}</p>
                            <p><strong>Pair Amount:</strong> {selectedPeer.pair_amount} USDT</p>
                            <p><strong>Status:</strong> {selectedPeer.status}</p>
                            <p><strong>Payment Status:</strong> {selectedPeer.payment_status}</p>
                            <p><strong>Due At:</strong> {new Date(selectedPeer.due_at).toLocaleString()}</p>
                            <p><strong>Paid At:</strong> {new Date(selectedPeer.paid_at).toLocaleString()}</p>
                            <p><strong>Confirmed At:</strong> {new Date(selectedPeer.confirmed_at).toLocaleString()}</p>
                            <p><strong>Hashtag:</strong> {selectedPeer.hash_tag}</p>
                            <p><strong>Bid User:</strong> {selectedPeer.bid_user?.username}</p>
                            <p><strong>Bid Email:</strong> {selectedPeer.bid_user?.email}</p>
                        </div>
                        <div className="text-center mt-4">
                            <button onClick={() => setPeerDetailModalOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
