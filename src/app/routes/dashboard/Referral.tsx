// ReferralPage.tsx
import { useState } from 'react';
import Sidebar from "@/components/Sidebar.tsx";
import DashboardHeader from "@/components/DashboardHeader.tsx";
import {useUser} from "@/context/UserContext.tsx";

export default function ReferralPage() {
    const [copied, setCopied] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useUser() as any;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const referralCode = user?.ref_code || "N/A"
    const referralLink = user?.ref_code ? `${baseUrl}/register?ref=${user.ref_code}` : "";

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 secs
    };

    return (
        <div className="min-h-screen text-white flex bg-[#050B1E]">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">🎉 Refer & Earn</h1>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Your Referral Code</label>
                    <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
                        <span className="flex-1">{referralCode}</span>
                        <button
                            onClick={() => copyToClipboard(referralCode)}
                            className="ml-4 bg-blue-600 hover:bg-blue-700 transition px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Your Referral Link</label>
                    <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
                        <span className="flex-1 text-xs break-all">{referralLink}</span>
                        <button
                            onClick={() => copyToClipboard(referralLink)}
                            className="ml-4 bg-green-600 hover:bg-green-700 transition px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400">
                    Share this link with your friends and earn rewards when they register!
                </p>
            </div>
        </div>
                </main>
            </div>
        </div>
    );
}
