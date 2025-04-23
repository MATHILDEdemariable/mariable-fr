
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemProps {
  label: string;
  description?: string;
  to: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const HeaderDropdown: React.FC<DropdownProps> = ({
  label,
  children,
  className = "",
  active = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className={`flex items-center gap-1 font-medium px-5 py-2 rounded-md text-black focus:outline-none transition bg-transparent ${
          open || active ? "bg-wedding-cream" : ""
        }`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        {typeof label === 'string' && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      <div
        className={`absolute left-0 top-[110%] shadow-xl rounded-xl bg-[#f8f6f0] min-w-[320px] z-50 transition-all
        ${
          open
            ? "block animate-fade-in"
            : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const HeaderDropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => (
  <div className="p-6 space-y-5">{children}</div>
);

export const HeaderDropdownItem: React.FC<ItemProps> = ({
  label,
  description,
  to,
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="block group"
    tabIndex={0}
    aria-label={label}
  >
    <div className="font-semibold group-hover:underline">{label}</div>
    {description && (
      <div className="text-gray-600 mt-1 text-sm">{description}</div>
    )}
  </Link>
);
