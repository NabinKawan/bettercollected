import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { Tab, TabItem, TabPanel, TabPanels } from '@app/components/ui/tab';
import { useBreakpoint } from '@app/lib/hooks/use-breakpoint';
import { useClickAway } from '@app/lib/hooks/use-click-away';
import { useIsMounted } from '@app/lib/hooks/use-is-mounted';
import { authApi } from '@app/store/auth/api';
import { useAppSelector } from '@app/store/hooks';

interface TabMenuItem {
    title: React.ReactNode;
    path: string;
    icon?: any;
}

interface ParamTabTypes {
    tabMenu: TabMenuItem[];
    children: React.ReactChild[];
    isRouteChangeable?: boolean;
}

export { TabPanel };

export default function ParamTab({ tabMenu, children, isRouteChangeable = true }: ParamTabTypes) {
    const router = useRouter();
    const dropdownEl = useRef<HTMLDivElement>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [visibleMobileMenu, setVisibleMobileMenu] = useState(false);
    const statusQuerySelect = useMemo(() => authApi.endpoints.getStatus.select('status'), []);
    const selectGetStatus = useAppSelector(statusQuerySelect);

    function handleTabChange(index: number) {
        if (isRouteChangeable) {
            router
                .push(
                    {
                        pathname: router.pathname,
                        query: { ...router.query, view: tabMenu[index].path }
                    },
                    undefined,
                    { scroll: true, shallow: true }
                )
                .then((r) => r)
                .catch((e) => e);
        } else {
            setSelectedTabIndex(index);
        }
    }

    useEffect(() => {
        if (router?.query?.view && isRouteChangeable) {
            setSelectedTabIndex(tabMenu.findIndex((item) => router.query.view === item.path));
        }
    }, [router.query, isRouteChangeable, tabMenu]);

    useEffect(() => {
        // Reset tab params to forms if logged out and tab param index is at submissions
        if (!!selectGetStatus.error) {
            setSelectedTabIndex(0);
            router
                .push(
                    {
                        pathname: router.pathname,
                        query: { ...router.query, view: tabMenu[0].path }
                    },
                    undefined,
                    { scroll: true, shallow: true }
                )
                .then((r) => r)
                .catch((e) => e);
        }
    }, [selectGetStatus]);

    useClickAway(dropdownEl, () => {
        setVisibleMobileMenu(false);
    });
    return (
        <Tab.Group selectedIndex={selectedTabIndex} onChange={(index: any) => handleTabChange(index)}>
            <div className="flex flex-row justify-between">
                <Tab.List className="relative w-full mb-6 text-sm before:absolute before:left-0 before:bottom-0 before:rounded-sm before:bg-gray-200 dark:bg-dark dark:before:bg-gray-800 gap-8 rounded-none md:before:h-0.5">
                    <div className="flex gap-6 w-full justify-between md:justify-start md:gap-8 xl:gap-10 3xl:gap-12">
                        {tabMenu.map((item) => (
                            <TabItem key={item.path}>
                                <div className="flex items-center">
                                    {item.icon && <span className="hidden md:block pr-2">{item.icon}</span>}
                                    <div className="">{item.title}</div>
                                </div>
                            </TabItem>
                        ))}
                    </div>
                </Tab.List>
            </div>
            <TabPanels>{children}</TabPanels>
        </Tab.Group>
    );
}
