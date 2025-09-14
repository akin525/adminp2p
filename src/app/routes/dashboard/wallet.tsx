import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import { ArrowDownRight, ArrowUpRight, ClipboardList, DollarSign } from "lucide-react";
// import { useUser } from "@/context/UserContext.tsx";

export default function Wallet() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const { user } = useUser();

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
                    <div className="py-8">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold text-white mb-6">My Wallet</h1>

                            {/* Wallet Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Balance */}
                                <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] p-6 rounded-xl shadow-lg border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">USDT Balance</p>
                                            {/*<h2 className="text-3xl font-semibold">*/}
                                            {/*    {user?.balance?.toLocaleString() ?? "0.00"} USDT*/}
                                            {/*</h2>*/}
                                        </div>
                                        <DollarSign className="w-10 h-10 text-primary" />
                                    </div>
                                </div>

                                {/* Earnings */}
                                <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] p-6 rounded-xl shadow-lg border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Earnings</p>
                                            {/*<h2 className="text-3xl font-semibold">*/}
                                            {/*    {user?.earning?.toLocaleString() ?? "0.00"} USDT*/}
                                            {/*</h2>*/}
                                        </div>
                                        <ArrowUpRight className="w-10 h-10 text-green-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <button className="flex items-center justify-between px-4 py-4 rounded-xl bg-primary/10 border border-primary text-white hover:bg-primary/20 transition">
                                    <span>Send</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                                <button className="flex items-center justify-between px-4 py-4 rounded-xl bg-primary/10 border border-primary text-white hover:bg-primary/20 transition">
                                    <span>Receive</span>
                                    <ArrowDownRight className="w-5 h-5" />
                                </button>
                                <button className="flex items-center justify-between px-4 py-4 rounded-xl bg-primary/10 border border-primary text-white hover:bg-primary/20 transition">
                                    <span>Transaction History</span>
                                    <ClipboardList className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Transaction Summary */}
                            <div className="bg-[#070D20] p-6 rounded-xl border border-gray-800 shadow">
                                <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
                                <ul className="divide-y divide-gray-800 text-sm text-gray-300">
                                    {/*{user?.transactions && user.transactions.length > 0 ? (*/}
                                    {/*    user.transactions.slice(0, 5).map((txn, index) => (*/}
                                    {/*        <li key={index} className="py-3 flex justify-between">*/}
                                    {/*            <span>{txn.description}</span>*/}
                                    {/*            <span className={*/}
                                    {/*                txn.status === "Completed" ? "text-green-400" :*/}
                                    {/*                    txn.status === "Pending" ? "text-yellow-300" :*/}
                                    {/*                        "text-gray-400"*/}
                                    {/*            }>*/}
                                    {/*                {txn.status}*/}
                                    {/*            </span>*/}
                                    {/*        </li>*/}
                                    {/*    ))*/}
                                    {/*) : (*/}
                                    {/*    <li className="py-3 text-gray-500 text-center">No recent transactions</li>*/}
                                    {/*)}*/}
                                </ul>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
