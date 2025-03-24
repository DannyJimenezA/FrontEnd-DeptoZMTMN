import React from 'react';

type AlertType = 'success' | 'error';

interface AlertNotificationProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ type, message, onClose }) => {
  const backgroundColor = type === 'success' ? '#4caf50' : '#f44336';

  return (
    <div
      style={{
        backgroundColor,
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
        {type === 'success' ? '✔️ Éxito' : '❌ Error'}:
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '20px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default AlertNotification;
