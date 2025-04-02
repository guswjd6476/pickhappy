'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './StampPage.module.css';

const stamps = [
    { key: 'firststamp', label: '나와 맞는 식물찾기' },
    { key: 'secondstamp', label: '업사이클링 키링 만들기' },
    { key: 'thirdstamp', label: '지속 가능한 행복찾기' },
    { key: 'laststamp', label: '씨 심기' },
];

export default function StampPage() {
    const searchParams = useSearchParams();
    const clientid = searchParams.get('clientid');
    const [stampStatus, setStampStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchStamps = async () => {
            if (!clientid) return;
            try {
                const response = await fetch(`/api/getIdStamp?clientid=${clientid}`);
                const data = await response.json();
                if (response.ok) {
                    console.log(data, '?Dtatata');
                    setStampStatus(data.answers);
                } else {
                    console.error('Failed to fetch stamps:', data.message);
                }
            } catch (error) {
                console.error('Error fetching stamps:', error);
            }
        };

        fetchStamps();
    }, [clientid]);

    return (
        <div className={styles.container}>
            <h1>도장판</h1>
            <p>{clientid}님의 도장 현황</p>
            <div className={styles.stampBoard}>
                {stamps.map(({ key, label }) => (
                    <div key={key}>
                        <span>{label}</span>
                        <div className={styles.stamp}>
                            <div className={stampStatus[key] ? styles.stamped : styles.empty}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
