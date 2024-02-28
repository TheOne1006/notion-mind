"use client"
'use client'

import { useParams } from 'next/navigation'
import MarkmapHooks from './[pageid]/markmap-hooks';

export default function MarkMapPage() {
    // 获取参数
    const initValue = `
# markmap
- beautiful
- useful
- easy
- interactive
- demo
    `;

    return (
        <div><MarkmapHooks md={initValue} /></div>
    );
}
