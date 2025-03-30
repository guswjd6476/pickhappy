'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '../lib/questions';
import styles from './QuizPage.module.css'; // CSS 모듈 import

export default function QuizPage() {
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [current, setCurrent] = useState<number>(0);
    const router = useRouter();
    const [clientName, setClientName] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('clientid');
        if (name) setClientName(name);
    }, []);

    const handleAnswer = (id: string, score: number) => {
        setAnswers((prev) => ({ ...prev, [id]: score }));
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handleSubmitResults = async () => {
        if (!clientName) {
            alert('사용자 이름을 가져올 수 없습니다.');
            return;
        }

        try {
            const queryString = Object.entries(answers)
                .map(([key, value]) => `${key}-${value}`)
                .join(',');

            router.push(`/result?clientid=${encodeURIComponent(clientName)}&answers=${queryString}`);
        } catch (error) {
            console.error('❌ 데이터 저장 중 오류 발생:', error);
            alert('데이터 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* 피크민 아이콘 */}
                <div className={styles.iconContainer}>
                    <div className={`${styles.icon} ${styles.iconGreen}`}></div>
                    <div className={`${styles.icon} ${styles.iconBlue}`}></div>
                    <div className={`${styles.icon} ${styles.iconGreen}`}></div>
                </div>

                {/* 진행 바 */}
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* 질문 텍스트 */}
                <h2 className={styles.question}>{questions[current].question}</h2>

                <div className={styles.buttonContainer}>
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            className={styles.button}
                            onClick={() => handleAnswer(questions[current].id, score)}
                        >
                            {score}
                        </button>
                    ))}
                </div>
            </div>
            {/* 결과 제출 버튼 */}
            {current === questions.length - 1 && (
                <button className={styles.submitButton} onClick={handleSubmitResults}>
                    결과 보기
                </button>
            )}
        </div>
    );
}
