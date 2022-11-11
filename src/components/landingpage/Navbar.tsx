import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import BrandLogo from '@app/assets/svgs/brand-logo.svg';
import HamburgerMenu from '@app/assets/svgs/hamburger-menu.svg';
import LanguageChangeDropdownRenderer from '@app/components/landingpage/LanguageChangeDropdownRenderer';
import ThemeSwitcher from '@app/components/settings/theme-switcher';
import ButtonRenderer from '@app/components/ui/ButtonRenderer';

/**
 * Created By: Rupan Chaulagain
 * Date: 2022-10-13
 * Time: 13:05
 * Project: formintegratorwebapp
 * Organization: Sireto Technology
 */

export default function Navbar() {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <div className={'sticky bg-white shadow-md top-0 opacity-80 z-50 h-[70px]'}>
            <div className={'p-4 md:pl-20 md:pr-20 flex items-center justify-between'}>
                <div className={'flex items-center'}>
                    <div className={'font-bold text-2xl md:text-3xl font-roboto tracking-widest'}>
                        Better<span className={'text-[#007AFF] tracking-widest'}>Collected</span>
                    </div>
                </div>
                {/*<div className={"flex items-center justify-between md:gap-6"}>*/}
                {/*    /!*<LanguageChangeDropdownRenderer/>*!/*/}
                {/*    /!*<ThemeSwitcher />*!/*/}
                {/*    <ButtonRenderer onClick={() => router.push("#banner")}>*/}
                {/*        /!*<p> {t("BECOME_A_BETTER_COLLECTOR")}</p>*!/*/}
                {/*        <p> {t("JOIN_WAITLIST")}</p>*/}
                {/*    </ButtonRenderer>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}