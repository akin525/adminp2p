import { useState } from "react";
import {Link, useNavigate} from "react-router";
import { Menu, ChevronDown, Search } from "lucide-react";
import { useUser } from "@/context/UserContext.tsx";

export default function DashboardHeader({
                                          setSidebarOpen,
                                        }: {
  setSidebarOpen: (open: boolean) => void;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate("/login");
  };
  // const getCountryCode = (countryName: string | undefined) => {
  //   if (!countryName) return "us"; // default fallback
  //   const countryMap: { [key: string]: string } = {
  //     "United States": "us",
  //     "Nigeria": "ng",
  //     "United Kingdom": "gb",
  //     "Canada": "ca",
  //     "Germany": "de",
  //     "France": "fr",
  //     // Add more as needed
  //   };
  //   return countryMap[countryName] || "us";
  // };

  // const countryCode = getCountryCode(user?.country);

  return (
      <header className="border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            {/* Sidebar Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                      id="search"
                      type="search"
                      placeholder="Search transactions, wallets..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-[#0A1128] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-0 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="relative ml-3">
                <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    x
                  </div>
                  <div className="ml-2 text-left hidden sm:block">
                    <div className="text-sm font-medium">
                      {user?.username}
                    </div>
                    {/*<div className="flex items-center text-xs text-gray-400 mt-0.5">*/}
                    {/*  <img*/}
                    {/*      src={`https://flagcdn.com/w20/${countryCode}.png`}*/}
                    {/*      alt=""*/}
                    {/*      className="h-3 w-5 mr-1 object-cover rounded-sm"*/}
                    {/*  />*/}
                    {/*  {user?.country || "Unknown Country"}*/}
                    {/*</div>*/}
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#0A1128] ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#070D20] hover:text-white"
                            role="menuitem"
                        >
                          Your Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#070D20] hover:text-white"
                            role="menuitem"
                        >
                          Settings
                        </Link>
                        <Link
                            to="/dashboard/support"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#070D20] hover:text-white"
                            role="menuitem"
                        >
                          Support
                        </Link>
                        <div className="border-t border-gray-800"></div>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#070D20] hover:text-white"
                            role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
}
