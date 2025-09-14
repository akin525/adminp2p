import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {getAuthToken} from "@/utils/auth.tsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = getAuthToken();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}verify-telegram-otp`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                toast.success(data.message || "Verification successful");
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Invalid OTP");
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#050A1A] text-white">
            <form onSubmit={handleSubmit} className="bg-[#070D20] p-8 rounded-xl w-full max-w-sm space-y-4 border border-gray-700">
                <h2 className="text-xl font-bold">Enter OTP</h2>
                <input
                    type="text"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0A1128] text-white border border-gray-700 rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-primary text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </form>
        </div>
    );
}
