import { atom, useAtom } from 'jotai';

export type DRAWER_VIEW = 'DASHBOARD_SIDEBAR' | 'DRAWER_MENU' | 'DRAWER_SEARCH' | 'DRAWER_FILTER';
const drawerAtom = atom({ isOpen: false, view: '' });

export function useDrawer() {
    const [state, setState] = useAtom(drawerAtom);
    const openDrawer = (view: DRAWER_VIEW) => {
        setState({ ...state, isOpen: true, view });
    };
    const closeDrawer = () => setState({ ...state, isOpen: false, view: '' });
    return {
        ...state,
        openDrawer,
        closeDrawer
    };
}
