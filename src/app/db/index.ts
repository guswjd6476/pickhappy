import { Pool } from 'pg';

// 데이터베이스 연결 풀 설정 (커넥션 풀)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// 서버가 시작될 때 연결
pool.connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Connection error', err.stack));

// 데이터 삽입 함수
export const insertAnswers = async (clientid: string, answers: Record<string, number>) => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query = 'INSERT INTO responses (clientid, answers) VALUES ($1, $2)';
        await client.query(query, [clientid, JSON.stringify(answers)]); // clientid와 answers를 함께 저장
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        throw new Error('Error inserting data');
    } finally {
        client.release(); // 쿼리 후 클라이언트 반환
    }
};

interface AnswerData {
    clientid: string;
    answers: Record<string, number>;
    created_at: string;
}
interface StampData {
    clientid: string;
    firststamp: boolean;
    secondstamp: boolean;
    thirdstamp: boolean;
    laststamp: boolean;
}

// 모든 답변 조회 함수
export const getAnswers = async (): Promise<AnswerData[] | null> => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query = 'SELECT clientid, answers, created_at FROM responses';
        const { rows } = await client.query(query);

        if (rows.length === 0) {
            return null;
        }

        return rows.map((row) => ({
            clientid: row.clientid,
            answers: row.answers, // 이미 JavaScript 객체이므로 별도로 파싱할 필요 없음
            created_at: row.created_at,
        }));
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('데이터베이스 연결 오류');
    } finally {
        client.release(); // 쿼리 후 클라이언트 반환
    }
};

// 특정 clientid의 답변 조회 함수
export const getIdAnswers = async (clientid: string): Promise<AnswerData | null> => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query = 'SELECT clientid, answers, created_at FROM responses WHERE clientid = $1';
        const { rows } = await client.query(query, [clientid]);

        if (rows.length === 0) {
            return null;
        }

        return {
            clientid: rows[0].clientid,
            answers: rows[0].answers, // jsonb 형태로 반환되면 파싱
            created_at: rows[0].created_at,
        };
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('데이터 조회 중 오류 발생');
    } finally {
        client.release(); // 쿼리 후 클라이언트 반환
    }
};

export const deleteUser = async (clientid: string): Promise<void> => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query = 'DELETE FROM responses WHERE clientid = $1'; // 삭제 쿼리
        await client.query(query, [clientid]);
        console.log(`User with clientid ${clientid} deleted successfully`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('사용자 삭제 중 오류 발생');
    } finally {
        client.release(); // 쿼리 후 클라이언트 반환
    }
};
export const updateStamp = async (
    clientid: string,
    stampType: 'firststamp' | 'secondstamp' | 'thirdstamp' | 'laststamp'
): Promise<void> => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query = `UPDATE responses SET ${stampType} = TRUE WHERE clientid = $1;`;
        await client.query(query, [clientid]);
    } catch (error) {
        console.error('도장 업데이트 오류:', error);
    } finally {
        client.release(); // 커넥션 반환
    }
};

export const getIdStamp = async (clientid: string): Promise<StampData | null> => {
    const client = await pool.connect(); // 커넥션 풀에서 클라이언트 가져오기
    try {
        const query =
            'SELECT clientid, firststamp, secondstamp,thirdstamp,thirdstamp,laststamp FROM responses WHERE clientid = $1';
        const { rows } = await client.query(query, [clientid]);

        if (rows.length === 0) {
            return null;
        }

        return {
            clientid: rows[0].clientid,
            firststamp: rows[0].firststamp, // jsonb 형태로 반환되면 파싱
            secondstamp: rows[0].secondstamp,
            thirdstamp: rows[0].thirdstamp,
            laststamp: rows[0].laststamp,
        };
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('데이터 조회 중 오류 발생');
    } finally {
        client.release(); // 쿼리 후 클라이언트 반환
    }
};
