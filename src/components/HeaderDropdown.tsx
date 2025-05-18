
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemProps {
  label: string;
  description?: string;
  to: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string | ReactNode;
  children?: ReactNode;
  className?: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const HeaderDropdown: React.FC<DropdownProps> = ({
  label,
  children,
  className = "",
  active = false,
  href,
  onClick,
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

  // If href is provided, render a link instead of dropdown
  if (href) {
    return (
      <div className={`relative ${className}`}>
        <Link 
          to={href}
          className="flex items-center gap-1 font-medium px-4 py-2 rounded-md text-black hover:bg-wedding-cream transition"
          onClick={onClick}
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`} tabIndex={-1}>
      <button
        type="button"
        className={`flex items-center gap-1 font-medium px-4 py-2 rounded-md text-black focus:outline-none transition bg-transparent ${
          open || active ? "bg-wedding-cream" : ""
        }`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        {typeof label === "string" && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      <div
        className={`absolute right-0 top-[110%] shadow-xl rounded-xl bg-[#f8f6f0] min-w-[260px] z-50 transition-all border border-gray-200
        ${open ? "block animate-fade-in" : "hidden"}`}
      >
        {children}
      </div>
    </div>
  );
};

export const HeaderDropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => (
  <div className="p-4 space-y-3">{children}</div>
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
    className="block group px-2 py-2 rounded-md hover:bg-wedding-light focus:bg-wedding-light transition"
    tabIndex={0}
    aria-label={label}
  >
    <div className="font-semibold group-hover:underline">{label}</div>
    {description && (
      <div className="text-gray-600 mt-1 text-sm">{description}</div>
    )}
  </Link>
);
