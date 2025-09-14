import { useEffect, useState } from "react";
import { HandHeart } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
import Sidebar from "../../../components/Sidebar";
import { getAuthToken } from "@/utils/auth";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

interface Plan {
  id: number;
  name: string;
  minimum: number;
  maximum: number;
  interest: number;
  interest_type: string;
}

export default function CreateBid() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canBid, setCanBid] = useState(false);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!token || !baseUrl) return;

    const fetchPlan = async () => {
      try {
        const response = await fetch(`${baseUrl}plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setPlan(data.data[0]);
        } else {
          throw new Error(data.message || "Failed to fetch plan");
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
        toast.error("Failed to load plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  useEffect(() => {
    const checkBidTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const isMorningBidTime = hour === 9 && minute >= 0 && minute <= 30;
      const isEveningBidTime = hour === 21 && minute >= 0 && minute <= 30;

      setCanBid(isMorningBidTime || isEveningBidTime);
    };

    const calculateCountdown = () => {
      const now = new Date();
      let nextBidTime = new Date(now);

      if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
        nextBidTime.setHours(21, 0, 0, 0);
        if (now.getHours() > 21 || (now.getHours() === 21 && now.getMinutes() > 30)) {
          nextBidTime.setDate(now.getDate() + 1);
          nextBidTime.setHours(9, 0, 0, 0);
        }
      } else if (now.getHours() < 21 || (now.getHours() === 21 && now.getMinutes() > 30)) {
        nextBidTime.setHours(21, 0, 0, 0);
      }

      const diffMs = nextBidTime.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
      );
    };

    checkBidTime();
    calculateCountdown();

    const interval = setInterval(() => {
      checkBidTime();
      calculateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData({ amount: String(amount) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canBid) {
      toast.error("Bidding is only allowed between 9:00-9:30 AM and 9:00-9:30 PM");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!plan) {
      toast.error("No active plan available.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: plan.id,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Bid Successful");
        setFormData({ amount: "" });
      } else {
        toast.error(data.message || "Failed to submit bid.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during bidding.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateAmountOptions = () => {
    return Array.from({ length: 15 }, (_, i) => (i + 1) * 10);
  };

  return (
      <div className="min-h-screen flex text-white bg-[#050B1E]">
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            ></div>
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto py-10 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#070D20] rounded-xl p-8 border border-gray-800 shadow">
              <div className="flex items-center mb-6">
                <HandHeart className="w-6 h-6 text-pink-500 mr-3" />
                <h1 className="text-2xl font-semibold">Create Donation Bid</h1>
              </div>

              {loading ? (
                  <p className="text-gray-400 mb-6">Loading plan...</p>
              ) : plan ? (
                  <div className="bg-[#0A1128] border border-pink-600 rounded-2xl p-6 mb-8 shadow-[0_0_20px_#d946ef33]">
                    <h2 className="text-2xl font-bold text-pink-500 mb-4">{plan.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white">
                      <div className="bg-[#141A31] p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 mb-1">Minimum</p>
                        <p className="text-pink-400 text-lg font-semibold">{plan.minimum} USDT</p>
                      </div>

                      <div className="bg-[#141A31] p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 mb-1">Maximum</p>
                        <p className="text-pink-400 text-lg font-semibold">{plan.maximum} USDT</p>
                      </div>

                      <div className="bg-[#141A31] p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 mb-1">Return</p>
                        <p className="text-pink-400 text-lg font-semibold">
                          {plan.interest}% {plan.interest_type}
                        </p>
                      </div>
                    </div>
                  </div>
              ) : (
                  <p className="text-red-400 mb-6">Failed to load plan details.</p>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                {plan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {generateAmountOptions().map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => handleAmountSelect(amount)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                                    formData.amount === String(amount)
                                        ? "bg-pink-600 text-white border-pink-500"
                                        : "bg-[#0A1128] text-gray-300 border-gray-700 hover:border-pink-400"
                                }`}
                            >
                              {amount} USDT
                            </button>
                        ))}
                      </div>
                    </div>
                )}

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Or enter custom amount
                  </label>
                  <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="1"
                      className="mt-1 block w-full px-4 py-2 bg-[#0A1128] border border-gray-700 rounded-md text-white focus:ring focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* Countdown Timer */}
                {!canBid && (
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-sm mb-2">
                        Next Bidding Window Opens In:
                      </p>
                      <div className="text-pink-500 text-2xl font-bold tracking-widest">
                        {countdown}
                      </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting || !canBid}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                        submitting || !canBid
                            ? "bg-pink-400 cursor-not-allowed"
                            : "bg-pink-600 hover:bg-pink-700"
                    }`}
                >
                  {submitting ? "Submitting..." : canBid ? "Submit Bid" : "Bidding Closed"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
  );
}
