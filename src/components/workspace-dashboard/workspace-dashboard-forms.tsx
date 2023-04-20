import { MoreHoriz, PushPin } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { TypeformIcon } from '@app/components/icons/brands/typeform';
import { EmptyImportFormIcon } from '@app/components/icons/empty-import-form-icon';
import { GoogleFormIcon } from '@app/components/icons/google-form-icon';
import { useModal } from '@app/components/modal-views/context';
import Button from '@app/components/ui/button/button';
import ActiveLink from '@app/components/ui/links/active-link';
import environments from '@app/configs/environments';
import { useBreakpoint } from '@app/lib/hooks/use-breakpoint';
import { useCopyToClipboard } from '@app/lib/hooks/use-copy-to-clipboard';
import { StandardFormDto } from '@app/models/dtos/form';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { toEndDottedStr } from '@app/utils/stringUtils';

interface IWorkspaceDashboardFormsProps {
    workspaceForms: any;
    workspace: WorkspaceDto;
    hasCustomDomain: boolean;
}

export default function WorkspaceDashboardForms({ workspaceForms, workspace, hasCustomDomain }: IWorkspaceDashboardFormsProps) {
    const breakpoint = useBreakpoint();
    const { openModal } = useModal();

    const forms = workspaceForms?.data?.items;

    const [_, copyToClipboard] = useCopyToClipboard();

    return (
        <div className="mb-10 w-full h-fit mt-5">
            {forms?.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-[4px] py-[84px]">
                    <EmptyImportFormIcon className="mb-8" />
                    <p className="sh1 mb-4 !leading-none">Import your first form</p>
                    <p className="body4 mb-8 !leading-none">Import your Google Forms or Typeforms</p>
                    <Button onClick={() => openModal('IMPORT_FORMS')} size="medium">
                        Import Forms
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 bg-white rounded-[4px]">
                    {forms?.length !== 0 &&
                        forms?.map((form: StandardFormDto) => {
                            const slug = form.settings?.customUrl;
                            let shareUrl = '';
                            if (window && typeof window !== 'undefined') {
                                const scheme = `${environments.CLIENT_HOST.includes('localhost') ? 'http' : 'https'}://`;
                                shareUrl = scheme + `${hasCustomDomain ? `${workspace.customDomain}/forms/${slug}` : `${environments.CLIENT_HOST}/${workspace.workspaceName}/forms/${slug}`}`;
                            }
                            return (
                                <ActiveLink key={form.formId} href={`/${workspace.workspaceName}/dashboard/forms/${form.formId}`}>
                                    <div className="flex flex-col items-start justify-between h-full border-[1px] border-black-300 hover:border-brand-500 transition cursor-pointer rounded-[4px]">
                                        <div className="relative w-full px-4 py-6 flex min-h-28 flex-col gap-3 items-start justify-between bg-brand-100">
                                            <div className="rounded-[4px] h-[34px] w-[34px] relative">{form?.settings?.provider === 'typeform' ? <TypeformIcon /> : <GoogleFormIcon className="-ml-2" />}</div>
                                            <Tooltip title={form?.title || 'Untitled'} arrow placement="top-start" enterDelay={300}>
                                                <p className="body3 !not-italic leading-none">{['xs', '2xs', 'sm', 'md'].indexOf(breakpoint) !== -1 ? toEndDottedStr(form?.title || 'Untitled', 15) : toEndDottedStr(form?.title || 'Untitled', 20)}</p>
                                            </Tooltip>
                                            <p className={`absolute top-4 right-4 rounded-full leading-none text-[10px] px-2 flex py-1 items-center justify-center ${form?.settings?.private ? 'bg-brand-accent' : 'bg-green-600'} text-white`}>
                                                {form?.settings?.private ? 'Hidden' : 'Public'}
                                            </p>
                                            {form?.settings?.pinned && (
                                                <Tooltip className="absolute -top-2 left-0" title="Pinned to your public workspace view" arrow placement="top-start" enterDelay={300}>
                                                    <PushPin className="rotate-45" />
                                                </Tooltip>
                                            )}
                                        </div>
                                        <div className="relative flex justify-between items-center p-4 w-full">
                                            <p className="body4 !text-brand-600">0 response</p>
                                            <Tooltip className="absolute right-4" title="Form options" arrow placement="top-start" enterDelay={300}>
                                                <IconButton onClick={() => {}} size="small" className="rounded-[4px] text-black-900 hover:rounded-[4px] hover:bg-black-200">
                                                    <MoreHoriz />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        {/* <div className="flex flex-col w-full justify-between h-11">
                                            <div className="flex pt-3 justify-between">
                                                <div className="rounded space-x-2 text-xs px-2 flex py-1 items-center text-gray-500 bg-gray-100">Public</div>
                                                <div className="flex">
                                                    <div
                                                        aria-hidden
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            // copyToClipboard(shareUrl);
                                                            toast('Copied URL', { type: 'info' });
                                                        }}
                                                        className="p-2 border-[1px] border-white hover:border-neutral-100 hover:shadow rounded-md"
                                                    >
                                                        <ShareIcon width={19} height={19} />
                                                    </div>
                                                    <PushPin className="rotate-45" />
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </ActiveLink>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
