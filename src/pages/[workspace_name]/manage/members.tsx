import { useState } from 'react';

import { useTranslation } from 'next-i18next';

import Divider from '@Components/Common/DataDisplay/Divider';

import ProPlanHoc from '@app/components/hoc/pro-plan-hoc';
import ManageWorkspaceLayout from '@app/components/layout/manage-workspace';
import { useModal } from '@app/components/modal-views/context';
import InvitationsTable from '@app/components/settings/invitations-table';
import MembersTable from '@app/components/settings/members-table';
import Button from '@app/components/ui/button';
import { buttons } from '@app/constants/locales/buttons';
import { members } from '@app/constants/locales/members';
import { selectIsProPlan } from '@app/store/auth/slice';
import { useAppSelector } from '@app/store/hooks';

export default function ManageMembers() {
    const isProPlan = useAppSelector(selectIsProPlan);
    const { openModal } = useModal();
    const { t } = useTranslation();
    return (
        <ManageWorkspaceLayout>
            <div className="flex justify-between">
                <div className="h4">{t(members.default)}</div>
                <ProPlanHoc hideChildrenIfPro={false}>
                    <Button
                        onClick={() => {
                            openModal('INVITE_MEMBER');
                        }}
                    >
                        {t(buttons.inviteCollaborator)}
                    </Button>
                </ProPlanHoc>
            </div>
            <Divider className="mt-5" />

            <MembersTable />
            {isProPlan && (
                <>
                    <div className="h4 mt-10">{t(members.invitations)}</div>
                    <Divider className="my-5" />
                    <InvitationsTable />
                </>
            )}
        </ManageWorkspaceLayout>
    );
}

export { getServerSidePropsForWorkspaceAdmin as getServerSideProps } from '@app/lib/serverSideProps';
