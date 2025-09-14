import { useState } from "react";
import { getAuthToken } from "@/utils/auth";
import { useUser } from "@/context/UserContext.tsx";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();

const generateAmountOptions = () => {
  const options = [];
  for (let i = 10; i <= 150; i += 10) {
    options.push(i);
  }
  return options;
};

export default function AskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [balSource, setBalSource] = useState("balance");
  const [loading, setLoading] = useState(false);
  const [askSuccess, setAskSuccess] = useState(false);
  const { user } = useUser();

  const handleAskRequest = async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const isMorningTime =
        currentHour === 9 && currentMinutes >= 0 && currentMinutes <= 30;
    const isEveningTime =
        currentHour === 21 && currentMinutes >= 0 && currentMinutes <= 30;

    if (!isMorningTime && !isEveningTime) {
      toast.error("Ask requests are allowed only between 9:00–9:30 AM and 9:00–9:30 PM.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bal_source: balSource,
          bep_address: user?.bep_address,
          amount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAskSuccess(true);
        toast.success("Ask request successfully created!");
      } else {
        toast.error(data.message || "Failed to create ask request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  const amountOptions = generateAmountOptions();

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
              <h1 className="text-2xl font-bold mb-6">Create Ask Request</h1>

              <div className="space-y-6">
                {/* Wallet Source Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div
                      onClick={() => setBalSource("balance")}
                      className={`p-4 rounded-xl cursor-pointer transition ${
                          balSource === "balance" ? "bg-[#0A1128]" : "bg-[#1A2433]"
                      } border border-gray-700 shadow hover:shadow-lg`}
                  >
                    <p className="text-gray-400">Balance</p>
                    <p className="text-white text-2xl font-semibold">
                      {user?.balance} USDT
                    </p>
                  </div>
                  <div
                      onClick={() => setBalSource("earning")}
                      className={`p-4 rounded-xl cursor-pointer transition ${
                          balSource === "earning" ? "bg-[#0A1128]" : "bg-[#1A2433]"
                      } border border-gray-700 shadow hover:shadow-lg`}
                  >
                    <p className="text-gray-400">Earnings</p>
                    <p className="text-white text-2xl font-semibold">
                      {user?.earning} USDT
                    </p>
                  </div>
                </div>

                {/* Amount Selection Grid */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Select Amount (or enter manually)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                    {amountOptions.map((amt) => (
                        <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                                amount === amt
                                    ? "bg-blue-600 text-white border-blue-500"
                                    : "bg-[#1A2433] text-gray-300 border-gray-700 hover:bg-[#2A3444]"
                            }`}
                        >
                          {amt} USDT
                        </button>
                    ))}
                  </div>

                  <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Or enter a custom amount"
                      className="p-4 w-full rounded-lg bg-[#0A1128] border border-gray-700 text-white"
                  />
                </div>

                {/* Notice about allowed times */}
                <div className="text-yellow-400 text-sm text-center mb-4">
                  Ask requests are only allowed between 9:00–9:30 AM and 9:00–9:30 PM.
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleAskRequest}
                    disabled={loading}
                    className="w-full py-3 text-lg"
                >
                  {loading ? "Processing..." : "Submit Ask Request"}
                </Button>

                {askSuccess && (
                    <p className="text-green-500 mt-4 text-center">
                      Your ask request has been created successfully!
                    </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}
