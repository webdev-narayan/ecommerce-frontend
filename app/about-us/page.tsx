"use client"
import { getApi } from '@/lib/api'
import MarkdownIt from 'markdown-it'
import React, { useEffect, useState } from 'react'
const markdown = MarkdownIt()

interface StorePage {
    about_us: string
}

const page = () => {
    const [data, setData] = useState<StorePage | null>(null)
    const getData = async () => {
        const res = await getApi<{ data: StorePage }>("/store-page", true)
        setData(res.data?.data ?? null)
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            {
                data && <div className='md-div mx-auto container mt-10 mb-10' dangerouslySetInnerHTML={{ __html: markdown.render(data.about_us) }}></div>
            }
        </>
    )
}

export default page