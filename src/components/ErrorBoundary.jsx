'use client';
import { Component } from 'react';

/**
 * Section-level error boundary. Wraps individual page sections so a crash
 * in one component (e.g. Portfolio) doesn't take down the entire page.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            `[ErrorBoundary] ${this.props.name || 'Section'} crashed:`,
            error,
            errorInfo
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        width: '100%',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        backgroundColor: '#0A0A0F',
                    }}
                >
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontFamily: 'Thedus-cl, sans-serif',
                            fontSize: '14px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {this.props.fallbackMessage || 'This section failed to load'}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
