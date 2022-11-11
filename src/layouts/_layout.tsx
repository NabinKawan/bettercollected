import React from 'react';

import Logo from '@app/components/ui/logo';
import { MenuItems } from '@app/layouts/_layout-menu';
import { useBreakpoint } from '@app/lib/hooks/use-breakpoint';
import { useIsMounted } from '@app/lib/hooks/use-is-mounted';
import { useWindowScroll } from '@app/lib/hooks/use-window-scroll';

export function Header() {
    const windowScroll = useWindowScroll();
    const breakpoint = useBreakpoint();
    const isMounted = useIsMounted();

    return (
        <nav
            className={`fixed top-0 !z-30 flex w-full items-center justify-between px-4 transition-all duration-300 ltr:right-0 rtl:left-0 sm:px-6 lg:px-8 xl:px-10 3xl:px-12 ${
                isMounted && windowScroll.y > 10
                    ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
                    : 'h-16 border-b-[0.5px] border-neutral-100 dark:border-neutral-700 bg-white dark:bg-dark sm:h-24'
            }`}
        >
            <div className="flex items-center">
                <Logo />
                {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) === -1 && <MenuItems />}
            </div>
        </nav>
    );
}

interface LayoutProps {
    className?: string;
}

export default function Layout({ children, className = '' }: React.PropsWithChildren<LayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-dark z-20">
            <Header />
            <main className={`relative mb-0 px-4 pt-24 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 xl:px-10 3xl:px-12 ${className}`}>
                {children}
                <div className="pointer-events-none absolute overflow-hidden inset-0 !z-10">
                    <div className="absolute top-[60%] left-[-100px] w-[359px] h-[153px] bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 rotate-90 blur-dashboardBackground opacity-[20%]" />
                    <div className="absolute top-[35%] left-[65%] w-[765px] h-[765px] bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400 blur-dashboardBackground opacity-[15%]" />
                    <div className="absolute bottom-0 left-[50%] w-[599px] h-[388px] bg-gradient-to-r from-rose-200 via-rose-300 to-rose-400 rotate-180 blur-dashboardBackground opacity-[20%]" />
                </div>
            </main>
        </div>
    );
}