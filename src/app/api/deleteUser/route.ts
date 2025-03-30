import { NextResponse } from 'next/server';
import { deleteUser } from '../../db'; // DB 모듈에서 deleteUser 함수 임포트

export async function DELETE(request: Request) {
    try {
        const { clientid } = await request.json(); // 클라이언트로부터 clientid를 받습니다.

        if (!clientid) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        // 삭제 로직 호출
        await deleteUser(clientid);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}
