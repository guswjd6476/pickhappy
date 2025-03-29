import { getAnswers } from '@/app/db';
import { NextRequest } from 'next/server';

// 데이터 타입 정의 (getAnswers가 반환하는 데이터의 타입)
interface AnswerData {
    answers: { [key: string]: number }; // answers는 { questionId: score } 형태로 정의
}

// 예시: /api/getAnswers API 라우트
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const clientid = searchParams.get('clientid');

    if (!clientid) {
        return new Response(JSON.stringify({ error: 'clientid is required' }), { status: 400 });
    }

    // 실제 데이터베이스에서 clientid로 데이터를 조회
    const data: any | null = await getAnswers(clientid); // 반환값을 any로 설정

    if (!data) {
        return new Response(JSON.stringify({ error: 'No data found for this clientid' }), { status: 404 });
    }

    // data가 배열인지 확인하고, 배열이면 reduce로 변환
    let answerObj = {};
    if (Array.isArray(data)) {
        // 배열이면 reduce를 사용하여 변환
        answerObj = data.reduce((acc: { [key: string]: number }, item: any) => {
            if (item.questionId && typeof item.score === 'number') {
                acc[item.questionId] = item.score;
            }
            return acc;
        }, {});
    } else if (typeof data === 'object') {
        // 객체 형식이라면 그대로 처리
        answerObj = data;
    }

    // answers 객체를 배열 형식으로 변환하여 반환
    const answerArray = Object.entries(answerObj).map(([questionId, score]) => ({
        questionId,
        score,
    }));

    return new Response(JSON.stringify({ answers: answerArray }), { status: 200 });
}
