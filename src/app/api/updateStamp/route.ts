import { NextResponse } from 'next/server';
import { updateStamp } from '@/app/db';

export async function POST(request: Request) {
    try {
        const { clientid, stampType } = await request.json();

        if (!clientid || !['firststamp', 'secondstamp', 'thirdstamp', 'laststamp'].includes(stampType)) {
            return NextResponse.json(
                { message: '유효한 clientid와 올바른 stampType을 전달해야 합니다.' },
                { status: 400 } // 잘못된 요청
            );
        }

        console.log('Received data:', { clientid, stampType });
        await updateStamp(clientid, stampType);

        return NextResponse.json({ message: '도장이 성공적으로 업데이트되었습니다.' }, { status: 200 });
    } catch (error: unknown) {
        // error가 Error 인스턴스인지 확인 후 처리
        if (error instanceof Error) {
            console.error('Error updating stamp:', error.message);
            console.error('Error stack:', error.stack);
            return NextResponse.json(
                { message: '도장 업데이트 중 오류가 발생했습니다.', error: error.message },
                { status: 500 } // 서버 오류
            );
        }

        // 예상하지 못한 에러에 대한 처리
        console.error('Unknown error:', error);
        return NextResponse.json({ message: '도장 업데이트 중 알 수 없는 오류가 발생했습니다.' }, { status: 500 });
    }
}
