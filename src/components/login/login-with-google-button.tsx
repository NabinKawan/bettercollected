import ProviderLoginButton from './provider-login-btn';

interface ConnectWithProviderButtonProps {
    text: string;
    url: string;
    type?: 'light' | 'dark' | 'typeform';
    creator?: boolean;
}

ConnectWithProviderButton.defaultProps = {
    creator: false,
    type: 'dark'
};

export default function ConnectWithProviderButton(props: ConnectWithProviderButtonProps) {
    const { url, text, type, creator } = props;

    return (
        <a href={`${url}${creator ? '?creator=true' : ''}`} referrerPolicy="unsafe-url" className={`mx-auto w-fit flex items-center justify-center`}>
            <ProviderLoginButton label={text} type={type} onClick={() => {}} />
        </a>
    );
}
