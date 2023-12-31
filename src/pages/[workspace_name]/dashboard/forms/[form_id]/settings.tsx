import React from 'react';

import { useTranslation } from 'next-i18next';

import FormSettingsTab from '@app/components/dashboard/form-settings';
import FormPageLayout from '@app/components/sidebar/form-page-layout';
import { localesGlobal } from '@app/constants/locales/global';

export default function Settings(props: any) {
    const { t } = useTranslation();
    return (
        <FormPageLayout {...props}>
            <div className="heading4">{t(localesGlobal.settings)}</div>
            <FormSettingsTab />
        </FormPageLayout>
    );
}

export { getServerSidePropsForDashboardFormPage as getServerSideProps } from '@app/lib/serverSideProps';
