import { atom, useAtom } from 'jotai';

export type MODAL_VIEW =
    | 'UPDATE_TERMS_OF_SERVICE_AND_PRIVACY_POLICY'
    | 'REQUEST_FOR_DELETION_VIEW'
    | 'SEARCH_VIEW'
    | 'SHARE_VIEW'
    | 'LOGIN_VIEW'
    | 'IMPORT_GOOGLE_FORMS_VIEW'
    | 'IMPORT_TYPE_FORMS_VIEW'
    | 'LOGOUT_VIEW'
    | 'UPDATE_WORKSPACE_DOMAIN'
    | 'UPDATE_WORKSPACE_HANDLE';

const modalAtom = atom({ isOpen: false, view: '', modalProps: null });

export function useModal() {
    const [state, setState] = useAtom(modalAtom);
    const openModal = (view: MODAL_VIEW, modalProps: any = null) =>
        setState({
            ...state,
            isOpen: true,
            view,
            modalProps
        });
    const closeModal = () => {
        setState({ ...state, isOpen: false, modalProps: null, view: '' });
    };

    return {
        ...state,
        openModal,
        closeModal
    };
}
