import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { getAuthToken } from "@/utils/auth";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

export default function SiteSettings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${baseUrl}settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setSettings(data.data);
            } catch (err) {
                console.error("Error fetching settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = (key: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
    };

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // const res = await fetch(`${baseUrl}settings`, {
            //     method: "PUT", // or PATCH depending on your API
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(settings),
            // });
            // const data = await res.json();
            alert("Settings updated successfully!");
        } catch (err) {
            console.error("Failed to update settings:", err);
            alert("Failed to update settings.");
        } finally {
            setSaving(false);
        }
    };

    const Input = ({ label, value, onChange }: any) => (
        <div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="bg-[#2D3748] text-white w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );

    const Toggle = ({ label, checked, onChange }: any) => (
        <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{label}</span>
            <button
                onClick={onChange}
                className={`w-12 h-6 flex items-center rounded-full px-1 transition-colors ${
                    checked ? "bg-green-500" : "bg-gray-600"
                }`}
            >
                <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        checked ? "translate-x-6" : ""
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b1120] text-white flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto py-12 px-6 lg:px-16">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-extrabold text-center mb-10">🛠 Edit Site Settings</h1>

                        {loading ? (
                            <p className="text-center text-gray-400">Loading settings...</p>
                        ) : settings ? (
                            <div className="bg-[#1f2937] p-8 rounded-xl shadow-lg space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input label="Site Name" value={settings.sitename} onChange={(val: any) => handleChange("sitename", val)} />
                                    <Input label="Currency" value={settings.currency} onChange={(val: any) => handleChange("currency", val)} />
                                    <Input label="Currency Symbol" value={settings.currency_sym} onChange={(val: any) => handleChange("currency_sym", val)} />
                                    <Input label="Telegram Channel" value={settings.telegram_channel} onChange={(val: any) => handleChange("telegram_channel", val)} />
                                    <Input label="Telegram Group" value={settings.telegram_group} onChange={(val: any) => handleChange("telegram_group", val)} />
                                    <Input label="Opening Time" value={settings.opening_time} onChange={(val: any) => handleChange("opening_time", val)} />
                                    <Input label="Closing Time" value={settings.closing_time} onChange={(val: any) => handleChange("closing_time", val)} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    <Toggle label="Login Enabled" checked={!!settings.login} onChange={() => handleToggle("login")} />
                                    <Toggle label="Registration Enabled" checked={!!settings.registration} onChange={() => handleToggle("registration")} />
                                    <Toggle label="Maintenance Mode" checked={!!settings.maintain} onChange={() => handleToggle("maintain")} />
                                </div>

                                <div className="mt-10 text-center">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-bold transition-all disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "💾 Update Settings"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-red-500">Failed to load settings.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
