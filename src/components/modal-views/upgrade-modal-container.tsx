import { Fragment, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Close } from '@app/components/icons/close';
import UpgradeToProModal from '@app/components/modal-views/modals/upgrade-to-pro-modal';
import { UPGRADE_MODAL_VIEW, useUpgradeModal } from '@app/components/modal-views/upgrade-modal-context';
import Button from '@app/components/ui/button';
import { Dialog } from '@app/components/ui/dialog';
import { Transition } from '@app/components/ui/transition';

import CropImageModalView from './modals/crop-image-modal-view';

function renderModalContent(view: UPGRADE_MODAL_VIEW | string, modalProps: any) {
    switch (view) {
        case 'CROP_IMAGE':
            return <CropImageModalView {...modalProps} />;
        case 'UPGRADE_TO_PRO':
            return <UpgradeToProModal />;
        default:
            return <></>;
    }
}

export default function UpgradeModalContainer() {
    const router = useRouter();
    const { isOpen, closeModal, modalProps, view } = useUpgradeModal();

    useEffect(() => {
        // close search modal when route change
        router.events.on('routeChangeStart', closeModal);
        return () => {
            router.events.off('routeChangeStart', closeModal);
        };
    }, []);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-[2500] h-full w-full overflow-y-auto overflow-x-hidden  text-center" onClose={closeModal}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Dialog.Overlay className={`fixed inset-0 z-40  ${view === 'UPGRADE_TO_PRO' ? '!bg-white' : 'bg-gray-700 bg-opacity-60'}   cursor-pointer`} />
                </Transition.Child>

                {/* This element is need to fix FocusTap headless-ui warning issue */}
                <div className="sr-only">
                    <Button size="small" color="gray" shape="circle" onClick={closeModal} className="opacity-50 hover:opacity-80 ">
                        <Close className="h-auto w-[13px]" />
                    </Button>
                </div>

                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-105" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-105">
                    <div data-testid="modal-view" className={`relative min-h-screen inline-block items-center content-center !w-full  z-50  ${view === 'UPGRADE_TO_PRO' ? '!bg-white' : ''} text-left align-middle md:w-fit`}>
                        {view && renderModalContent(view, modalProps)}
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
