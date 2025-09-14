import { JSX, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import {
     HandCoins, HandHeart, Activity, TrendingUp,
    Users, Target, DollarSign, Award, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from "recharts";

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin } = useUser();

    // Enhanced data processing
    const pieData = [
        { name: "Bids", value: admin?.sum_bids || 0, color: "#3B82F6" },
        { name: "Asks", value: admin?.sum_asks || 0, color: "#10B981" },
    ];

    const barData = [
        { name: "Total Users", value: admin?.users ?? 0, color: "#3B82F6" },
        { name: "Active Users", value: admin?.active_users ?? 0, color: "#10B981" },
        { name: "Total Bids", value: admin?.bids ?? 0, color: "#F59E0B" },
        { name: "Total Asks", value: admin?.asks ?? 0, color: "#EF4444" },
    ];

    const successRateData = [
        {
            name: "Bids",
            total: admin?.bids ?? 0,
            successful: admin?.success_bids ?? 0,
            rate: admin?.bids ? ((admin?.success_bids ?? 0) / admin.bids * 100).toFixed(1) : 0
        },
        {
            name: "Asks",
            total: admin?.asks ?? 0,
            successful: admin?.success_asks ?? 0,
            rate: admin?.asks ? ((admin?.success_asks ?? 0) / admin.asks * 100).toFixed(1) : 0
        },
    ];

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

    return (
        <div className="min-h-screen text-white flex bg-gradient-to-br from-[#050B1E] via-[#0A1628] to-[#050B1E]">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto">
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Header Section */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                            Admin Dashboard
                                        </h1>
                                        <p className="text-gray-400 text-lg">
                                            Comprehensive platform analytics and performance insights
                                        </p>
                                    </div>
                                    <div className="hidden md:flex items-center space-x-4">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-green-400 text-sm font-medium">System Online</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <MetricCard
                                    icon={<Users className="w-6 h-6" />}
                                    label="Total Users"
                                    value={admin?.users ?? 0}
                                    trend={+12.5}
                                    color="blue"
                                />
                                <MetricCard
                                    icon={<Activity className="w-6 h-6" />}
                                    label="Active Users"
                                    value={admin?.active_users ?? 0}
                                    trend={+8.2}
                                    color="green"
                                />
                                <MetricCard
                                    icon={<Target className="w-6 h-6" />}
                                    label="Total Orders"
                                    value={(admin?.bids ?? 0) + (admin?.asks ?? 0)}
                                    trend={+15.7}
                                    color="yellow"
                                />
                                <MetricCard
                                    icon={<DollarSign className="w-6 h-6" />}
                                    label="Total Volume"
                                    value={`${((admin?.sum_bids ?? 0) + (admin?.sum_asks ?? 0)).toLocaleString()}`}
                                    suffix="USDT"
                                    trend={+23.1}
                                    color="purple"
                                />
                            </div>

                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <DetailedStatCard
                                    icon={<HandHeart className="w-5 h-5" />}
                                    label="Total Bids"
                                    value={admin?.bids ?? 0}
                                    subValue={`${admin?.sum_bids ?? 0} USDT`}
                                    color="blue"
                                />
                                <DetailedStatCard
                                    icon={<HandCoins className="w-5 h-5" />}
                                    label="Total Asks"
                                    value={admin?.asks ?? 0}
                                    subValue={`${admin?.sum_asks ?? 0} USDT`}
                                    color="green"
                                />
                                <DetailedStatCard
                                    icon={<Award className="w-5 h-5" />}
                                    label="Successful Bids"
                                    value={admin?.success_bids ?? 0}
                                    subValue={`${admin?.bids ? ((admin?.success_bids ?? 0) / admin.bids * 100).toFixed(1) : 0}% Success Rate`}
                                    color="yellow"
                                />
                                <DetailedStatCard
                                    icon={<Award className="w-5 h-5" />}
                                    label="Successful Asks"
                                    value={admin?.success_asks ?? 0}
                                    subValue={`${admin?.asks ? ((admin?.success_asks ?? 0) / admin.asks * 100).toFixed(1) : 0}% Success Rate`}
                                    color="purple"
                                />
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                                {/* Enhanced Bar Chart */}
                                <div className="xl:col-span-2">
                                    <ChartContainer title="Platform Activity Overview" subtitle="Users and transaction metrics">
                                        <ResponsiveContainer width="100%" height={350}>
                                            <ReBarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px',
                                                        color: '#F9FAFB'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="url(#barGradient)"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#3B82F6" />
                                                        <stop offset="100%" stopColor="#1E40AF" />
                                                    </linearGradient>
                                                </defs>
                                            </ReBarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>

                                {/* Enhanced Pie Chart */}
                                <div>
                                    <ChartContainer title="Volume Distribution" subtitle="Bids vs Asks breakdown">
                                        <ResponsiveContainer width="100%" height={350}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={120}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                            stroke={entry.color}
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1F2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px',
                                                        color: '#F9FAFB'
                                                    }}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    iconType="circle"
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            </div>

                            {/* Success Rate Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ChartContainer title="Success Rate Analysis" subtitle="Bid and Ask completion rates">
                                    <div className="space-y-6">
                                        {successRateData.map((item, index) => (
                                            <div key={item.name} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300 font-medium">{item.name}</span>
                                                    <span className="text-white font-bold">{item.rate}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-1000 ${
                                                            index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-green-500 to-green-400'
                                                        }`}
                                                        style={{ width: `${item.rate}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-400">
                                                    <span>Successful: {item.successful}</span>
                                                    <span>Total: {item.total}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ChartContainer>

                                <ChartContainer title="Quick Stats" subtitle="Key performance indicators">
                                    <div className="grid grid-cols-2 gap-4">
                                        <QuickStatItem
                                            label="Avg. Bid Value"
                                            value={`${admin?.bids ? ((admin?.sum_bids ?? 0) / admin.bids).toFixed(2) : 0} USDT`}
                                            color="blue"
                                        />
                                        <QuickStatItem
                                            label="Avg. Ask Value"
                                            value={`${admin?.asks ? ((admin?.sum_asks ?? 0) / admin.asks).toFixed(2) : 0} USDT`}
                                            color="green"
                                        />
                                        <QuickStatItem
                                            label="User Activity"
                                            value={`${admin?.users ? ((admin?.active_users ?? 0) / admin.users * 100).toFixed(1) : 0}%`}
                                            color="yellow"
                                        />
                                        <QuickStatItem
                                            label="Total Success"
                                            value={`${((admin?.success_bids ?? 0) + (admin?.success_asks ?? 0)).toLocaleString()}`}
                                            color="purple"
                                        />
                                    </div>
                                </ChartContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Enhanced Metric Card Component
function MetricCard({
                        icon,
                        label,
                        value,
                        suffix = "",
                        trend,
                        color = "blue"
                    }: {
    icon: JSX.Element;
    label: string;
    value: string | number;
    suffix?: string;
    trend?: number;
    color?: string;
}) {
    const colorClasses = {
        blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
        green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
        yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400",
        purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-gray-400 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                    {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
                </p>
            </div>
        </div>
    );
}

// Detailed Stat Card Component
function DetailedStatCard({
                              icon,
                              label,
                              value,
                              subValue,
                              color = "blue"
                          }: {
    icon: JSX.Element;
    label: string;
    value: string | number;
    subValue: string;
    color?: string;
}) {
    const colorClasses = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green: "text-green-400 bg-green-500/10 border-green-500/20",
        yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    };

    return (
        <div className="bg-[#0F172A]/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
                <h3 className="text-gray-300 font-medium text-sm">{label}</h3>
            </div>
            <div className="space-y-1">
                <div className="text-2xl font-bold text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <div className="text-xs text-gray-400">{subValue}</div>
            </div>
        </div>
    );
}

// Chart Container Component
function ChartContainer({
                            title,
                            subtitle,
                            children
                        }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#0F172A]/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

// Quick Stat Item Component
function QuickStatItem({
                           label,
                           value,
                           color = "blue"
                       }: {
    label: string;
    value: string;
    color?: string;
}) {
    const colorClasses = {
        blue: "border-blue-500/30 bg-blue-500/10",
        green: "border-green-500/30 bg-green-500/10",
        yellow: "border-yellow-500/30 bg-yellow-500/10",
        purple: "border-purple-500/30 bg-purple-500/10",
    };

    return (
        <div className={`border ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-4 text-center`}>
            <div className="text-lg font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
        </div>
    );
}
