import React from 'react';

import Image from 'next/image';

import ConnectWithGoogleButton from '@app/components/login/login-with-google-button';
import ConnectWithTypeForm from '@app/components/login/login-with-typeform';
import environments from '@app/configs/environments';
import Layout from '@app/layouts/_layout';
import { checkHasCustomDomain, getServerSideAuthHeaderConfig } from '@app/utils/serverSidePropsUtils';

export async function getServerSideProps(_context: any) {
    if (checkHasCustomDomain(_context)) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };
    }
    const config = getServerSideAuthHeaderConfig(_context);

    try {
        const userStatus = await fetch(`${environments.API_ENDPOINT_HOST}/auth/status`, config);
        const user = (await userStatus?.json().catch((e: any) => e)) ?? null;
        console.log(user);
        if (user?.user?.roles?.includes('FORM_CREATOR')) {
            const userWorkspaceResponse = await fetch(`${environments.API_ENDPOINT_HOST}/workspaces/mine`, config);
            const userWorkspace = (await userWorkspaceResponse?.json().catch((e: any) => e)) ?? null;
            return {
                redirect: {
                    permanent: false,
                    destination: `/${userWorkspace[0].workspaceName}/dashboard`
                }
            };
        }
    } catch (e) {
        console.error(e);
    }
    return {
        props: {}
    };
}

export const Login = () => {
    return (
        <Layout className="min-h-screen">
            <div className="absolute top-0 left-0 h-full w-full flex flex-start">
                <div className=" w-full lg:w-[50%]  flex items-center justify-center flex-col space-y-8">
                    <div className="flex-col flex items-center">
                        <div className="flex items-start space-x-2">
                            <Image src="/bettercollected-logo.png" alt="Logo" height="30px" width="30px" />
                            <div className="flex text-3xl font-bold">
                                Better<p className="text-blue-500">Collected.</p>
                            </div>
                        </div>
                        <div className="text-base text-[#555555]">Collect forms responsibly !!</div>
                    </div>
                    <div className="flex flex-col justify-center items-center text-[#555555] space-y-2">
                        <div className="text-3xl font-bold">Welcome, Collector</div>
                    </div>
                    {environments.ENABLE_GOOGLE && <ConnectWithGoogleButton text="Sign In with google" creator />}
                    {environments.ENABLE_TYPEFORM && environments.ENABLE_GOOGLE && (
                        <div className="flex items-center justify-center">
                            <div className="border-t w-5 border-gray-200"></div>
                            <span className="flex-shrink text-xs mx-4 text-gray-400">or</span>
                            <div className="border-t w-5 border-gray-200"></div>
                        </div>
                    )}
                    {environments.ENABLE_TYPEFORM && <ConnectWithTypeForm />}

                    <div className="text-[11px] text-[#808080]">
                        By signing in, you agree to our
                        <a href={environments.TERMS_AND_CONDITIONS} target="_blank" rel="noreferrer" className="mx-1 cursor-pointer underline">
                            Terms of Service
                        </a>
                        and
                        <a href={environments.PRIVACY_POLICY} target="_blank" rel="noreferrer" className="mx-1 cursor-pointer underline">
                            Privacy Policy
                        </a>
                        .
                    </div>
                </div>
                <div className={`relative h-full w-[50%] hidden lg:flex side`}>
                    <Image layout="fill" src="/bettercollected.svg" alt="image" />
                </div>
            </div>
        </Layout>
    );
};

export default Login;
