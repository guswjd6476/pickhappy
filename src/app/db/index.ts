import { Client } from 'pg';

// 데이터베이스 클라이언트 초기화 (한 번만 연결)
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// 서버가 시작될 때 연결
client
    .connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Connection error', err.stack));

// 데이터 삽입 함수
export const insertAnswers = async (clientid: string, answers: Record<string, number>) => {
    try {
        const query = 'INSERT INTO responses (clientid, answers) VALUES ($1, $2)';
        await client.query(query, [clientid, JSON.stringify(answers)]); // clientid와 answers를 함께 저장
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        throw new Error('Error inserting data');
    }
};

// 전체 데이터를 조회하는 함수
interface AnswerData {
    clientid: string; // 각 응답에 대해 clientid도 함께 반환
    answers: Record<string, number>; // answers의 타입을 Record<string, number>로 정의
    created_at: string; // created_at 필드 추가
}

export const getAnswers = async (): Promise<AnswerData[] | null> => {
    try {
        const query = 'SELECT clientid, answers, created_at FROM responses';
        const { rows } = await client.query(query);

        if (rows.length === 0) {
            return null; // 데이터가 없으면 null 반환
        }

        return rows.map((row) => ({
            clientid: row.clientid,
            answers: row.answers, // jsonb로 저장된 객체를 그대로 반환
            created_at: row.created_at, // 생성일 추가
        }));
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('데이터베이스 연결 오류');
    }
};
export const getIdAnswers = async (clientid: string): Promise<AnswerData | null> => {
    try {
        const query = 'SELECT clientid, answers, created_at FROM responses WHERE clientid = $1';
        const { rows } = await client.query(query, [clientid]);

        if (rows.length === 0) {
            return null; // 해당 clientid의 데이터가 없으면 null 반환
        }

        return {
            clientid: rows[0].clientid,
            answers: rows[0].answers, // jsonb 객체 그대로 반환
            created_at: rows[0].created_at, // 생성일 포함
        };
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('데이터 조회 중 오류 발생');
    }
};

// 서버 종료 시 클라이언트 종료 처리
