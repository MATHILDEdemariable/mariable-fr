import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';

interface QRCode {
  id: string;
  title: string;
  url: string;
  qr_code_data: string;
  created_at: string;
}

interface QRCodeListProps {
  qrCodes: QRCode[];
  onDelete: (id: string) => Promise<void>;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({ qrCodes, onDelete }) => {
  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Aucun QR code pour le moment</p>
        <p className="text-sm mt-2">Créez votre premier QR code ci-dessus</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qrCode) => (
        <QRCodeDisplay key={qrCode.id} qrCode={qrCode} onDelete={onDelete} />
      ))}
    </div>
  );
};
