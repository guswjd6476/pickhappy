'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashboardPage.module.css';

interface Answer {
    clientid: string;
    answers: Record<string, number>;
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
    const [searchQuery, setSearchQuery] = useState<string>(''); // 이름 검색
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getAnswers');

                if (!response.ok) {
                    throw new Error('서버 응답이 잘못되었습니다.');
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                console.log(data, '?data');

                if (data.answers) {
                    const results: UserResult[] = data.answers.map((answer: Answer) => ({
                        clientid: answer.clientid,
                        name: answer.clientid, // 실제 name 필드를 데이터에서 가져오셔야 합니다
                        answers: answer.answers,
                        created_at: answer.created_at,
                    }));

                    // 시간순으로 내림차순 정렬
                    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
        router.push(`/adminResult?clientid=${user.clientid}`);
    };

    const handleDelete = async (clientid: string) => {
        // 삭제 확인 메시지
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

        if (confirmDelete) {
            try {
                const response = await fetch('/api/deleteUser', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ clientid }),
                });

                if (!response.ok) {
                    throw new Error('삭제 실패');
                }

                // 삭제 성공 시, 목록에서 해당 사용자 삭제
                setUserResults(userResults.filter((user) => user.clientid !== clientid));
                console.log(`User with clientid ${clientid} deleted successfully`);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredResults = userResults.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>상담사 대시보드</h1>

            {/* 이름으로 찾기 기능 */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="이름으로 검색..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>상세보기</th>
                        <th>참여시간</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredResults.map((user) => (
                        <tr key={user.clientid}>
                            <td>{user.name}</td>
                            <td>{user.created_at}</td>
                            <td>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => handleViewDetails(user)}
                                >
                                    상세보기
                                </button>
                            </td>
                            <td>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(user.clientid)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
