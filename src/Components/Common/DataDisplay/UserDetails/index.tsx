import React from 'react';

import AuthAccountProfileImage from '@app/components/auth/account-profile-image';
import { UserDto } from '@app/models/dtos/UserDto';
import { getFullNameFromUser } from '@app/utils/userUtils';

interface IUserDetailsProps {
    user: UserDto;
}

export default function UserDetails({ user }: IUserDetailsProps) {
    return (
        <div className="flex items-center space-x-3">
            <AuthAccountProfileImage image={user.profile_image} name={getFullNameFromUser(user)} size={40} />
            <div className="flex flex-col">
                <div className="body3">{getFullNameFromUser(user)}</div>

                <div className="body5 !text-black-600">{user.email}</div>
            </div>
        </div>
    );
}
