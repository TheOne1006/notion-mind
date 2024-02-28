"use client"
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import MarkmapHooks from './markmap-hooks';
import { ResponseData } from '../../../interface';

async function getMdData(pageId: string, disableCache?: string, forceRefresh?: string): Promise<ResponseData> {
    let endPoint = `/api/page2md?pageId=${pageId}`;
    if (disableCache) {
        endPoint += `&disableCache=${disableCache}`
    }
    if (forceRefresh) {
        endPoint += `&forceRefresh=${forceRefresh}`
    }
    const data = await fetch(endPoint).then((res) => res.json())
    return data
}


function useMarkMapPageInfo(pageid: string | undefined, disableCache: string = '') {

    const [md, setMd] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [err, setErr] = useState<string>('')

    function finishFetchData(data: ResponseData) {
        setLoading(false)
        if (data.md) {
            setMd(data.md)
        } else {
            setErr(data.msg)
        }
    }

    useEffect(() => {
        if (pageid) {
            setLoading(true)
            getMdData(pageid, disableCache).then(finishFetchData)
        }

    }, [pageid, disableCache]);


    function refresh() {
        if (pageid) {
            setLoading(true)
            getMdData(pageid, disableCache, 'true').then(finishFetchData)
        }
    }

    return {
        md,
        err,
        loading,
        refresh
    }
    
}

export default function MarkMapPageId() {
    // 获取当前的参数
    const params = useParams<{ pageid: string, disableCache: string }>();
    const query = useSearchParams();
    const {
        md, err, loading, refresh
    } = useMarkMapPageInfo(params?.pageid, query?.get('disableCache') || '')

    if (!params?.pageid) {
        return (<div />)
    } else if (err) {
        return (<div>err: {err}</div>)
    } else if (loading) {
        return (<div>loadding...</div>)
    }

    return (
        <div>
            {
                md && <MarkmapHooks md={md} refresh={refresh} />
            }
        </div>
    );
}
