
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Logo } from "./Logo";

function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-lg">Mariable</span>
        </Link>
        <nav className="items-center hidden lg:flex">
          <Link to="/" className="text-lg font-medium px-4 py-2 rounded hover-scale">
            Accueil
          </Link>
          <Link to="/professionnels" className="text-lg font-medium px-4 py-2 rounded hover-scale">
            Professionnels
          </Link>
          <div className="relative group">
            <button className="text-lg font-medium px-4 py-2 rounded hover-scale">
              Services
            </button>
            <div className="absolute hidden group-hover:block bg-white border rounded shadow-lg z-20 min-w-[220px] mt-1">
              <Link to="/services/prestataires" className="block px-4 py-2 hover:bg-gray-50">Prestataires</Link>
              <Link to="/services/planification" className="block px-4 py-2 hover:bg-gray-50">Planification</Link>
              <Link to="/services/budget" className="block px-4 py-2 hover:bg-gray-50">Budget</Link>
              <Link to="/services/conseils" className="block px-4 py-2 hover:bg-gray-50">Conseils</Link>
              <Link to="/services/jour-j" className="block px-4 py-2 hover:bg-gray-50">Jour-J Planning</Link>
            </div>
          </div>
          <Link to="/guide-mariable" className="text-lg font-medium px-4 py-2 rounded hover-scale">
            Guide Mariable
          </Link>
          <ModeToggle />
        </nav>
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" className="p-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center gap-2 pb-6">
              <Logo />
              <span className="font-semibold text-lg">Mariable</span>
            </Link>
            <nav className="grid gap-6">
              <Link to="/" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Accueil
              </Link>
              <Link to="/professionnels" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Professionnels
              </Link>
              <Link to="/services/prestataires" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Prestataires
              </Link>
              <Link to="/services/planification" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Planification
              </Link>
              <Link to="/services/budget" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Budget
              </Link>
              <Link to="/services/conseils" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Conseils
              </Link>
              <Link to="/services/jour-j" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Jour-J Planning
              </Link>
              <Link to="/guide-mariable" className="text-lg font-medium px-4 py-2 rounded hover-scale">
                Guide Mariable
              </Link>
              <ModeToggle />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
