'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
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

// Define a type for the chart data
interface ChartData {
    subject: string;
    type: string;
    score: number;
}

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
    const [chartData, setChartData] = useState<ChartData[]>([]); // Use the specific ChartData type here
    const [loading, setLoading] = useState(true);
    const clientid = searchParams.get('clientid');
    const testDate = new Date().toLocaleDateString(); // 검사 날짜

    useEffect(() => {
        if (!clientid) return;

        const fetchAnswers = async () => {
            try {
                const response = await fetch(`/api/getIdAnswers?clientid=${clientid}`);
                const data = await response.json();

                if (response.ok && data.answers) {
                    const { maxType, scores } = calculateResult(data.answers.answers);
                    setResult(maxType);

                    // RadarChart 데이터 포맷팅
                    const formattedChartData = Object.keys(types).map((type) => ({
                        subject: types[type].name,
                        type, // A, B, C, D 추가
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

    if (loading) return <p className={styles.loading}>결과를 불러오는 중...</p>;
    if (!result || !result.type) return <p className={styles.error}>결과를 계산할 수 없습니다.</p>;

    return (
        <div className={styles.container}>
            <div className={styles.reportBox}>
                <h1 className={styles.title}>성격 유형 검사 결과</h1>
                <p className={styles.testInfo}>
                    <strong>검사 ID:</strong> {clientid} <br />
                    <strong>검사 날짜:</strong> {testDate}
                </p>
                <p className={styles.resultText}>
                    당신의 주요 성격 유형은 <strong>{types[result.type]?.name || '알 수 없음'}</strong>입니다.
                    <br />
                    당신을 닮은 식물은 <strong>{types[result.type]?.plant || '???'}</strong> 🌱 입니다.
                </p>

                {chartData.length > 0 && (
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer
                            width="100%"
                            height={500}
                        >
                            <RadarChart
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                data={chartData}
                            >
                                <PolarGrid />
                                <PolarAngleAxis
                                    dataKey="type" // A, B, C, D
                                    tickFormatter={(value) => `${value}`} // 라벨 표시
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 10]}
                                />
                                <Radar
                                    name="성격 점수"
                                    dataKey="score"
                                    stroke="#00796b"
                                    fill="#00796b"
                                    fillOpacity={0.6}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <table className={styles.resultTable}>
                    <thead>
                        <tr>
                            <th>유형</th>
                            <th>설명</th>
                            <th>점수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map(({ type, score }) => (
                            <tr
                                key={type}
                                className={result.type === type ? styles.highlightRow : ''}
                            >
                                <td>{type}</td>
                                <td>{types[type]?.name}</td> {/* Correctly accessing name */}
                                <td>{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
