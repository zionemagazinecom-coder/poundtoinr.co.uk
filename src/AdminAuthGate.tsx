import { Lock, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase, type AdminSession, type AdminUserRow } from './lib/supabaseClient';

type AuthState =
  | { kind: 'loading' }
  | { kind: 'setup-missing' }
  | { kind: 'signed-out'; message?: string }
  | { kind: 'checking'; session: AdminSession }
  | { kind: 'denied'; email: string }
  | { admin: AdminUserRow; kind: 'allowed'; session: AdminSession };

export function AdminAuthGate({ children }: { children: (props: { admin: AdminUserRow; session: AdminSession; signOut: () => Promise<void> }) => ReactNode }) {
  return (
    <AdminAuthController mode="gate">
      {children}
    </AdminAuthController>
  );
}

export function AdminAuthPage() {
  return <AdminAuthController mode="login" />;
}

function AdminAuthController({
  children,
  mode,
}: {
  children?: (props: { admin: AdminUserRow; session: AdminSession; signOut: () => Promise<void> }) => ReactNode;
  mode: 'gate' | 'login';
}) {
  const [authState, setAuthState] = useState<AuthState>({ kind: 'loading' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Admin Login | PoundToINR';
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = existingRobots?.content;
    const robots = existingRobots ?? document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex,nofollow';
    if (!existingRobots) {
      document.head.appendChild(robots);
    }
    return () => {
      document.title = previousTitle;
      if (previousRobots && existingRobots) {
        existingRobots.content = previousRobots;
      } else if (!existingRobots) {
        robots.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthState({ kind: 'setup-missing' });
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }
      if (!data.session?.user) {
        setAuthState({ kind: 'signed-out' });
        return;
      }
      void checkAdminSession({ session: data.session, user: data.session.user });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setAuthState({ kind: 'signed-out' });
        return;
      }
      void checkAdminSession({ session, user: session.user });
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (mode === 'gate' && authState.kind === 'signed-out') {
      window.location.replace('/auth');
    }
    if (mode === 'login' && authState.kind === 'allowed') {
      window.location.replace('/admin');
    }
  }, [authState.kind, mode]);

  const checkAdminSession = async (adminSession: AdminSession) => {
    if (!supabase) {
      setAuthState({ kind: 'setup-missing' });
      return;
    }

    setAuthState({ kind: 'checking', session: adminSession });
    const userEmail = adminSession.user.email ?? '';
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id,email,role,is_active')
      .eq('id', adminSession.user.id)
      .eq('is_active', true)
      .eq('role', 'admin')
      .maybeSingle<{ email: string | null; id: string; is_active: boolean; role: 'admin' | 'editor' }>();

    if (!profileError && profileData) {
      setAuthState({
        admin: {
          email: profileData.email ?? userEmail,
          id: profileData.id,
          is_active: profileData.is_active,
          role: 'owner',
        },
        kind: 'allowed',
        session: adminSession,
      });
      return;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('id,email,role,is_active')
      .eq('is_active', true)
      .ilike('email', userEmail)
      .maybeSingle<AdminUserRow>();

    if (!error && data) {
      setAuthState({ admin: data, kind: 'allowed', session: adminSession });
      return;
    }

    const { data: rpcIsAdmin } = await supabase.rpc('is_admin');
    if (rpcIsAdmin === true) {
      setAuthState({
        admin: {
          email: userEmail,
          id: adminSession.user.id,
          is_active: true,
          role: 'owner',
        },
        kind: 'allowed',
        session: adminSession,
      });
      return;
    }

    if (error || !data) {
      setAuthState({ email: userEmail, kind: 'denied' });
      return;
    }
  };

  const signInWithPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setAuthState({ kind: 'setup-missing' });
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setFormError(error.message);
    }
  };

  const sendMagicLink = async () => {
    if (!supabase || !email) {
      setFormError('Email add karo, phir magic link send hoga.');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setIsSubmitting(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setAuthState({ kind: 'signed-out', message: 'Magic link email par send ho gaya. Link open karke admin unlock ho jayega.' });
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setAuthState({ kind: 'signed-out' });
  };

  if (authState.kind === 'allowed' && mode === 'gate' && children) {
    return <>{children({ admin: authState.admin, session: authState.session, signOut })}</>;
  }

  return (
    <div className="admin-auth-shell">
      <section className="admin-auth-card">
        <div className="admin-auth-icon">
          <Lock size={28} />
        </div>
        <p className="admin-auth-eyebrow">Private CMS</p>
        <h1>Admin login required</h1>
        {authState.kind === 'setup-missing' ? (
          <div className="admin-auth-alert">
            <strong>Supabase env missing hai.</strong>
            <p>Cloudflare Pages me `VITE_SUPABASE_URL` aur `VITE_SUPABASE_PUBLISHABLE_KEY` set karo, phir admin login active ho jayega.</p>
          </div>
        ) : null}
        {authState.kind === 'checking' || authState.kind === 'loading' ? <p className="admin-auth-muted">Session verify ho raha hai...</p> : null}
        {authState.kind === 'signed-out' && mode === 'gate' ? <p className="admin-auth-muted">Login page par redirect ho raha hai...</p> : null}
        {authState.kind === 'denied' ? (
          <div className="admin-auth-alert">
            <strong>Access denied</strong>
            <p>{authState.email || 'This account'} admin allowlist me nahi hai. Supabase `admin_users` table me email active karo.</p>
            <button type="button" onClick={signOut}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        ) : null}
        {authState.kind === 'signed-out' ? (
          <>
            {authState.message ? <div className="admin-auth-success">{authState.message}</div> : null}
            <form className="admin-auth-form" onSubmit={signInWithPassword}>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="admin@example.com" autoComplete="email" required />
              </label>
              <label>
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" autoComplete="current-password" />
              </label>
              {formError ? <p className="admin-auth-error">{formError}</p> : null}
              <button type="submit" disabled={isSubmitting || !email || !password}>
                <ShieldCheck size={16} />
                Login
              </button>
              <button type="button" className="admin-auth-secondary" disabled={isSubmitting || !email} onClick={sendMagicLink}>
                <Mail size={16} />
                Send magic link
              </button>
            </form>
          </>
        ) : null}
      </section>
    </div>
  );
}
