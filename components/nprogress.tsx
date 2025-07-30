'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function NProgressProvider() {
    const pathname = usePathname()
    const previousPath = useRef<string | null>(null)
    NProgress.configure({ showSpinner: false })
    useEffect(() => {
        if (previousPath.current !== pathname) {
            NProgress.start()
            previousPath.current = pathname

            // Simulate route loading delay; you can remove this if not needed
            const timeout = setTimeout(() => {
                NProgress.done()
            }, 300) // adjust as needed

            return () => clearTimeout(timeout)
        }
    }, [pathname])

    return null
}
