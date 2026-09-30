import React, { useEffect, useState, useRef } from 'react';

/**
 * GoogleSignInButton — Renders a "Continue with Google" button matching Form Saathi styling.
 * Integrates directly with Google Identity Services (gsi/client).
 *
 * Props:
 *  - onSuccess: (credential) => void
 *  - onError: (errorMessage) => void
 *  - isLoading: boolean
 */
const GoogleSignInButton = ({ onSuccess, onError, isLoading }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonDivRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!clientId) {
      return;
    }

    // Load Google Identity Services script if not present
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Google Identity Services SDK');
      if (onError) onError('Failed to load Google Sign-In SDK.');
    };
    document.body.appendChild(script);
  }, [clientId]);

  const handleCredentialResponse = async (response) => {
    if (response && response.credential) {
      if (onSuccess) onSuccess(response.credential);
    } else {
      if (onError) onError('Google Sign-In returned no credentials.');
    }
  };

  // Initialize and trigger Google Sign-In popup or prompt
  const triggerGoogleSignIn = () => {
    if (!clientId) {
      if (onError) {
        onError('Google Client ID (VITE_GOOGLE_CLIENT_ID) is not configured in environment.');
      }
      return;
    }

    if (!window.google?.accounts?.id) {
      if (onError) onError('Google Sign-In service is initializing. Please try again.');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      // Prompt Google account selection overlay / One-Tap
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt overlay is blocked or dismissed, render GIS fallback button directly
          if (buttonDivRef.current) {
            buttonDivRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonDivRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'pill'
            });
          }
        }
      });
    } catch (err) {
      console.error('Google Sign-In initialization error:', err);
      if (onError) onError('Unable to start Google Sign-In: ' + err.message);
    }
  };

  return (
    <div className="w-100">
      <div ref={buttonDivRef} className="d-none"></div>

      <button
        type="button"
        className="btn btn-outline-secondary rounded-pill w-100 py-2.5 px-4 d-flex align-items-center justify-content-center fw-medium bg-white shadow-sm border hover-lift"
        onClick={triggerGoogleSignIn}
        disabled={isLoading}
        style={{ transition: 'all 0.2s ease-in-out', minHeight: '46px' }}
      >
        <svg className="me-2" width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span className="text-dark fw-bold">Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleSignInButton;
