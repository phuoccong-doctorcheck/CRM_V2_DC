import React from 'react';

interface ErrorAlertProps {
  message?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message = "Có lỗi xảy ra! Vui lòng thử lại." 
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
      {/* Circular background with X mark */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        backgroundColor: '#ffebee',
        border: '3px solid #ffcdd2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        {/* X icon */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f44336"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

      {/* Error message */}
      <p style={{
        fontSize: 18,
        fontWeight: 500,
        color: '#c62828',
        margin: 0,
        textAlign: 'center',
        
      }}>
        {message}
      </p>
    </div>
  );
};

export default ErrorAlert;