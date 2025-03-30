import { getAnswers } from '@/app/db';

export async function GET() {
    // 전체 데이터를 가져오기 위한 요청
    const data = await getAnswers(); // clientid 없이 전체 데이터 조회

    if (!data || data.length === 0) {
        return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 });
    }

    // 전체 데이터를 그대로 반환
    return new Response(JSON.stringify({ answers: data }), { status: 200 });
}
