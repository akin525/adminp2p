import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Globe
} from "lucide-react";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getDeviceName = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const browser = (() => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    return "Unknown";
  })();

  return `${platform} ${browser}`;
};

const getDeviceIcon = () => {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad/.test(ua)) return Smartphone;
  if (/Tablet|iPad/.test(ua)) return Smartphone;
  return Monitor;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const device_name = getDeviceName();
  const DeviceIcon = getDeviceIcon();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, device_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (response.ok && data.success === true) {
        const token = data.token;

        rememberMe
            ? localStorage.setItem("authToken", token)
            : sessionStorage.setItem("authToken", token);

        toast.success(data.message || "Login successful");

        // Add a small delay for better UX
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#050A1A] via-[#0A1128] to-[#050B1E] flex">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg  " />

          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SolanaP2PConnect
                  </h1>
                  <p className="text-gray-400 text-sm">Admin Portal</p>
                </div>
              </div>
            </div>

            {/* Welcome Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Manage your platform with powerful tools and insights.
                Monitor transactions, users, and system performance all in one place.
              </p>

              {/* Features */}
              <div className="space-y-4 mt-8">
                {[
                  { icon: Shield, text: "Secure Authentication" },
                  { icon: Globe, text: "Real-time Analytics" },
                  { icon: CheckCircle, text: "Complete Control" }
                ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                ))}
              </div>
            </div>

            {/* Device Info */}
            <div className="mt-12 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <DeviceIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">Signing in from</p>
                  <p className="text-xs text-gray-400">{device_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SolanaP2PConnect
                </h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-gray-400">Enter your credentials to access the dashboard</p>
            </div>

            {/* Login Form */}
            <div className="bg-gradient-to-br from-[#0F1629] to-[#1A2332] rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${
                        emailFocused ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white placeholder-gray-400 transition-all duration-200 ${
                            emailFocused
                                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-gray-800/70'
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="admin@savebills.com"
                        required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${
                        passwordFocused ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white placeholder-gray-400 transition-all duration-200 ${
                            passwordFocused
                                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-gray-800/70'
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="Enter your password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <div className="relative">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                    />
                    <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                            rememberMe
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                    >
                      {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300 cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    }`}
                >
                  {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                  ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-300 font-medium">Secure Login</p>
                    <p className="text-xs text-blue-400/80 mt-1">
                      Your session is protected with enterprise-grade security
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                © 2025 SolanaP2PConnect. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
