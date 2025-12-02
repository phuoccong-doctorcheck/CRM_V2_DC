import React from 'react';

interface SuccessAlertProps {
  message?: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ 
  message = "Lưu tài khoản người dùng thành công!" 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
   
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Circular background with checkmark */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        backgroundColor: '#e8f5e9',
        border: '3px solid #d0e8d0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        {/* Checkmark icon */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4caf50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      {/* Success message */}
      <p style={{
        fontSize: 18,
        fontWeight: 500,
        color: '#388e3c',
        margin: 0,
        textAlign: 'center',
       
      }}>
        {message}
      </p>
    </div>
  );
};

export default SuccessAlert;