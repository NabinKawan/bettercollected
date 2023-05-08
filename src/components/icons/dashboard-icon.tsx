import React from 'react';

export function DashboardIcon(props: React.SVGAttributes<{}>) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeLinecap="round" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeLinecap="round" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeLinecap="round" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeLinecap="round" />
        </svg>
    );
}
