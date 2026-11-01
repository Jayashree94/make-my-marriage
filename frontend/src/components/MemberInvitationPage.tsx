import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type Member = {
  userId: number;
  displayName: string;
  email: string;
  role: string;
  status: string;
};

type Invitation = {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  status: string;
  expiresAt: string;
  sentAt?: string;
  acceptedAt?: string;
};

type MembersResponse = {
  marriageId: number;
  marriageName: string;
  currentRole: string;
  members: Member[];
  invitations: Invitation[];
};

type Props = {
  accountName?: string;
  onHome: () => void;
  onLogout: () => void;
};

const roleLabel = (role: string) =>
  role.replace('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function MemberInvitationPage({ accountName, onHome, onLogout }: Props) {
  const [data, setData] = useState<MembersResponse | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MANAGER');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<{ success: boolean; data: MembersResponse }>('/members');
      setData(response.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setMessage('');
    setSending(true);
    try {
      await apiFetch<{ success: boolean }>('/members/invitations', {
        method: 'POST',
        body: JSON.stringify({ displayName, email, role }),
      });
      setDisplayName('');
      setEmail('');
      setRole('MANAGER');
      setMessage('Invitation sent successfully.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Invitation could not be sent.');
    } finally {
      setSending(false);
    }
  };

  const resend = async (id: string) => {
    try {
      await apiFetch(`/members/invitations/${id}/resend`, { method: 'POST' });
      setMessage('Invitation resent.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not resend invitation.');
    }
  };

  const revoke = async (id: string) => {
    try {
      await apiFetch(`/members/invitations/${id}`, { method: 'DELETE' });
      setData((current) => current ? {
        ...current,
        invitations: current.invitations.filter((invitation) => invitation.id !== id),
      } : current);
      setMessage('Invitation revoked.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not revoke invitation.');
    }
  };

  const sentCount = data?.invitations.filter((item) => ['PENDING', 'SENT', 'FAILED'].includes(item.status)).length ?? 0;
  const acceptedCount = data?.invitations.filter((item) => item.status === 'ACCEPTED').length ?? 0;
  const isAdmin = data?.currentRole?.toUpperCase() === 'ADMIN';

  const revokeMember = async (userId: number) => {
    try {
      await apiFetch(`/members/${userId}`, { method: 'DELETE' });
      setData((current) => current ? {
        ...current,
        members: current.members.filter((member) => member.userId !== userId),
      } : current);
      setMessage('Member access revoked.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not revoke member.');
    }
  };

  return (
    <div className="members-page">
      <header className="members-topbar">
        <button type="button" className="members-brand" onClick={onHome}>
          <span>✦</span><strong>MAKE MY MARRIAGE</strong>
        </button>
        <nav aria-label="Member navigation">
          <button type="button" onClick={onHome}>HOME</button>
          <button type="button" className="active">MEMBER INVITATIONS</button>
        </nav>
        <div><span>{accountName || 'Account'} · {data?.currentRole || 'Manager'}</span><button type="button" onClick={onLogout}>Logout</button></div>
      </header>

      <aside className="members-sidebar">
        <span className="members-sidebar-mark">✦</span>
        <strong>Family &amp; Co-Hosts</strong>
        <small>{data?.marriageName || 'PRIVATE WEDDING WORKSPACE'}</small>
        <button type="button" className="active">INVITATION LEDGER</button>
        <button type="button">PERMISSION MATRIX</button>
        <button type="button">ROLE DELEGATION</button>
      </aside>

      <main className="members-main">
        <div className="members-heading">
          <div>
            <span className="members-kicker">ADMIN SUITE / FAMILY DELEGATION / ACCESS CONTROL LEDGER</span>
            <h1>Family &amp; Member Access Control</h1>
            <p>Issue private invitations, delegate ceremony responsibilities, and revoke access securely.</p>
          </div>
          {isAdmin && (
            <button type="button" className="members-dispatch" onClick={() => document.getElementById('invite-form')?.scrollIntoView({ behavior: 'smooth' })}>
              ✉ &nbsp; INVITE MEMBER
            </button>
          )}
        </div>

        {message && <div className="members-message" role="status">{message}</div>}

        <section className="members-metrics">
          <article><small>ACTIVE FAMILY MEMBERS</small><strong>{data?.members.filter((item) => item.status === 'ACTIVE').length ?? 0}</strong></article>
          <article><small>PENDING INVITATIONS</small><strong>{sentCount}</strong></article>
          <article><small>ACCEPTED THIS WEEK</small><strong>{acceptedCount}</strong></article>
          <article><small>SECURITY STATUS</small><strong>Encrypted</strong></article>
        </section>

        <section className="members-content-grid">
          {isAdmin && <form id="invite-form" className="member-compose" onSubmit={invite}>
            <span className="members-kicker">DIGITAL INVITATION COMMISSION</span>
            <h2>Invite a family member or co-host</h2>
            <label><span>MEMBER NAME</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="e.g. Ananya Sharma" /></label>
            <label><span>EMAIL ADDRESS</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="member@example.com" /></label>
            <label>
              <span>ACCESS LEVEL</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <button type="submit" disabled={sending}>{sending ? 'SENDING...' : 'SEND SECURE INVITATION'}</button>
          </form>}

          <section className="member-directory">
            <div className="member-directory-head"><div><span className="members-kicker">ACCESS LEDGER</span><h2>Members &amp; Invitations</h2></div></div>
            {loading ? <p className="members-empty">Loading access ledger…</p> : (
              <div className="member-table">
                <div className="member-table-head"><span>MEMBER</span><span>ROLE</span><span>STATUS</span><span>ACTIONS</span></div>
                {data?.members.map((member) => (
                  <div className="member-table-row" key={member.userId}>
                    <div><b>{member.displayName}</b><small>{member.email}</small></div>
                    <span>{roleLabel(member.role)}</span>
                    <span className="status-badge active">{member.status}</span>
                    <span>
                      {isAdmin && member.status === 'ACTIVE' && (
                        <button type="button" onClick={() => void revokeMember(member.userId)}>Revoke</button>
                      )}
                    </span>
                  </div>
                ))}
                {data?.invitations.map((invitation) => (
                  <div className="member-table-row" key={invitation.id}>
                    <div><b>{invitation.displayName || invitation.email}</b><small>{invitation.email}</small></div>
                    <span>{roleLabel(invitation.role)}</span>
                    <span className={`status-badge ${invitation.status.toLowerCase()}`}>{invitation.status}</span>
                    <span className="member-actions">
                      {isAdmin && invitation.status !== 'ACCEPTED' && invitation.status !== 'REVOKED' && (
                        <>
                          <button type="button" onClick={() => void resend(invitation.id)}>Resend</button>
                          <button type="button" onClick={() => void revoke(invitation.id)}>Revoke</button>
                        </>
                      )}
                    </span>
                  </div>
                ))}
                {!loading && !data?.members.length && !data?.invitations.length && <p className="members-empty">No members or invitations yet.</p>}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
