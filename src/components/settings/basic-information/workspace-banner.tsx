import { useTranslation } from 'next-i18next';

import BannerImageComponent from '@app/components/dashboard/banner-image';
import SettingsCard from '@app/components/settings/card';
import { workspaceConstant } from '@app/constants/locales/workspace';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { useAppSelector } from '@app/store/hooks';

export default function WorkspaceBanner() {
    const workspace: WorkspaceDto = useAppSelector((state) => state.workspace);
    const { t } = useTranslation();
    return (
        <div className="!my-9 md:w-[674px] w-full rounded-[8px]">
            <BannerImageComponent workspace={workspace} isFormCreator={true} />
        </div>
    );
}
