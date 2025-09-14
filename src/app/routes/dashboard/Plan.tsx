import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { getAuthToken } from "@/utils/auth";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = getAuthToken();
interface Plan {
    id: number;
    name: string;
    minimum: string;
    maximum: string;
    interest: string;
    interest_type: string;
}

export default function PlansPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const fields: (keyof typeof form)[] = ["name", "minimum", "maximum", "interest"];

    const [form, setForm] = useState({
        name: "",
        minimum: "",
        maximum: "",
        interest: "",
        interest_type: "percent"
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPlans(data.data || []);
        } catch (err) {
            console.error("Error fetching plans:", err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (plan: Plan | null = null) => {
        setEditingPlan(plan);
        setForm(plan || {
            name: "",
            minimum: "",
            maximum: "",
            interest: "",
            interest_type: "percent"
        });
        setModalOpen(true);
    };


    const closeModal = () => {
        setModalOpen(false);
        setEditingPlan(null);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const method = editingPlan ? "PUT" : "POST";
        const endpoint = editingPlan ? `${baseUrl}plans/${editingPlan?.id}` : `${baseUrl}plans`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                await fetchPlans();
                closeModal();
            } else {
                alert("Something went wrong!");
            }
        } catch (err) {
            console.error("Failed to save plan:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1120] text-white flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 py-12 px-6 lg:px-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">📦 Available System Plans</h1>
                            <button
                                onClick={() => openModal()}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-semibold"
                            >
                                ➕ Add New Plan
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {plans.map(plan => (
                                    <div key={plan.id} className="bg-[#1f2937] p-5 rounded-lg shadow-md space-y-2">
                                        <h2 className="text-xl font-bold">{plan.name}</h2>
                                        <p>Min: ${plan.minimum}</p>
                                        <p>Max: ${plan.maximum}</p>
                                        <p>Interest: {plan.interest} ({plan.interest_type})</p>
                                        <button
                                            onClick={() => openModal(plan)}
                                            className="mt-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1f2937] rounded-lg w-full max-w-md p-6 space-y-4">
                        <h2 className="text-2xl font-bold">
                            {editingPlan ? "Edit Plan" : "Add New Plan"}
                        </h2>

                        {fields.map(field => (
                            <div key={field}>
                                <label className="block text-sm mb-1 capitalize">{field}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded bg-[#2d3748] text-white"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm mb-1">Interest Type</label>
                            <select
                                name="interest_type"
                                value={form.interest_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-[#2d3748] text-white"
                            >
                                <option value="percent">Percent</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                            >
                                {editingPlan ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
