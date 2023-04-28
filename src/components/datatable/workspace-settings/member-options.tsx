import React from 'react';

import { DeleteOutline, MoreHoriz } from '@mui/icons-material';
import { IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';

import { useModal } from '@app/components/modal-views/context';

export default function MemberOptions({ member }: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentActiveMember, setCurrentActiveMember] = React.useState<any | null>(null);
    const open = Boolean(anchorEl);

    const { openModal } = useModal();
    const handleClick = (event: React.MouseEvent<HTMLElement>, f: any) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentActiveMember(f);
    };

    return (
        <>
            <Tooltip title="Options" arrow={true} placement="top-start" enterDelay={300} enterTouchDelay={0}>
                <IconButton
                    className="rounded-[4px] text-black-900 hover:rounded-[4px] hover:bg-black-200"
                    onClick={(e) => handleClick(e, member)}
                    size="small"
                    aria-controls={open ? 'forms-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <MoreHoriz />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="forms-menu"
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                disableScrollLock={true}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: 230,
                        overflow: 'hidden',
                        borderRadius: 1,
                        filter: 'drop-shadow(0px 0px 15px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 2,
                            borderRadius: 1
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={() => {
                        openModal('DELETE_MEMBER', { member });
                    }}
                    className="body4"
                >
                    <ListItemIcon>
                        <DeleteOutline fontSize="small" color="error" />
                    </ListItemIcon>
                    <span className="text-[#d32f2f]">Delete</span>
                </MenuItem>
            </Menu>
        </>
    );
}
