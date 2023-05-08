import Tooltip from '@Components/Common/DataDisplay/Tooltip';
import MuiButton from '@mui/material/Button';

interface IWorkspaceDashboardStatsButtonProps {
    enabled?: boolean;
    text?: string;
    onClick?: any;
}

interface IWorkspaceDashboardStats {
    tooltipTitle: string;
    title: string;
    content: string;
    buttonProps?: IWorkspaceDashboardStatsButtonProps;
}

const WorkspaceDashboardStats = ({ tooltipTitle, title, content, buttonProps }: IWorkspaceDashboardStats) => {
    return (
        <div className="px-6 py-6 bg-white rounded-[4px] flex flex-col gap-6">
            <p className="body3 !not-italic text-black-700">{title}</p>
            <div className="flex flex-row gap-6 justify-between">
                <Tooltip title={tooltipTitle}>
                    <p className="sh1 text-black-700">{content}</p>
                </Tooltip>
                {!!buttonProps?.enabled && buttonProps?.onClick && buttonProps?.text && (
                    <MuiButton onClick={buttonProps?.onClick} size="small" className="body4 !not-italic !text-brand-500">
                        {buttonProps?.text}
                    </MuiButton>
                )}
            </div>
        </div>
    );
};

export default WorkspaceDashboardStats;
