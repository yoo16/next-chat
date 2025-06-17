import { prisma } from '@/lib/prisma';
import EditUserForm from '@/app/components/EditUser';

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: Number(params.id) },
    });

    if (!user) {
        return <p>ユーザが見つかりません</p>;
    }

    return <EditUserForm user={user} />;
}