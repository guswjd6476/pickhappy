'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashboardPage.module.css';

// Define the type for the answer object
interface Answer {
    clientid: string;
    answers: Record<string, number>; // Answers in the form of { questionId: score }
    created_at: string;
}

interface UserResult {
    clientid: string;
    name: string;
    answers: Record<string, number>;
    created_at: string;
}

export default function DashboardPage() {
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getAnswers'); // 서버에서 데이터를 받아옴

                // 응답 상태 코드 확인
                if (!response.ok) {
                    throw new Error('서버 응답이 잘못되었습니다.');
                }

                const text = await response.text(); // 응답을 먼저 텍스트로 읽어봄
                const data = text ? JSON.parse(text) : {}; // 비어 있으면 빈 객체로 처리

                console.log(data, '?data');

                if (data.answers) {
                    const results: UserResult[] = data.answers.map((answer: Answer) => ({
                        clientid: answer.clientid,
                        name: answer.clientid, // 실제 name 필드를 데이터에서 가져오셔야 합니다
                        answers: answer.answers,
                        created_at: answer.created_at,
                    }));
                    setUserResults(results);
                }
            } catch (error) {
                console.error('데이터 로드 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (user: UserResult) => {
        const answersParam = Object.entries(user.answers)
            .map(([id, score]) => `${id}-${score}`)
            .join(',');
        router.push(`/result?clientid=${user.clientid}&answers=${answersParam}`); // 상세보기로 이동
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>상담사 대시보드</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>상세보기</th>
                        <th>참여시간</th>
                    </tr>
                </thead>
                <tbody>
                    {userResults.map((user) => (
                        <tr key={user.clientid}>
                            <td>{user.name}</td>
                            <td>{user.created_at}</td>
                            <td>
                                <button className={styles.viewButton} onClick={() => handleViewDetails(user)}>
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
