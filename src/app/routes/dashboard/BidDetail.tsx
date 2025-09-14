import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/auth";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function BidDetail() {
    const { id } = useParams();
    const [bid, setBid] = useState<any>(null);
    const [peers, setPeers] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPeerId, setSelectedPeerId] = useState<number | null>(null);
    const [hashTag, setHashTag] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // For the loading state of the submit button

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const res = await fetch(`${baseUrl}bid-details/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setBid(data.data);
                setPeers(data.peers || []);
            } catch (err) {
                console.error("Failed to fetch bid", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBid();
    }, [id]);

    const submitHashTag = async () => {
        if (!selectedPeerId || !hashTag.trim()) {
            toast.error("Please enter a valid payment hash tag.");
            return;
        }

        setIsSubmitting(true); // Start the loading state for the button

        try {
            const res = await fetch(`${baseUrl}bid-payment/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ hash_tag: hashTag })
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Hash tag submitted successfully.");
                setHashTag("");
                setShowModal(false);
                window.location.reload(); // Reload the page after successful submission
            } else {
                toast.error("Failed to submit hash tag.");
            }
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false); // Stop the loading state
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Loading...</div>;
    }

    if (!bid) {
        return <div className="min-h-screen bg-[#050B1E] text-white flex items-center justify-center">Bid not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#050B1E] text-white flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto py-10 px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto bg-[#1A202C] p-8 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold mb-6 text-center">Bid Details</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <Detail label="Amount" value={`${bid.amount} USDT`} />
                            <Detail label="Amount To Pair" value={`${bid.amount_to_pair} USDT`} />
                            <Detail label="Paired Amount" value={`${bid.paired_amount} USDT`} />
                            <Detail label="Transaction ID" value={bid.trx} />
                            <Detail label="Created At" value={new Date(bid.created_at).toLocaleString()} />
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Status:</span>
                                <StatusBadge status={bid.status} />
                            </div>
                        </div>

                        {peers.map((peer) => (
                            <div key={peer.id} className="border border-gray-700 rounded-lg p-4 bg-[#2D3748]">
                                <p className="mb-2"><strong>Paired Amount:</strong> <b>{peer.pair_amount} USDT</b></p>
                                <p className="mb-2"><strong>Reference:</strong> {peer.reference}</p>
                                <p><strong>Ask User:</strong> {peer.ask_user.username} ({peer.ask_user.email})</p>
                                <p><strong>Due At:</strong> {new Date(peer.due_at).toLocaleString()}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <strong>Payment-Status: </strong>
                                    {peer.status === "undecided" && (
                                        <StatusBadge status={peer.status}/>
                                    )}
                                    <StatusBadge status={peer.payment_status} isPayment/>
                                </div>

                                <div className="mt-3 flex items-center gap-4 flex-wrap">
                                    {peer.status !== "undecided" && <StatusBadge status={peer.status}/>}
                                    {peer.payment_status !== "payment_submitted" && (  // Hide button if payment status is "payment_submitted"
                                        <button
                                            onClick={() => {
                                                setSelectedPeerId(peer.id);
                                                setShowModal(true);
                                            }}
                                            className="bg-blue-500 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-400 transition"
                                        >
                                            Submit Hash Tag
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                </main>
            </div>

            <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-[#1A202C] rounded-lg p-6 shadow-xl text-white">
                        <Dialog.Title className="text-xl font-semibold mb-4">Enter Payment Hash Tag</Dialog.Title>
                        <input
                            type="text"
                            placeholder="Hash tag..."
                            value={hashTag}
                            onChange={(e) => setHashTag(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-[#2D3748] border border-gray-600 focus:outline-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitHashTag}
                                disabled={isSubmitting}  // Disable the button when submitting
                                className={`px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}  {/* Change text when submitting */}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}

// Helper Components

function Detail({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-medium">{value}</p>
        </div>
    );
}

function StatusBadge({ status,  }: { status: string; isPayment?: boolean }) {
    const label = formatLabel(status);

    const base = "px-2 py-1 text-xs font-semibold rounded-full";

    const statusColors: Record<string, string> = {
        awaiting_payment: "bg-yellow-500 text-black",
        success: "bg-green-100 text-green-700",
        paired: "bg-blue-500 text-white",
        completed: "bg-green-600 text-white",
        approved: "bg-green-600 text-white",
        payment_confirmed: "bg-blue-800 text-white",
        confirmed: "bg-green-600 text-white",
        pending: "bg-yellow-600 text-black",
        failed: "bg-red-600 text-white",
        undecided: "bg-gray-600 text-white",
    };

    const fallback = "bg-gray-400 text-black";
    const style = statusColors[status.toLowerCase()] || fallback;

    return <span className={`${base} ${style}`}>{label}</span>;
}

function formatLabel(label: string): string {
    return label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
