import { useState } from 'react';

import { useRouter } from 'next/router';

import Divider from '@Components/Common/DataDisplay/Divider';
import { toast } from 'react-toastify';

import BetterInput from '@app/components/Common/input';
import ProPlanHoc from '@app/components/hoc/pro-plan-hoc';
import ManageWorkspaceLayout from '@app/components/layout/manage-workspace';
import { useModal } from '@app/components/modal-views/context';
import SettingsCard from '@app/components/settings/card';
import InvitationsTable from '@app/components/settings/invitations-table';
import MembersTable from '@app/components/settings/members-table';
import Button from '@app/components/ui/button';
import { selectIsProPlan } from '@app/store/auth/slice';
import { useAppSelector } from '@app/store/hooks';
import { useInviteToWorkspaceMutation } from '@app/store/workspaces/members-n-invitations-api';

export default function ManageMembers() {
    const isProPlan = useAppSelector(selectIsProPlan);
    const { openModal } = useModal();
    return (
        <ManageWorkspaceLayout>
            <div className="flex justify-between">
                <div className="h4">Members</div>
                <ProPlanHoc hideChildrenIfPro={false}>
                    <Button
                        onClick={() => {
                            openModal('INVITE_MEMBER');
                        }}
                    >
                        Invite Collaborator
                    </Button>
                </ProPlanHoc>
            </div>
            <Divider className="mt-5" />

            <MembersTable />
            {isProPlan && (
                <>
                    <div className="h4 mt-10">Invitations</div>
                    <Divider className="my-5" />
                    <InvitationsTable />
                </>
            )}
        </ManageWorkspaceLayout>
    );
}

export { getServerSidePropsForWorkspaceAdmin as getServerSideProps } from '@app/lib/serverSideProps';