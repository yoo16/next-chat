'use client';

import EditUserForm from '@/app/components/EditUser';
import { useAuthUser } from '@/app/hooks/useAuthUser';

export default function EditUserPage() {
    const { user, token, userId } = useAuthUser();

    if (!user) {
        return <p>ユーザが見つかりません</p>;
    }

    return <EditUserForm user={user} />;
}