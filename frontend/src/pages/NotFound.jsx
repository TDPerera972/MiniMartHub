import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <Ghost size={64} style={{ color: '#172b78', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Page not found</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        style={{
          backgroundColor: '#172b78',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
