import { useUser } from "@/context/UserContext.tsx";
import Sidebar from '../../../components/Sidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import { useState } from 'react';
import { User, DollarSign, Shield } from 'lucide-react';

export default function Profile() {
    const { user } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // For managing modal visibility

    if (!user) return <div className="text-white p-8">Loading...</div>;

    const handleProfileUpdate = () => {
        // Logic for updating profile, such as API call to save changes
        setModalOpen(false);
    };

    return (
        <div className="min-h-screen flex bg-[#050B1E] text-white">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h1 className="text-3xl font-bold mb-6">Profile</h1>

                        {/* Profile Photo and Basic Info */}
                        <section className="bg-[#070D20] p-6 rounded-2xl border border-gray-800 shadow space-y-6 text-center">
                            <div className="flex flex-col items-center">
                                {/* Profile Avatar */}
                                <img
                                    src={user.profile_photo_path || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg'}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                                />
                                <h2 className="text-2xl font-semibold mt-4">{user.name} </h2>
                                <p className="text-gray-400">{user.email}</p>
                                <p className="text-gray-400">{user.phone}</p>
                                {/* Edit Profile Button */}
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-full"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </section>

                        {/* Account Information */}
                        <section className="bg-[#070D20] p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <User className="text-blue-400" />
                                <h2 className="text-xl font-semibold">Account Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-400">Email Verified</label>
                                    <p>{user.email_verified ? "Verified" : "Not Verified"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Country</label>
                                    <p>{user.country}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Referral Code</label>
                                    <p>{user.ref_code}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Referred By</label>
                                    <p>{user.referral || "None"}</p>
                                </div>
                            </div>
                        </section>

                        {/* Balance and Earning */}
                        <section className="bg-[#070D20] p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="text-green-400" />
                                <h2 className="text-xl font-semibold">Financials</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-center">
                                <div>
                                    <label className="text-sm text-gray-400">Balance</label>
                                    <p className="text-2xl font-bold">${user.balance}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Earnings</label>
                                    <p className="text-2xl font-bold">${user.earning}</p>
                                </div>
                            </div>
                        </section>

                        {/* Telegram and Security */}
                        <section className="bg-[#070D20] p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-yellow-400" />
                                <h2 className="text-xl font-semibold">Security</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-400">Telegram ID</label>
                                    <p>{user.telegram_id || "Not Connected"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Telegram Verified</label>
                                    <p>{user.telegram_verified ? "Verified" : "Not Verified"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-400">Wallet Address (BEP)</label>
                                    <p className="break-words">{user.bep_address}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Modal for Editing Profile */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center">
                    <div className="bg-white text-black w-1/2 p-8 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600">Full Name</label>
                            <input type="text" defaultValue={user.name} className="w-full p-2 mt-2 border border-gray-300 rounded" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600">Email</label>
                            <input type="email" defaultValue={user.email} className="w-full p-2 mt-2 border border-gray-300 rounded" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600">Phone Number</label>
                            <input type="text" defaultValue={user.phone} className="w-full p-2 mt-2 border border-gray-300 rounded" />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleProfileUpdate}
                                className="bg-blue-500 text-white py-2 px-6 rounded-full"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="bg-gray-500 text-white py-2 px-6 rounded-full"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
