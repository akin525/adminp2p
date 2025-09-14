import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import { getAuthToken } from "@/utils/auth.tsx";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

type Feedback = {
    type: "success" | "error";
    message: string;
};

type User = {
    id: number | string;
    username: string;
};

export default function BotCastPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [to, setTo] = useState<string>("all");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const [userModalOpen, setUserModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<number | string | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch(`${baseUrl}users?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data?.data?.data || []);
            } else {
                toast.error(data?.message || "Failed to fetch users");
            }
        } catch (err) {
            toast.error("Error fetching users");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (userModalOpen) fetchUsers();
    }, [page, userModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const res = await fetch(`${baseUrl}bot-cast`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    to: to === "all" ? "all" : String(selectedUser),
                    message,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setFeedback({ type: "success", message: "Message sent successfully!" });
                setMessage("");
                setTo("all");
                setSelectedUser(null);
                toast.success(data?.message || "Message sent successfully!");
            } else {
                throw new Error(data?.message || "Failed to send");
            }
        } catch (err) {
            if (err instanceof Error) {
                setFeedback({ type: "error", message: err.message });
            } else {
                setFeedback({ type: "error", message: "Unknown error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0B1120] text-white relative">
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black bg-opacity-60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
                    <div className="w-full max-w-2xl bg-[#111827] p-8 rounded-2xl shadow-lg border border-gray-800">
                        <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">📢 Bot Cast</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Send To</label>
                                <select
                                    value={to === "all" ? "all" : "user"}
                                    onChange={(e) => {
                                        if (e.target.value === "all") {
                                            setTo("all");
                                            setSelectedUser(null);
                                        } else {
                                            setUserModalOpen(true);
                                        }
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white"
                                >
                                    <option value="all">All Users</option>
                                    <option value="user">Specific User</option>
                                </select>
                                {selectedUser && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        Selected User ID: <span className="text-green-400">{selectedUser}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400"
                                    placeholder="Enter your message here. Use \\n for new lines."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ${
                                    loading ? "bg-green-700 opacity-70 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                            {feedback && (
                                <div
                                    className={`p-3 rounded-md mt-4 flex items-center gap-2 text-sm ${
                                        feedback.type === "success"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {feedback.type === "success" ? "✅" : "❌"} {feedback.message}
                                </div>
                            )}
                        </form>
                    </div>
                </main>
            </div>

            {/* User Modal */}
            {userModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                        <h2 className="text-xl font-semibold mb-4 text-center">Select a User</h2>

                        {loadingUsers ? (
                            <div className="text-center py-10">
                                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Loading users...</p>
                            </div>
                        ) : (
                            <>
                                <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 border-t pt-2">
                                    {users.map((user) => (
                                        <li
                                            key={user.id}
                                            className="p-2 rounded hover:bg-green-100 cursor-pointer border-b transition"
                                            onClick={() => {
                                                setTo(String(user.id));
                                                setSelectedUser(user.id);
                                                setUserModalOpen(false);
                                            }}
                                        >
                                            <strong>{user.username}</strong> (ID: {user.id})
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between mt-4">
                                    <button
                                        className="px-4 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="px-4 py-1 border rounded hover:bg-gray-100"
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}

                        <button
                            className="absolute top-2 right-3 text-2xl font-bold hover:text-red-500"
                            onClick={() => setUserModalOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
