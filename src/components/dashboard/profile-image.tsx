import React, { useRef } from 'react';
import { useState } from 'react';

import { useRouter } from 'next/router';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Dialog } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'react-toastify';

import Button from '@app/components/ui/button';
import Image from '@app/components/ui/image';
import { ToastId } from '@app/constants/toastId';
import { BannerImageComponentPropType } from '@app/containers/dashboard/WorkspaceHomeContainer';
import { useAppDispatch } from '@app/store/hooks';
import { usePatchExistingWorkspaceMutation } from '@app/store/workspaces/api';
import { setWorkspace } from '@app/store/workspaces/slice';

export default function ProfileImageComponent(props: BannerImageComponentPropType) {
    const { workspace, isFormCreator } = props;
    const [uploadImage, setUploadImage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [scale, setScale] = useState(1);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const profileEditorRef = useRef<AvatarEditor>(null);
    const router = useRouter();
    const [patchExistingWorkspace, { isLoading }] = usePatchExistingWorkspaceMutation();

    const dispatch = useAppDispatch();

    const onUploadFileChange = (e: any) => {
        if (e.target.files.length === 0) return;
        setUploadImage(e.target.files[0]);
    };

    const onEditButtonClick = () => {
        setOpenDialog(true);
        if (!workspace.profileImage) return;
        setUploadImage(workspace.profileImage);
    };

    const onProfileUpdateButtonClick = async () => {
        if (!!profileEditorRef.current) {
            const dataUrl = profileEditorRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            const file = new File([blob], 'profileImage.png', { type: blob.type });
            const formData = new FormData();
            formData.append('profile_image', file);
            const response: any = await patchExistingWorkspace({ workspace_id: workspace.id, body: formData });
            if (response.error) {
                toast('Something went wrong', { toastId: ToastId.ERROR_TOAST });
            }
            if (response.data) {
                toast('Workspace Updated', { type: 'success', toastId: ToastId.SUCCESS_TOAST });
                setOpenDialog(false);
                dispatch(setWorkspace(response.data));
                // await router.push(router.asPath, undefined);
            }
        } else return;
    };

    return (
        <div>
            <div className="relative bannerdiv aspect-square product-image bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded-xl z-10  w-24  sm:w-32  md:w-40  xl:w-40 2xl:w-[180px] overflow-hidden">
                {!!workspace.profileImage ? (
                    <Image src={workspace?.profileImage ?? ''} layout="fill" objectFit="contain" alt={workspace.title} />
                ) : (
                    <div className="flex h-full justify-center items-center">
                        {isFormCreator ? (
                            <>
                                <Image src="/upload.png" height="46px" width={'72px'} alt={'upload'} />
                            </>
                        ) : (
                            'No image available'
                        )}
                    </div>
                )}
                {isFormCreator && (
                    <>
                        <div data-testid="profile-image-edit" className="absolute hidden w-full h-full bg-gray-700 p-2 !align-middle !text-center cursor-pointer text-gray-500 bottom-0 rounded-md opacity-50 editbannerdiv" onClick={onEditButtonClick}>
                            <ModeEditIcon className="!w-6 !h-6 text-white" />
                        </div>
                        <input data-testid="file-upload-profile" ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadFileChange} />
                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <div data-testid="profile-edit-dialog" className="p-4">
                                <h1 className="font-bold text-lg mb-2">Update your Workspace Profile picture</h1>
                                <AvatarEditor crossOrigin="anonymous" ref={profileEditorRef} image={uploadImage} width={250} height={250} border={50} borderRadius={16} color={[0, 0, 0, 0.6]} scale={scale} rotate={0} />
                                <div className="flex mb-2 gap-1 text-3xl text-gray-600 justify-center items-center">
                                    <p>-</p>
                                    <input name="scale" type="range" onChange={(e) => setScale(parseFloat(e.target.value))} min={1} max={4} step="0.01" defaultValue={1} />
                                    <p>+</p>
                                </div>
                                <div className="flex justify-around">
                                    <Button variant="solid" color="info" disabled={isLoading} className="hover:!translate-y-0 !rounded-md !shadow-none" onClick={() => profileInputRef.current?.click()}>
                                        {!uploadImage ? 'Upload Image' : 'Change Image'}
                                    </Button>
                                    <Button data-testid="save-button" isLoading={isLoading} variant="solid" color="info" className="hover:!translate-y-0 !rounded-md shadow-none" disabled={!uploadImage} onClick={onProfileUpdateButtonClick}>
                                        Save Image
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    );
}
