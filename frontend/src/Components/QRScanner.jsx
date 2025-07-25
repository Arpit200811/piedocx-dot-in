import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const navigate = useNavigate();

  const handleScan = (result, error) => {
    if (result?.text) {
      const url = new URL(result.text);
      const id = url.pathname.split('/').pop(); // extract :id from URL
      navigate(`/student/${id}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Scan Student QR Code</h2>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QRScanner;
