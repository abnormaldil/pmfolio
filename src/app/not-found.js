import Link from 'next/link';

export const metadata = {
    title: '404 — Page Not Found',
};

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#0A0A0F',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
            }}
        >
            <h1
                style={{
                    fontFamily: 'Humane-rg, sans-serif',
                    fontSize: 'clamp(120px, 20vw, 300px)',
                    color: '#e03047',
                    lineHeight: 0.85,
                    marginBottom: '0.5rem',
                }}
            >
                404
            </h1>
            <p
                style={{
                    fontFamily: 'Thedus, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(16px, 2vw, 24px)',
                    color: 'white',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                }}
            >
                Page Not Found
            </p>
            <p
                style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.95rem',
                    maxWidth: '400px',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                }}
            >
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                style={{
                    fontFamily: 'Thedus, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '16px 36px',
                    backgroundColor: '#e03047',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                }}
            >
                Go Home
            </Link>
        </div>
    );
}
