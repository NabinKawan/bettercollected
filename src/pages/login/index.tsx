import React from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { Check } from '@mui/icons-material';

import ImageLoginLaptopScreen from '@app/assets/images/login-laptop-screen.png';
import ConnectWithProviderButton from '@app/components/login/login-with-google-button';
import Logo from '@app/components/ui/logo';
import environments from '@app/configs/environments';
import { localesGlobal } from '@app/constants/locales/global';
import { signInScreen } from '@app/constants/locales/signin-screen';
import Layout from '@app/layouts/_layout';
import { getGlobalServerSidePropsByDomain } from '@app/lib/serverSideProps';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { checkHasCustomDomain, getServerSideAuthHeaderConfig } from '@app/utils/serverSidePropsUtils';

export async function getServerSideProps(_context: any) {
    const config = getServerSideAuthHeaderConfig(_context);
    const globalProps = (await getGlobalServerSidePropsByDomain(_context)).props;
    const locale = globalProps['_nextI18Next']['initialLocale'] === 'en' ? '' : `${globalProps['_nextI18Next']['initialLocale']}/`;
    if (checkHasCustomDomain(_context)) {
        return {
            redirect: {
                permanent: false,
                destination: `/${locale}`
            }
        };
    }

    try {
        const userStatus = await fetch(`${environments.INTERNAL_DOCKER_API_ENDPOINT_HOST}/auth/status`, config);
        const user = (await userStatus?.json().catch((e: any) => e))?.user ?? null;
        if (user?.roles?.includes('FORM_CREATOR')) {
            const userWorkspaceResponse = await fetch(`${environments.INTERNAL_DOCKER_API_ENDPOINT_HOST}/workspaces/mine`, config);
            const userWorkspace = (await userWorkspaceResponse?.json().catch((e: any) => e)) ?? null;
            const defaultWorkspace = userWorkspace.filter((workspace: WorkspaceDto) => workspace.ownerId === user.id && workspace?.default);
            let redirectWorkspace: WorkspaceDto | null;
            if (defaultWorkspace.length > 0) {
                redirectWorkspace = defaultWorkspace[0];
            } else {
                redirectWorkspace = userWorkspace[0];
            }
            if (!redirectWorkspace?.title || redirectWorkspace?.title === '' || redirectWorkspace?.title.toLowerCase() === 'untitled') {
                return {
                    redirect: {
                        permanent: false,
                        destination: `/${locale}${redirectWorkspace?.workspaceName}/onboarding`
                    }
                };
            }
            return {
                redirect: {
                    permanent: false,
                    destination: `/${locale}${redirectWorkspace?.workspaceName}/dashboard`
                }
            };
        }
    } catch (e) {
        console.error(e);
    }
    return {
        props: { ...globalProps }
    };
}

export const Login = () => {
    const { t } = useTranslation();
    const constants = {
        heading4: t(localesGlobal.becomeABetterCollector),
        heading3: t(signInScreen.welcomeMessage),
        subHeading2: t(signInScreen.continueWIth),
        paragraphs: [t(signInScreen.reviewForms), t(signInScreen.collectForms), t(signInScreen.easyToManageForms), t(signInScreen.deleteResponses)]
    };

    return (
        <Layout className="min-h-screen">
            <div className="absolute top-0 left-0 h-full w-full flex flex-col md:flex-row">
                <div className={`bg-brand-500 relative order-2 md:order-1 h-fit md:h-full w-full md:w-[50%] flex flex-col justify-center`}>
                    <div className="flex flex-col px-8 py-7 md:px-[94px] md:py-[92px]">
                        <h1 className="h4 !text-black-100 mb-6">{constants.heading4}</h1>
                        {constants.paragraphs.map((paragraph, idx) => (
                            <div key={idx} className="flex items-center gap-3 mb-4 last:mb-0">
                                <Check className="text-black-300" />
                                <p className="text-black-300">{paragraph}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <div className="relative h-[244px] w-[320px] md:h-[340px] md:w-[446px]">
                            <Image layout="fill" src={ImageLoginLaptopScreen} alt="BetterCollected" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col order-1 md:order-2 items-start justify-start px-8 py-7 md:py-8 md:px-[110px] h-fit md:h-full w-full md:w-[50%]">
                    <div className="mb-28">
                        <Logo />
                    </div>
                    <h3 className="h3 mb-4">{constants.heading3}</h3>
                    <p className="sh2 mb-12 !text-black-700">{constants.subHeading2}</p>

                    <div className="flex flex-col gap-[20px] mb-[60px]">
                        {environments.ENABLE_GOOGLE && <ConnectWithProviderButton type="dark" url={`${environments.API_ENDPOINT_HOST}/auth/google/basic`} text="Sign in with Google" creator />}
                        {environments.ENABLE_TYPEFORM && <ConnectWithProviderButton type="typeform" url={`${environments.API_ENDPOINT_HOST}/auth/typeform/basic`} text="Sign in with Typeform" creator />}
                    </div>

                    <div className="body4">
                        {t(signInScreen.signinAgreementDescription)}
                        <a href="https://bettercollected.com/terms-of-service" target="_blank" rel="noreferrer" className="mx-1 cursor-pointer underline text-brand-500 hover:text-brand-600">
                            {t(localesGlobal.termsOfServices)}
                        </a>
                        {t(localesGlobal.and)}
                        <a href="https://bettercollected.com/privacy-policy" target="_blank" rel="noreferrer" className="mx-1 cursor-pointer underline text-brand-500 hover:text-brand-600">
                            {t(localesGlobal.privacyPolicy)}
                        </a>
                        .
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
