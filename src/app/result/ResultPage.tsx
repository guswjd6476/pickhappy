'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
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
    const clientid = searchParams.get('clientid');

    useEffect(() => {
        const answersParam = searchParams.get('answers');
        if (answersParam) {
            const urlAnswers = answersParam.split(',').reduce((acc, item) => {
                const [id, score] = item.split('-');
                acc[id] = parseInt(score, 10);
                return acc;
            }, {} as Record<string, number>);

            const { maxType } = calculateResult(urlAnswers);
            setResult(maxType);
        }
    }, [searchParams]);

    if (!result || !result.type) return <p>결과를 계산 중입니다...</p>;

    const plantName = types[result.type]?.plant || '알 수 없음';
    const imageUrl = `/${plantName}.png`;

    return (
        <div className={styles.container}>
            <p className={styles.description}>
                <strong>{clientid}</strong>님의 성격 유형은 <strong>{types[result.type]?.name || '알 수 없음'}</strong>{' '}
                입니다.
                <br />
                당신을 닮은 식물은 <strong>{plantName}</strong> 🌱
            </p>

            <div className={styles.imageContainer}>
                <Image
                    src={imageUrl}
                    alt={plantName}
                    width={300}
                    height={300}
                />
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
