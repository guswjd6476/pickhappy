import { Suspense } from 'react';
import StampName from './StampName';

export default function AdminResultPage() {
    return (
        <Suspense fallback={<p>로딩 중...</p>}>
            <StampName />
        </Suspense>
    );
}
