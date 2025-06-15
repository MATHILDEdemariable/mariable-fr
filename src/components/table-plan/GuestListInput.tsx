
import React, { useState } from "react";

interface GuestListInputProps {
  guests: string[];
  onChange: (guests: string[]) => void;
}

const GuestListInput: React.FC<GuestListInputProps> = ({ guests, onChange }) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const lines = value
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);
    const updated = [...guests, ...lines];
    setValue("");
    onChange(updated);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[\r\n,;]/).map((n) => n.trim()).filter(Boolean);
      onChange([...guests, ...names]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-4 bg-white rounded p-3 shadow-sm border border-gray-100">
      <label className="block mb-2 font-semibold">Ajouter des invités</label>
      <textarea
        rows={3}
        className="w-full border border-gray-300 rounded px-2 py-1 mb-2 text-sm"
        placeholder="1 invité par ligne"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleAdd}
          className="bg-wedding-olive text-white px-3 py-1 rounded hover:bg-wedding-olive/90 text-sm"
        >
          Ajouter
        </button>
        <label className="inline-block cursor-pointer text-sm px-2 py-1">
          <input
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleImportCSV}
          />
          Importer CSV
        </label>
      </div>
      {guests.length > 0 && (
        <div className="text-xs text-gray-500">Invités enregistrés : {guests.length}</div>
      )}
    </div>
  );
};

export default GuestListInput;
