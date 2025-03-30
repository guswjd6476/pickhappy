'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './ResultPage.module.css';

const types: Record<string, { name: string; plant: string; description: string }> = {
    A: {
        name: '개혁가',
        plant: '루꼴라',
        description:
            '계획적이고 체계적인 성향이 있어 규칙적으로 관리하면 잘 자라는 루꼴라와 잘 맞습니다. 발아가 빠르고 균형 잡힌 성장을 보여 완벽주의적인 성향과 잘 어울립니다.',
    },
    B: {
        name: '조력자',
        plant: '카모마일',
        description:
            '조력자는 따뜻한 성격으로 주변을 돌보는 걸 좋아하며, 카모마일은 허브 차로 활용할 수 있어 선물하기에도 좋아. 키우기도 쉬워서 부담 없이 심을 수 있어.',
    },
    C: {
        name: '성취자',
        plant: '해바라기',
        description:
            '성취자는 목표 지향적이고 성장하는 걸 좋아해. 해바라기는 빠르게 자라며 태양을 따라 움직여, 앞으로 나아가려는 에너지를 상징해.',
    },
    D: {
        name: '예술가',
        plant: '팬지',
        description:
            '예술가는 감성이 풍부하고 개성을 중요하게 여겨. 팬지는 다양한 색상의 꽃을 피우는 식물로, 예술가가 원하는 대로 자유롭게 조합해서 키울 수 있어.',
    },
    E: {
        name: '탐구자',
        plant: '바질',
        description:
            '탐구자는 지적 호기심이 많고 실험적인 걸 좋아해. 바질은 다양한 요리에 활용할 수 있어 연구하는 재미가 있어.',
    },
    F: {
        name: '충실한 유형',
        plant: '상추',
        description:
            '충실한 유형은 안정감을 중요하게 여겨. 상추는 빠르게 자라며 꾸준히 수확할 수 있어 정성을 들이면 보답을 주는 식물이라 잘 맞아.',
    },
    G: {
        name: '열정가',
        plant: '방울토마토',
        description:
            '열정가는 활발하고 즐거움을 찾는 성격이야. 방울토마토는 빨갛게 열매가 맺히며 성장 과정을 지켜보는 재미가 있어.',
    },
    H: {
        name: '지도자',
        plant: '고추',
        description:
            '지도자는 강하고 열정적인 성향이야. 고추는 강한 맛을 내며, 튼튼하게 잘 자라면서도 존재감이 확실한 식물이라 잘 어울려.',
    },
    I: {
        name: '평화주의자',
        plant: '라벤더',
        description:
            '평화주의자는 조용하고 평온한 걸 좋아해. 라벤더는 은은한 향기로 마음을 안정시키고, 집 안 분위기를 편안하게 만들어 줘.',
    },
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

    const { name, plant, description } = types[result.type];
    const imageUrl = `/${plant}.png`;

    return (
        <div className={styles.container}>
            <p className={styles.description}>
                <strong>{clientid}</strong>님의 성격 유형은 <strong>{name || '알 수 없음'}</strong>입니다.
                <br />
                당신을 닮은 식물은 <strong>{plant}</strong>입니다 🌱
            </p>

            <div className={styles.imageContainer}>
                <Image
                    src={imageUrl}
                    alt={plant}
                    width={300}
                    height={300}
                />
            </div>

            <p className={styles.explanation}>{description}</p>

            <button
                className={styles.button}
                onClick={() => window.location.reload()}
            >
                다시 시작하기
            </button>
        </div>
    );
}
