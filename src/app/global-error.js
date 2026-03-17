'use client';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
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
                            fontSize: 'clamp(60px, 10vw, 150px)',
                            color: '#e03047',
                            lineHeight: 0.85,
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                        }}
                    >
                        Something Went Wrong
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '1rem',
                            maxWidth: '500px',
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                        }}
                    >
                        We hit an unexpected error. Please try again — if the problem
                        persists, reach out to us.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            fontFamily: 'Thedus, sans-serif',
                            fontWeight: 700,
                            fontSize: '14px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '16px 36px',
                            backgroundColor: '#e03047',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#a80000')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e03047')}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
