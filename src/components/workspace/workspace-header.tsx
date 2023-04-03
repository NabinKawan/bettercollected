import React, { useState } from 'react';

import { toast } from 'react-toastify';

import ReactContentEditable from '@app/components/inline-editable';
import MarkdownText from '@app/components/ui/markdown-text';
import { ToastId } from '@app/constants/toastId';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { usePatchExistingWorkspaceMutation } from '@app/store/workspaces/api';
import { setWorkspace } from '@app/store/workspaces/slice';

interface WorkspaceHeaderProps {
    isFormCreator: boolean;
}

export default function WorkspaceHeader({ isFormCreator }: WorkspaceHeaderProps) {
    const [isMarkdownEditable, setIsMarkdownEditable] = useState(false);
    const dispatch = useAppDispatch();
    const [patchExistingWorkspace, { isLoading }] = usePatchExistingWorkspaceMutation();
    const workspace = useAppSelector((state) => state.workspace);

    const patchWorkspaceInformation = async (formData: any) => {
        const response: any = await patchExistingWorkspace({ workspace_id: workspace.id, body: formData });
        if (response.error) {
            toast('Something went wrong!!!', { toastId: ToastId.ERROR_TOAST });
        }
        if (response.data) {
            dispatch(setWorkspace(response.data));
            toast('Workspace Updated!!!', { type: 'default', toastId: ToastId.SUCCESS_TOAST });
        }
    };

    const handleTitleChange = async (sanitizedTitle: string) => {
        const formData = new FormData();
        formData.append('title', sanitizedTitle);

        return await patchWorkspaceInformation(formData);
    };

    const handleDescriptionChange = async (sanitizedDescription: string) => {
        const formData = new FormData();
        formData.append('description', sanitizedDescription);

        setIsMarkdownEditable(false);
        return await patchWorkspaceInformation(formData);
    };

    if (!isFormCreator)
        return (
            <div className="h-full w-full ml-0 md:ml-10">
                <div className="w-full md:w-9/12">
                    <h1 className="font-semibold text-darkGrey text-xl sm:text-2xl md:text-3xl xl:text-4xl">{workspace.title}</h1>
                    <MarkdownText description={workspace.description} contentStripLength={300} markdownClassName="pt-3 md:pt-7 text-base text-grey" textClassName="text-base" />
                </div>
            </div>
        );
    return (
        <div className="h-full w-full ml-0 md:ml-10">
            <div className="w-full md:w-9/12">
                <ReactContentEditable callback={handleTitleChange} tag="h1" content={workspace?.title} className="font-semibold text-darkGrey text-xl sm:text-2xl md:text-3xl xl:text-4xl" />
                {isMarkdownEditable ? (
                    <ReactContentEditable callback={handleDescriptionChange} tag="p" content={workspace?.description} className="mt-3 md:mt-7 text-base text-grey" />
                ) : (
                    <MarkdownText onClick={() => setIsMarkdownEditable(true)} description={workspace.description} contentStripLength={300} markdownClassName="pt-3 md:pt-7 text-base text-grey" textClassName="text-base" />
                )}
            </div>
        </div>
    );
}
