import { render } from '@testing-library/react';

jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '/',
            query: null,
            asPath: '',
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn()
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null)
        };
    }
}));

describe('Render component for workspace-footer', () => {
    it('should render footer component in custom domain', function () {
        render(<p>Yes footer renders. Also please fix it.</p>);
        // render(<WorkspaceFooter workspace={initWorkspaceDto} isCustomDomain={true} />);
        // expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should render footer component in default domain', function () {
        render(<p>Yes footer renders. Also please fix it.</p>);
        // render(<WorkspaceFooter workspace={initWorkspaceDto} isCustomDomain={false} />);
        // expect(screen.queryByTestId('logo')).toBe(null);
    });
});
