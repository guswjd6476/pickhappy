'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './StampPage.module.css'; // CSS 모듈 import

export default function StampName() {
    const [clientid, setName] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const stampType = searchParams.get('stampType') || 'defaultStamp';

    const handleStamp = async () => {
        if (clientid.trim() === '') {
            alert('이름을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('/api/updateStamp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientid, stampType }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('도장이 성공적으로 추가되었습니다!');
                router.push(`/stamppage?clientid=${clientid}`); // 도장판 페이지로 이동
            } else {
                alert(`오류 발생: ${data.message}`);
            }
        } catch (error) {
            console.error('도장 업데이트 실패:', error);
            alert('도장을 업데이트하는 중 오류가 발생했습니다.');
        }
    };

    // stampType에 따라 제목 변경
    const getTitle = () => {
        switch (stampType) {
            case 'secondstamp':
                return '🔑 두 번째 코스: 키링 만들기 🔑';
            case 'thirdstamp':
                return '🌱 지속가능한 마음 찾기 🌱';
            default:
                return '🌼 나와 어울리는 씨 심기 🌼';
        }
    };

    return (
        <div className={styles.container}>
            {/* 배경 장식 */}
            <div className={`${styles.backgroundDecoration} ${styles.backgroundDecorationFirst}`}></div>
            <div className={`${styles.backgroundDecoration} ${styles.backgroundDecorationSecond}`}></div>

            {/* 카드 UI */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={styles.card}
            >
                <h1 className={styles.title}>{getTitle()}</h1>
                <p className={styles.description}>이름을 입력하고 도장을 찍어보세요!</p>

                <motion.input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={clientid}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    whileFocus={{ scale: 1.05 }}
                />

                {/* 도장 찍기 버튼 */}
                <motion.button onClick={handleStamp} className={styles.button} whileHover={{ scale: 1.1 }}>
                    🖍 도장 찍기 🖍
                </motion.button>
            </motion.div>
        </div>
    );
}
