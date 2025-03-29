'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { questions } from '../lib/questions';

const Container = styled.div`
    text-align: center;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background: radial-gradient(circle, rgba(240, 250, 255, 1), rgba(200, 230, 255, 1));
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ProgressBarContainer = styled.div`
    width: 80%;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
    height: 12px;
    background: linear-gradient(90deg, #ffb347, #ffcc33);
    width: ${({ progress }) => progress}%;
    transition: width 0.4s ease-in-out;
`;

const QuestionText = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

const ButtonGrid = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button`
    padding: 12px 24px;
    background: #6fdc6f;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    font-family: 'Poppins', sans-serif;

    &:hover {
        background: #4bb94b;
    }
`;

export default function QuizPage() {
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [current, setCurrent] = useState(0);
    const router = useRouter();
    const [clientName, setClientName] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('clientid'); // clientid를 이름으로 사용
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
            const response = await fetch('/api/submitAnswers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientid: clientName, answers }),
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }

            // 🔹 JSONB 형태로 정리하여 result 페이지로 전달
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
        <Container>
            <ProgressBarContainer>
                <ProgressBarFill progress={((current + 1) / questions.length) * 100} />
            </ProgressBarContainer>

            <QuestionText>{questions[current].question}</QuestionText>

            <ButtonGrid>
                {[1, 2, 3, 4, 5].map((score) => (
                    <Button key={score} onClick={() => handleAnswer(questions[current].id, score)}>
                        {score}
                    </Button>
                ))}
            </ButtonGrid>

            {current === questions.length - 1 && <Button onClick={handleSubmitResults}>결과 보기</Button>}
        </Container>
    );
}
