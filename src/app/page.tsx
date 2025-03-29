'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';

// 애니메이션 효과
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: radial-gradient(circle, rgba(240, 255, 220, 0.7), rgba(185, 255, 185, 0.7)); /* 부드러운 초록색 */
    text-align: center;
`;

const Card = styled.div`
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    animation: ${fadeIn} 0.5s ease-in-out;
    max-width: 400px;
    width: 90%;
    border: 2px solid #a8e6cf; /* 민트색 테두리 */
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: bold;
    color: #4caf50; /* 푸르른 초록색 */
    margin-bottom: 10px;
`;

const Description = styled.p`
    font-size: 16px;
    color: #333333; /* 부드러운 그레이 색상 */
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #8bc34a; /* 자연스러운 초록색 테두리 */
    border-radius: 10px;
    outline: none;
    transition: 0.3s;
    margin-bottom: 20px;
    &:focus {
        border-color: #4caf50; /* 푸르른 초록색 포커스 */
    }
`;

const Button = styled.button`
    margin-top: 10px;
    padding: 12px 20px;
    font-size: 18px;
    background-color: #66bb6a; /* 밝은 초록색 */
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background-color: #388e3c; /* 어두운 초록색 */
    }
`;

export default function HomePage() {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleStartTest = () => {
        if (name.trim() === '') {
            alert('이름을 입력해 주세요.');
            return;
        }
        const clientId = new Date().getTime().toString(); // 간단한 고유 ID 생성 (현재 시간 기반)
        router.push(`/quiz?clientid=${name}`); // clientid를 URL에 추가하여 퀴즈 페이지로 이동
    };

    return (
        <Container>
            <Card>
                <Title>성격 유형 검사 시작!</Title>
                <Description>간단한 질문에 답하고, 당신에게 맞는 성격 유형과 식물을 알아보세요!</Description>
                <Input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={handleStartTest}>테스트 시작하기</Button>
            </Card>
        </Container>
    );
}
