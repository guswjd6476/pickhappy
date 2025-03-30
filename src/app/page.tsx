'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './HomePage.module.css'; // CSS 모듈 import

export default function HomePage() {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleStartTest = () => {
        if (name.trim() === '') {
            alert('이름을 입력해 주세요.');
            return;
        }
        router.push(`/quiz?clientid=${name}`);
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
                {/* 작은 피크민 아이콘 */}
                <div className={styles.iconContainer}>
                    <div className={`${styles.icon} ${styles.iconYellow}`}></div>
                    <div className={`${styles.icon} ${styles.iconBlue}`}></div>
                    <div className={`${styles.icon} ${styles.iconGreen}`}></div>
                </div>

                <h1 className={styles.title}>🌱 성격 유형 검사 🌱</h1>
                <p className={styles.description}>간단한 질문에 답하고, 당신에게 어울리는 성격과 식물을 알아보세요!</p>

                <motion.input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    whileFocus={{ scale: 1.05 }}
                />

                {/* 버튼 */}
                <motion.button onClick={handleStartTest} className={styles.button} whileHover={{ scale: 1.1 }}>
                    🍀 테스트 시작하기 🍀
                </motion.button>
            </motion.div>
        </div>
    );
}
