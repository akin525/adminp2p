import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuthToken } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { BadgeCheck, UserCircle } from "lucide-react";
import {toast} from "react-toastify";

interface UserProfile {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    balance: string;
    earning: string;
    telegram_id: string;
    bep_address: string;
    country: string;
    email_verified: number;
    telegram_verified: number;
    ref_code: string;
    referral: string;
    status: string;
    created_at: string;
}

interface UserStats {
    profile: UserProfile;
    bids: number;
    asks: number;
    success_bids: number;
    success_asks: number;
    sum_bids: number;
    sum_asks: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function UserDetailsPage() {
    const { id } = useParams();
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [botcastMessage, setBotcastMessage] = useState("");
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${baseUrl}user-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user details");
                const result = await res.json();
                setUserStats(result?.data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const profile = userStats?.profile;

    const handleBotcastSend = async () => {
        if (!profile?.telegram_id || !botcastMessage.trim()) return;

        setSending(true);
        setFeedback(null);
        try {
            const token = getAuthToken();
            const res = await fetch(`${baseUrl}bot-cast`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    to: String(profile.id),
                    message: botcastMessage,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send message");
            toast.success("Message sent successfully!");
            setFeedback({ type: "success", message: "Message sent successfully!" });
            setBotcastMessage("");
        } catch (err: any) {
            setFeedback({ type: "error", message: err.message || "Error sending message" });
        } finally {
            setSending(false);
        }
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

                <main className="p-6 space-y-6">
                    <h1 className="text-3xl font-bold">👤 User Details</h1>

                    {loading ? (
                        <p className="text-gray-300">Loading user...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : profile ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Profile Info */}
                                <div className="bg-gray-900 rounded-2xl p-6 shadow-lg space-y-4 border border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <UserCircle size={28} />
                                        <h2 className="text-xl font-semibold">Profile Information</h2>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Full Name:</strong> {profile.firstname} {profile.lastname}</p>
                                        <p><strong>Username:</strong> @{profile.username}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Phone:</strong> {profile.phone}</p>
                                        <p><strong>Country:</strong> {profile.country}</p>
                                        <p><strong>Referral Code:</strong> {profile.ref_code}</p>
                                        <p><strong>Referred By:</strong> {profile.referral || "N/A"}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${profile.status === "active" ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
                                                {profile.status}
                                            </span>
                                        </p>
                                        <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Stats Info */}
                                <div className="bg-gray-900 rounded-2xl p-6 shadow-lg space-y-4 border border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck size={28} />
                                        <h2 className="text-xl font-semibold">Account & Statistics</h2>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Balance:</strong> USDT {Number(profile.balance).toLocaleString()}</p>
                                        <p><strong>Earnings:</strong> USDT {Number(profile.earning).toLocaleString()}</p>
                                        <p><strong>BEP Address:</strong> {profile.bep_address}</p>
                                        <p><strong>Telegram ID:</strong> {profile.telegram_id}</p>
                                        <p>
                                            <strong>Email Verified:</strong>{" "}
                                            {profile.email_verified ? (
                                                <span className="text-green-400">Yes ✅</span>
                                            ) : (
                                                <span className="text-red-400">No ❌</span>
                                            )}
                                        </p>
                                        <p>
                                            <strong>Telegram Verified:</strong>{" "}
                                            {profile.telegram_verified ? (
                                                <span className="text-green-400">Yes ✅</span>
                                            ) : (
                                                <span className="text-red-400">No ❌</span>
                                            )}
                                        </p>
                                        <p><strong>Total Bids:</strong> {userStats?.bids}</p>
                                        <p><strong>Successful Bids:</strong> {userStats?.success_bids}</p>
                                        <p><strong>Sum of Bids:</strong> USDT {userStats?.sum_bids.toLocaleString()}</p>
                                        <p><strong>Total Asks:</strong> {userStats?.asks}</p>
                                        <p><strong>Successful Asks:</strong> {userStats?.success_asks}</p>
                                        <p><strong>Sum of Asks:</strong> USDT {userStats?.sum_asks.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Send BotCast Section */}
                            {profile.telegram_id && (
                                <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mt-8">
                                    <h2 className="text-xl font-semibold mb-4">📨 Send BotCast to @{profile.username}</h2>

                                    <textarea
                                        rows={4}
                                        value={botcastMessage}
                                        onChange={(e) => setBotcastMessage(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your message..."
                                    />

                                    <div className="mt-4 flex items-center justify-between">
                                        <button
                                            onClick={handleBotcastSend}
                                            disabled={sending}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                                        >
                                            {sending ? "Sending..." : "Send Message"}
                                        </button>

                                        {feedback && (
                                            <span className={`text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
                                                {feedback.type === "success" ? "✅" : "❌"} {feedback.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-400">User not found.</p>
                    )}
                </main>
            </div>
        </div>
    );
}
