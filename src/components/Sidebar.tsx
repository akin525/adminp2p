import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
    X,
    LayoutDashboard,
    CreditCard,
    PieChart,
    User,
    Settings,
    MessageSquare,
    LogOut,
    Database,
    BotMessageSquare,
    ChevronRight,
    Users,
    TrendingUp,
    Search,
    HelpCircle
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const navigationSections: NavSection[] = [
    {
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
        ]
    },
    {
        title: "Status Checks",
        items: [
            { name: "Ask Status", href: "/check-asks", icon: Search },
            { name: "Bid Status", href: "/check-bids", icon: Database },
            { name: "Peer Status", href: "/check-peers", icon: CreditCard }
        ]
    },
    {
        title: "Trading & Investment",
        items: [
            { name: "Plans", href: "/plans", icon: PieChart },
            { name: "Investments", href: "/investment", icon: TrendingUp }
        ]
    },
    {
        title: "Management",
        items: [
            { name: "All Users", href: "/users", icon: Users },
            { name: "BotCast", href: "/botcast", icon: BotMessageSquare }
        ]
    }
];

const accountSection: NavSection = {
    title: "Account",
    items: [
        { name: "Profile", href: "/profile", icon: User },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Support", href: "/support", icon: HelpCircle }
    ]
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(isOpen);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setSidebarOpen(false);
        onClose();
    };

    const isActiveRoute = (href: string) => {
        return location.pathname === href;
    };

    const NavLink = ({ item }: { item: NavItem }) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(item.href);

        return (
            <Link
                to={item.href}
                onClick={() => window.innerWidth < 1024 && handleClose()}
                className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
            >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                }`} />
                <span className="flex-1">{item.name}</span>

                {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                        {item.badge}
                    </span>
                )}

                {isActive && (
                    <ChevronRight className="ml-2 h-4 w-4 text-blue-400" />
                )}

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                )}
            </Link>
        );
    };

    const SectionTitle = ({ title }: { title: string }) => (
        <h3 className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
        </h3>
    );

    const NavSection = ({ section }: { section: NavSection }) => (
        <div className="mb-6">
            {section.title && <SectionTitle title={section.title} />}
            <div className="space-y-1">
                {section.items.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={handleClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl">

                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50 bg-slate-800/30">
                        <Link to="/" className="flex items-center group">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SP</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                                        SolanaP2P
                                    </p>
                                    <p className="text-xs text-slate-400 -mt-1">Connect</p>
                                </div>
                            </div>
                        </Link>

                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all lg:hidden"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        <nav className="space-y-2">
                            {navigationSections.map((section, index) => (
                                <NavSection key={index} section={section} />
                            ))}

                            <div className="pt-4 border-t border-slate-700/50">
                                <NavSection section={accountSection} />
                            </div>
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-700/50 p-4 bg-slate-800/30">
                        <Link
                            to="/login"
                            onClick={() => window.innerWidth < 1024 && handleClose()}
                            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl text-slate-300 hover:text-white hover:bg-red-600/10 hover:border-red-500/30 border border-transparent transition-all duration-200"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                            <span>Sign Out</span>
                        </Link>

                        {/* Version info */}
                        <div className="mt-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Version</span>
                                <span className="text-slate-400 font-mono">v2.1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
