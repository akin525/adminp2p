import { useState } from "react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: "/signup", label: "Sign Up" },
    { to: "/login", label: "Sign In" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <button className="text-white hover:text-primary transition">
          <Menu size={24} />
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] bg-background border-l border-gray-800 p-0"
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <nav className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-white hover:text-primary transition py-3 px-4 text-lg border-b border-gray-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
