import { Suspense } from 'react';
import StampPage from './StampPage';

export default function AdminResultPage() {
    return (
        <Suspense fallback={<p>로딩 중...</p>}>
            <StampPage />
        </Suspense>
    );
}
