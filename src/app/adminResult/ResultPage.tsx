'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './ResultPage.module.css';

const types: Record<string, { name: string; plant: string }> = {
    A: { name: '개혁가', plant: '루꼴라' },
    B: { name: '조력자', plant: '카모마일' },
    C: { name: '성취자', plant: '해바라기' },
    D: { name: '예술가', plant: '팬지' },
    E: { name: '탐구자', plant: '바질' },
    F: { name: '충실한 유형', plant: '상추' },
    G: { name: '열정가', plant: '방울토마토' },
    H: { name: '지도자', plant: '고추' },
    I: { name: '평화주의자', plant: '라벤더' },
};

// 🔹 각 그룹(A~I)의 점수를 합산하여 결과 계산
const calculateResult = (answers: Record<string, number>) => {
    const scores: Record<string, number> = {};

    Object.entries(answers).forEach(([questionId, score]) => {
        const group = questionId[0].toUpperCase();
        scores[group] = (scores[group] || 0) + score;
    });

    const maxType = Object.entries(scores).reduce<{ type: string; score: number }>(
        (prev, [type, score]) => (prev.score > score ? prev : { type, score }),
        { type: '', score: 0 }
    );

    return { maxType, scores };
};

export default function ResultPage() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState<{ type: string; score: number } | null>(null);
    const [chartData, setChartData] = useState<{ type: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const clientid = searchParams.get('clientid');

    useEffect(() => {
        if (!clientid) return;

        const fetchAnswers = async () => {
            try {
                const response = await fetch(`/api/answers?clientid=${clientid}`);
                const data = await response.json();

                if (response.ok && data.answers) {
                    const { maxType, scores } = calculateResult(data.answers);
                    setResult(maxType);

                    const formattedChartData = Object.keys(types).map((type) => ({
                        type,
                        score: scores[type] || 0,
                    }));
                    setChartData(formattedChartData);
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnswers();
    }, [clientid]);

    if (loading) return <p>결과를 불러오는 중...</p>;
    if (!result || !result.type) return <p>결과를 계산할 수 없습니다.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>결과 페이지</h1>
            <p className={styles.description}>
                <strong>{clientid}</strong>님의 성격 유형은 <strong>{types[result.type]?.name || '알 수 없음'}</strong>
                입니다.
                <br />
                당신을 닮은 식물은 <strong>{types[result.type]?.plant || '???'}</strong> 🌱
            </p>

            <div className={styles.chartContainer}>
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={chartData}
                        className={styles.chart}
                    >
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="score"
                            fill="#ff66cc"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <button
                className={styles.button}
                onClick={() => window.location.reload()}
            >
                다시 시작하기
            </button>
        </div>
    );
}
