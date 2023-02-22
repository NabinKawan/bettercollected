import WorkspaceHomeContainer from '@app/containers/dashboard/WorkspaceHomeContainer';
import { getGlobalServerSidePropsByWorkspaceName } from '@app/lib/serverSideProps';
import { checkHasCustomDomain } from '@app/utils/serverSidePropsUtils';

export default function WorkspacePage({ workspace }: { workspace: any }) {
    return <WorkspaceHomeContainer workspace={workspace} isCustomDomain={false} />;
}

export async function getServerSideProps(_context: any) {
    const hasCustomDomain = checkHasCustomDomain(_context);
    if (hasCustomDomain) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };
    }
    const globalProps = (await getGlobalServerSidePropsByWorkspaceName(_context)).props;
    if (!globalProps.workspace?.id) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            ...globalProps
        }
    };
}
