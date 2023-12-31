import React, { useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Divider from '@Components/Common/DataDisplay/Divider';
import UserDetails from '@Components/Common/DataDisplay/UserDetails';
import StyledPagination from '@Components/Common/Pagination';
import { A } from 'msw/lib/glossary-de6278a9';
import DataTable from 'react-data-table-component';

import { dataTableCustomStyles } from '@app/components/datatable/form/datatable-styles';
import FormOptionsDropdownMenu from '@app/components/datatable/form/form-options-dropdown';
import DataTableProviderFormCell from '@app/components/datatable/form/provider-form-cell';
import ImportFormsButton from '@app/components/form-integrations/import-forms-button';
import SidebarLayout from '@app/components/sidebar/sidebar-layout';
import EmptyResponse from '@app/components/ui/empty-response';
import ActiveLink from '@app/components/ui/links/active-link';
import Loader from '@app/components/ui/loader';
import globalConstants from '@app/constants/global';
import { formConstant } from '@app/constants/locales/form';
import { localesGlobal } from '@app/constants/locales/global';
import { workspaceConstant } from '@app/constants/locales/workspace';
import { StandardFormDto } from '@app/models/dtos/form';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { selectIsAdmin, selectIsProPlan } from '@app/store/auth/slice';
import { useAppSelector } from '@app/store/hooks';
import { useGetWorkspaceFormsQuery, useSearchWorkspaceFormsMutation } from '@app/store/workspaces/api';
import { parseDateStrToDate, toHourMinStr, toMonthDateYearStr, utcToLocalDate } from '@app/utils/dateUtils';

const formTableStyles = {
    ...dataTableCustomStyles,
    rows: {
        style: {
            ...dataTableCustomStyles.rows.style,
            border: '1px solid transparent',
            '&:hover': {
                cursor: 'pointer',
                border: '1px solid #0764EB'
            }
        }
    }
};

export default function FormPage({ workspace, hasCustomDomain }: { workspace: WorkspaceDto; hasCustomDomain: boolean }) {
    const [sortValue, setSortValue] = useState('newest_oldest');
    const [filterValue, setFilterValue] = useState('show_all');
    const { t } = useTranslation();

    const [workspaceQuery, setWorkspaceQuery] = useState({
        workspace_id: workspace.id,
        page: 1,
        size: globalConstants.pageSize
    });

    const isAdmin = useAppSelector(selectIsAdmin);
    const isProPlan = useAppSelector(selectIsProPlan);

    const workspaceForms = useGetWorkspaceFormsQuery<any>(workspaceQuery, { pollingInterval: 30000 });
    const forms = workspaceForms?.data?.items || [];
    const router = useRouter();

    const handlePageChange = (event: any, page: number) => {
        setWorkspaceQuery({
            ...workspaceQuery,
            page: page
        });
    };

    const onRowCLicked = (form: StandardFormDto) => {
        router.push(`/${workspace.workspaceName}/dashboard/forms/${form.formId}`);
    };

    const selectList = [
        {
            id: 'sort-select-label',
            label: 'Sort',
            selectId: 'sort-simple-select',
            value: sortValue,
            onChange: (e: any) => setSortValue(e?.target?.value),
            menuItems: [
                { value: 'newest_oldest', label: 'Newest - Oldest' },
                { value: 'oldest_newest', label: 'Oldest - Newest' },
                { value: 'number_of_responses', label: 'No. of responses' },
                { value: 'deletion_requests', label: 'Deletion requests' },
                { value: 'latest_updated', label: 'Latest updated' },
                { value: 'alphabetical', label: 'Alphabetical' }
            ]
        },
        {
            id: 'filter-select-label',
            label: 'Show all',
            selectId: 'filter-simple-select',
            value: filterValue,
            onChange: (e: any) => setFilterValue(e?.target?.value),
            menuItems: [
                { value: 'show_all', label: 'Show all' },
                { value: 'googleform', label: 'Google Forms' },
                { value: 'typeform', label: 'Typeform' },
                { value: 'deletion_requests', label: 'Deletion requests' }
            ]
        }
    ];

    const dataTableFormColumns = [
        {
            name: t(formConstant.formType),
            selector: (form: StandardFormDto) => <DataTableProviderFormCell form={form} workspace={workspace} />,
            grow: 4,
            style: {
                color: '#202124',
                fontSize: '16px',
                marginLeft: '-5px',
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        },
        {
            name: t(formConstant.responses),
            selector: (row: StandardFormDto) => (
                <ActiveLink className="hover:text-brand-500 hover:underline" href={`/${workspace.workspaceName}/dashboard/forms/${row.formId}/responses`}>
                    {row?.responses ?? 0}
                </ActiveLink>
            ),
            grow: 2,

            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '18px'
            }
        },
        {
            name: t(formConstant.deletionRequests),
            selector: (row: StandardFormDto) => (
                <ActiveLink className="hover:text-brand-500 hover:underline paragraph" href={`/${workspace.workspaceName}/dashboard/forms/${row.formId}/deletion-requests`}>
                    {' '}
                    {row?.deletionRequests ?? 0}
                </ActiveLink>
            ),
            grow: 2,
            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '18px'
            }
        },
        ...(isAdmin && !isProPlan
            ? []
            : [
                  {
                      name: t(formConstant.importedBy),
                      grow: 3,
                      selector: (row: StandardFormDto) => <UserDetails user={row.importerDetails} />
                  }
              ]),
        {
            name: t(formConstant.importedDate),
            selector: (row: StandardFormDto) => (!!row?.createdAt ? `${toMonthDateYearStr(parseDateStrToDate(utcToLocalDate(row.createdAt)))} ${toHourMinStr(parseDateStrToDate(utcToLocalDate(row.createdAt)))}` : ''),
            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '16px'
            }
        },
        {
            cell: (form: StandardFormDto) => <FormOptionsDropdownMenu redirectToDashboard={false} form={form} hasCustomDomain={hasCustomDomain} workspace={workspace} showShare />,
            allowOverflow: true,
            button: true,
            width: '60px',
            style: {
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        }
    ];

    const response = () => {
        if (forms && forms.length > 0)
            return (
                <>
                    <DataTable
                        className="p-0 mt-2 !overflow-auto"
                        // @ts-ignore
                        columns={dataTableFormColumns}
                        data={forms}
                        customStyles={formTableStyles}
                        highlightOnHover={false}
                        pointerOnHover={false}
                        onRowClicked={onRowCLicked}
                    />
                    {Array.isArray(forms) && workspaceForms?.data.total > globalConstants.pageSize && (
                        <div className="mt-8 flex justify-center">
                            <StyledPagination shape="rounded" count={workspaceForms?.data?.pages || 0} page={workspaceQuery.page || 1} onChange={handlePageChange} />
                        </div>
                    )}
                </>
            );
        return <EmptyResponse title={t(workspaceConstant.preview.emptyFormTitle)} description={''} />;
    };

    return (
        <SidebarLayout>
            {workspaceForms?.isLoading && (
                <div className=" w-full py-10 flex justify-center">
                    <Loader />
                </div>
            )}
            {!workspaceForms?.isLoading && (
                <div className="py-10 w-full h-full">
                    <h1 className="sh1">{t(localesGlobal.forms)}</h1>
                    <div className="flex flex-col mt-4 mb-6 gap-6 justify-center md:flex-row md:justify-between md:items-center">
                        <ImportFormsButton size="small" />
                    </div>
                    <Divider />
                    {response()}
                </div>
            )}
        </SidebarLayout>
    );
}

export { getAuthUserPropsWithWorkspace as getServerSideProps } from '@app/lib/serverSideProps';
