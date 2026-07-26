import { useEffect, useState } from 'react';

const storageKey = 'poundtoinr-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(storageKey) !== 'accepted');
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="region" aria-label="Cookie notice">
      <div>
        <strong>Privacy-first cookies</strong>
        <p>PoundToINR currently uses essential site storage only. Optional analytics or advertising cookies will need consent before they are enabled.</p>
      </div>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(storageKey, 'accepted');
          } catch {
            // Ignore storage failures and only hide the notice for this session.
          }
          setVisible(false);
        }}
      >
        Accept essential
      </button>
    </div>
  );
}
