import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    X,
    LayoutDashboard,
    CreditCard,
    PieChart,
    User,
    Settings,
    MessageSquare,
    LogOut, Database, BotMessageSquare,
} from "lucide-react";

export default function Sidebar({
                                    isOpen,
                                    onClose,
                                }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(isOpen);

    useEffect(() => {
        setSidebarOpen(isOpen);
    }, [isOpen]);

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r transition-transform duration-300 ease-in-out bg-[#0A1128] lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
                    <Link to="/" className="flex items-center">
                        <p className="font-bold text-3xl">SolanaP2PConnect</p>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-3 py-4">
                    <div className="space-y-1">
                        <Link
                            to="/dashboard"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-[#0A1128] text-white"
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
                            Dashboard
                        </Link>
                        <Link
                            to="/check-asks"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <Database className="mr-3 h-5 w-5 text-gray-400" />
                            Check-Ask-Status
                        </Link>
                        <Link
                            to="/check-bids"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <Database className="mr-3 h-5 w-5 text-gray-400" />
                            Check-Bid-Status
                        </Link>
                        <Link
                            to="/check-peers"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
                            Check-Peer-Status
                        </Link>

                        <Link
                            to="/plans"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <PieChart className="mr-3 h-5 w-5 text-gray-400" />
                            Plans
                        </Link>
                        <Link
                            to="/investment"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <PieChart className="mr-3 h-5 w-5 text-gray-400" />
                            Investments
                        </Link>
                        <Link
                            to="/users"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <User className="mr-3 h-5 w-5 text-gray-400" />
                            All-Users
                        </Link>
                        <Link
                            to="/botcast"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                        >
                            <BotMessageSquare className="mr-3 h-5 w-5 text-gray-400" />
                            BotCast
                        </Link>

                    </div>

                    <div className="mt-8">
                        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Account
                        </h3>
                        <div className="mt-2 space-y-1">
                            <Link
                                to="/profile"
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                            >
                                <User className="mr-3 h-5 w-5 text-gray-400" />
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                            >
                                <Settings className="mr-3 h-5 w-5 text-gray-400" />
                                Site-Settings
                            </Link>
                            <Link
                                to="/support"
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                            >
                                <MessageSquare className="mr-3 h-5 w-5 text-gray-400" />
                                Support
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
                    <Link
                        to="/login"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#070D20] hover:text-white"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
