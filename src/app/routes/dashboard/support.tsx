import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";

export default function SupportPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050B1E] text-white flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-10 px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">Support Center</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Telegram Channel */}
                            <div className="bg-[#070D20] p-6 rounded-xl border border-gray-800 shadow hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-white">Telegram Channel</h3>
                                    <Send className="text-blue-400 w-5 h-5" />
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Stay updated with official announcements and news.
                                </p>
                                <a
                                    href="https://t.me/yourchannel" // <-- Replace this with your real channel link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Join Channel
                                </a>
                            </div>

                            {/* Telegram General Group */}
                            <div className="bg-[#070D20] p-6 rounded-xl border border-gray-800 shadow hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-white">Telegram General Group</h3>
                                    <MessageCircle className="text-green-400 w-5 h-5" />
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Chat, ask questions, and connect with the community.
                                </p>
                                <a
                                    href="https://t.me/yourgroup" // <-- Replace this with your real group link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Join Group
                                </a>
                            </div>
                        </div>

                        {/* Additional Support Info (optional) */}
                        <div className="mt-10 text-center text-gray-500 text-sm">
                            For further assistance, contact our admin via Telegram or email.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
