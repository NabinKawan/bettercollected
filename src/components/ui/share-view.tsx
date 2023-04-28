import React, { ReactNode, useState } from 'react';

import { FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton } from 'react-share';
import { useCopyToClipboard } from 'react-use';

import { Facebook } from '@app/components/icons/brands/facebook';
import { Linkedin } from '@app/components/icons/brands/linkedin';
import { Telegram } from '@app/components/icons/brands/telegram';
import { Twitter } from '@app/components/icons/brands/twitter';
import { Copy } from '@app/components/icons/copy';

interface Props {
    url: string;
    title?: string;
    showCopy?: boolean;
    showBorder?: boolean;
}

ShareView.defaultProps = {
    title: '',
    showCopy: true,
    showBorder: true
};

interface IconWrapperProps {
    children: ReactNode;
    showBorder?: boolean;
    className?: string;
}

export const IconWrapper = ({ children, showBorder, className = '' }: IconWrapperProps) => (
    <span
        className={`text-md flex h-12 w-12 items-center justify-center ${
            showBorder ? 'rounded-full border border-gray-200' : ''
        } text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14 ${className}`}
    >
        {children}
    </span>
);

IconWrapper.defaultProps = {
    showBorder: true
};
export default function ShareView({ url, title, showCopy, showBorder }: Props) {
    let [copyButtonStatus, setCopyButtonStatus] = useState('Copy');
    let [_, copyToClipboard] = useCopyToClipboard();
    const handleCopyToClipboard = () => {
        copyToClipboard(url);
        setCopyButtonStatus('Copied!');
        setTimeout(() => {
            setCopyButtonStatus(copyButtonStatus);
        }, 1000);
    };
    return (
        <div>
            <div className="-tracking-wide text-gray-900 ltr:text-left rtl:text-right dark:text-white body1">Share {title}</div>
            <div className="flex flex-wrap gap-2 pt-4 md:gap-2.5 xl:pt-5">
                <div className="product-share flex flex-shrink-0 flex-wrap items-center gap-2 md:gap-2.5">
                    <TwitterShareButton url={url}>
                        <IconWrapper className="hover:bg-[#1DA1F2] hover:bg-opacity-10" showBorder={showBorder}>
                            <Twitter />
                        </IconWrapper>
                        <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">Twitter</span>
                    </TwitterShareButton>
                    <FacebookShareButton url={url}>
                        <IconWrapper className="hover:bg-[#1877F2] hover:bg-opacity-10" showBorder={showBorder}>
                            <Facebook />
                        </IconWrapper>
                        <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">Facebook</span>
                    </FacebookShareButton>
                    <LinkedinShareButton url={url}>
                        <IconWrapper className="hover:bg-[#0177B5] hover:bg-opacity-10" showBorder={showBorder}>
                            <Linkedin />
                        </IconWrapper>
                        <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">Linkedin</span>
                    </LinkedinShareButton>
                    <TelegramShareButton url={url}>
                        <IconWrapper className="hover:bg-black-300 hover:bg-opacity-10" showBorder={showBorder}>
                            <Telegram className="h-5 w-5 lg:h-6 lg:w-6" />
                        </IconWrapper>
                        <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">Telegram</span>
                    </TelegramShareButton>
                </div>
                {showCopy && (
                    <button onClick={handleCopyToClipboard}>
                        <IconWrapper className="hover:bg-black-300 hover:bg-opacity-10" showBorder={showBorder}>
                            <Copy className="h-4 w-4 lg:h-5 lg:w-5" />
                        </IconWrapper>
                        <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">{copyButtonStatus}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
