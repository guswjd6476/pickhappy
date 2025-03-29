import { Client } from 'pg';

// 단일 데이터베이스 클라이언트 설정
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

client
    .connect()
    .then(() => console.log('✅ Database connected'))
    .catch((err) => console.error('❌ Connection error', err.stack));

// 🔹 데이터 삽입 함수 (JSONB 저장)
export const insertAnswers = async (clientid: string, answers: Record<string, number>) => {
    try {
        const query = 'INSERT INTO responses (clientid, answers) VALUES ($1, $2)';
        await client.query(query, [clientid, answers]); // JSON 데이터를 그대로 저장
        console.log('✅ Data inserted successfully');
    } catch (error) {
        console.error('❌ Error inserting data:', error);
        throw new Error('Error inserting data');
    }
};

// 🔹 데이터 조회 함수 (JSONB 조회)
interface AnswerData {
    answers: Record<string, number>;
}

export async function getAnswers(clientid: string): Promise<AnswerData | null> {
    try {
        const query = 'SELECT answers FROM responses WHERE clientid = $1';
        const { rows } = await client.query(query, [clientid]);

        if (rows.length === 0) {
            return null;
        }

        return rows[0]; // JSONB 데이터 그대로 반환
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw new Error('데이터베이스 연결 오류');
    }
}

// 서버 종료 시 클라이언트 종료 처리
process.on('exit', () => {
    client.end();
});
