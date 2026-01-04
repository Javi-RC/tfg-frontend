import React from 'react';
import { FileText, Upload } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';

/**
 * EmptyState Component
 * Displays when no CV is found
 */
export default function EmptyState({ error, onUpload }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }} role="alert">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true">
          <FileText size={64} color="#666" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
          No CV Found
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          {error || 'Upload your CV to get started'}
        </p>
        <PrimaryButton onClick={onUpload} aria-label="Open CV upload dialog" leftIcon={<Upload size={18} />}>
          Upload CV
        </PrimaryButton>
      </div>
    </div>
  );
}
