import { Toaster } from 'sonner';

/**
 * ToastProvider Component
 * Provides the toast notification container for the app
 * Place this near the root of the component tree
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          fontSize: '14px',
          borderRadius: '12px',
          padding: '12px 16px',
        },
      }}
    />
  );
}
