import React, { useEffect, useMemo, useState } from 'react';

import Router, { useRouter } from 'next/router';

import styled from '@emotion/styled';
import { IconButton, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import EmptyTray from '@app/assets/svgs/empty-tray.svg';
import { Logout } from '@app/components/icons/logout-icon';
import { SearchIcon } from '@app/components/icons/search';
import { ShareIcon } from '@app/components/icons/share-icon';
import { useModal } from '@app/components/modal-views/context';
import Button from '@app/components/ui/button';
import FullScreenLoader from '@app/components/ui/fullscreen-loader';
import Image from '@app/components/ui/image';
import ActiveLink from '@app/components/ui/links/active-link';
import MarkdownText from '@app/components/ui/markdown-text';
import MuiSnackbar from '@app/components/ui/mui-snackbar';
import environments from '@app/configs/environments';
import ContentLayout from '@app/layouts/_content-layout';
import { useCopyToClipboard } from '@app/lib/hooks/use-copy-to-clipboard';
import { CompanyJsonDto } from '@app/models/dtos/customDomain';
import { GoogleFormDto } from '@app/models/dtos/googleForm';
import { authApi, useGetLogoutQuery, useGetStatusQuery, useLazyGetLogoutQuery } from '@app/store/auth/api';
import { baseApi } from '@app/store/baseApi';
import { googleApiSlice } from '@app/store/google/api';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { toEndDottedStr } from '@app/utils/stringUtils';

const StyledTextField = styled.div`
    .MuiFormControl-root {
        background: white;
        border-radius: 14px;
        outline: none;
    }

    .MuiOutlinedInput-notchedOutline {
        border-radius: 14px;
        border-width: 0.5px;
    }
`;

interface IDashboardContainer {
    companyJson: CompanyJsonDto | null;
}

export default function DashboardContainer({ companyJson }: IDashboardContainer) {
    const [searchText, setSearchText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [forms, setForms] = useState<Array<GoogleFormDto> | null>(null);

    const [trigger, result] = useLazyGetLogoutQuery();

    const getGoogleConnect = googleApiSlice.useLazyGetConnectToGoogleQuery();

    // const getStatus = useGetStatusQuery('status');

    const { openModal } = useModal();
    const [_, copyToClipboard] = useCopyToClipboard();

    const dispatch = useDispatch();
    const router = useRouter();

    let timeOutId: any;

    // const statusQuerySelect = useMemo(() => authApi.endpoints.getStatus.select('status'), []);

    // useEffect(() => {
    //     const selectGetStatus = useAppSelector(statusQuerySelect);
    //     console.log('status: ', selectGetStatus);
    // }, []);

    useEffect(() => {
        if (!!companyJson) {
            const companyForms: Array<GoogleFormDto> | null = companyJson?.forms ?? [];
            const filteredForms = companyForms.filter((form) => form.info.title.toLowerCase().includes(searchText.toLowerCase()));
            timeOutId = setTimeout(() => setForms(filteredForms ?? []), 500);
        }
        return () => timeOutId && clearTimeout(timeOutId);
    }, [searchText, companyJson]);

    if (!companyJson || !forms) return <FullScreenLoader />;

    const handleSearch = (event: any) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const handleLogout = async () => {
        trigger().finally(() => {
            dispatch(authApi.util.resetApiState());
            const { error, refetch } = getStatus;
            refetch();
        });
    };

    const handleCheckMyData = () => {
        openModal('LOGIN_VIEW');
    };

    const handleImportForms = () => {
        openModal('IMPORT_FORMS_VIEW');
    };

    const handleConnectWithGoogle = async () => {
        const [trigger] = getGoogleConnect;
        const googleRedirectUrl = await trigger().unwrap();
        router.push(googleRedirectUrl);
    };

    // const ProfileMenu = () => (
    //     <>
    //         {selectGetStatus.data?.payload?.content?.user?.services?.length === 0 && (
    //             <Button variant="solid" className="mx-3 !rounded-xl !bg-blue-500" onClick={handleConnectWithGoogle}>
    //                 Connect with google
    //             </Button>
    //         )}

    //         <Button variant="solid" className="mx-3 !rounded-xl !bg-blue-500" onClick={handleCheckMyData}>
    //             Check My data
    //         </Button>

    //         {/* {!selectGetStatus?.error && (
    //             <Button variant="solid" className="ml-3 !px-3 !rounded-xl !bg-[#ffe0e0]" onClick={handleLogout}>
    //                 <Logout height="30px" width="30px" className="!rounded-xl !text-[#e60000]" />
    //             </Button>
    //         )} */}
    //         {/* <Button variant="solid" className="ml-3 !px-3 !rounded-xl !bg-blue-500" onClick={handleImportForms}>
    //             Import Forms
    //         </Button> */}
    //     </>
    // );

    return (
        <div className="relative">
            <div className="product-box">
                <div data-aos="fade-up" className="product-image relative h-44 w-full overflow-hidden md:h-80 xl:h-[380px]">
                    <Image src={companyJson.companyBanner} layout="fill" objectFit="contain" objectPosition="center" alt={companyJson.companyTitle} />
                </div>
            </div>
            <ContentLayout className="!pt-0 relative bg-[#FBFBFB]">
                <div className="absolute overflow-hidden inset-0">
                    <div className="absolute top-[60%] left-[-100px] w-[359px] h-[153px] bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 rotate-90 blur-dashboardBackground opacity-[20%]" />
                    <div className="absolute top-[35%] left-[65%] w-[765px] h-[765px] bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400 blur-dashboardBackground opacity-[15%]" />
                    <div className="absolute bottom-0 left-[50%] w-[599px] h-[388px] bg-gradient-to-r from-rose-200 via-rose-300 to-rose-400 rotate-180 blur-dashboardBackground opacity-[20%]" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="product-box">
                        <div className="product-image bg-white absolute border-[1px] border-neutral-300 hover:border-neutral-400 rounded-full z-10 h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-40 xl:w-40 2xl:h-[180px] 2xl:w-[180px] overflow-hidden -top-12 sm:-top-16 md:-top-20 xl:-top-[88px] 2xl:-top-24">
                            <Image src={companyJson.companyProfile} layout="fill" objectFit="contain" alt={companyJson.companyTitle} />
                        </div>
                    </div>
                    <div className="mt-2 mb-0 flex items-center">
                        <Button variant="solid" className="mx-3 !rounded-xl !bg-blue-500" onClick={handleCheckMyData}>
                            Check my data
                        </Button>
                    </div>
                </div>

                <div className="relative h-full w-full mt-10 sm:mt-16 md:mt-20 xl:mt-[88px] 2xl:mt-24">
                    <div className="py-4 md:py-6 xl:py-8 2xl:py-12 w-full md:w-9/12 xl:w-4/6 2xl:w-3/6">
                        <h1 className="font-semibold text-darkGrey text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[40px]">{companyJson.companyTitle}</h1>
                        <MarkdownText description={companyJson.companyDescription} contentStripLength={1000} markdownClassName="pt-3 md:pt-7 text-base text-grey" textClassName="text-base" />
                    </div>
                </div>

                <div className="relative flex flex-col w-full">
                    <div className="flex flex-row gap-6 items-center justify-between">
                        <h2 className="font-semibold text-darkGrey text-lg sm:text-xl md:text-2xl xl:text-3xl">Forms</h2>
                        <StyledTextField>
                            <TextField
                                size="small"
                                name="search-input"
                                placeholder="Search forms..."
                                value={searchText}
                                onChange={handleSearch}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </StyledTextField>
                        {/* <Autocomplete value={sea} onChange={handleSearch} size="small" disablePortal id="combo-box-demo" options={[]} sx={{ width: 250 }} renderInput={(params) => <TextField {...params} label="Search forms..." />} /> */}
                    </div>
                    <div className="pt-3 md:pt-7">
                        {forms.length === 0 && (
                            <div className="w-full min-h-[30vh] flex flex-col items-center justify-center text-darkGrey">
                                <Image src={EmptyTray} width={40} height={40} alt="Empty Tray" />
                                <p className="mt-4 p-0">0 forms</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-8">
                            {forms.length !== 0 &&
                                forms.map((form) => {
                                    const slug = form.info.title.toLowerCase().replaceAll(' ', '-');
                                    let shareUrl = '';
                                    if (window && typeof window !== 'undefined') {
                                        shareUrl = `${window.location.origin}/forms/${slug}`;
                                    }
                                    return (
                                        <ActiveLink
                                            key={form.id}
                                            href={{
                                                pathname: `/forms/[slug]`,
                                                query: { slug }
                                            }}
                                        >
                                            <div className="flex flex-row items-center justify-between h-full gap-8 p-5 border-[1px] border-neutral-300 hover:border-blue-500 drop-shadow-sm hover:drop-shadow-lg transition cursor-pointer bg-white rounded-[20px]">
                                                <div className="flex flex-col justify-start h-full">
                                                    <p className="text-xl text-grey mb-4 p-0">{form.info.title}</p>
                                                    {form.info?.description && <p className="text-base text-softBlue m-0 p-0 w-full">{toEndDottedStr(form.info.description, 180)}</p>}
                                                </div>
                                                <div
                                                    aria-hidden
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        copyToClipboard(shareUrl);
                                                        setIsOpen(true);
                                                    }}
                                                    className="p-2 border-[1px] border-white hover:border-neutral-100 hover:shadow rounded-md"
                                                >
                                                    <ShareIcon width={19} height={19} />
                                                </div>
                                            </div>
                                        </ActiveLink>
                                    );
                                })}
                        </div>
                        <MuiSnackbar isOpen={isOpen} setIsOpen={setIsOpen} message="Copied URL" severity="info" />
                    </div>
                </div>
            </ContentLayout>
        </div>
    );
}
