import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type Preview = {
  marriageName: string;
  invitedEmail: string;
  invitedName: string;
  role: string;
};

type Props = {
  token: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function InvitationDecisionPage({ token, onAccept, onReject }: Props) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    void apiFetch<{ data: Preview }>(`/members/invitations/preview/${token}`)
      .then((response) => setPreview(response.data))
      .catch((error) => setMessage(error instanceof Error ? error.message : 'This invitation is not available.'))
      .finally(() => setLoading(false));
  }, [token]);

  const rejectInvitation = async () => {
    setWorking(true);
    setMessage('');
    try {
      await apiFetch(`/members/invitations/reject/${token}`, { method: 'POST' });
      onReject();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The invitation could not be rejected.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <main className="auth-main invitation-decision">
        <section className="auth-card invitation-card">
          <span className="auth-kicker">PRIVATE WEDDING INVITATION</span>
          <h1>You have been invited</h1>
          {loading ? (
            <p>Checking your invitation...</p>
          ) : preview ? (
            <>
              <p>
                {preview.invitedName || preview.invitedEmail} is invited to join{' '}
                <strong>{preview.marriageName}</strong> as a Manager.
              </p>
              <small>Invitation for {preview.invitedEmail}</small>
              <div className="invitation-actions">
                <button type="button" className="auth-submit" disabled={working} onClick={onAccept}>
                  Accept Invitation
                </button>
                <button type="button" className="auth-secondary" disabled={working} onClick={() => void rejectInvitation()}>
                  Reject Invitation
                </button>
              </div>
            </>
          ) : (
            <p>{message}</p>
          )}
          {message && preview && <p className="auth-error" role="alert">{message}</p>}
        </section>
      </main>
    </div>
  );
}
