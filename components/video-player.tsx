import { cn, mediaUrlGenerator } from '@/lib/utils'
import React from 'react'

interface VideoPlayerProps {
    url: string | undefined
    className?: string
    controls?: boolean
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    playsInline?: boolean
    preload?: string
}

const VideoPlayer = ({ url, controls = true, autoPlay = true, loop = true, muted = true, playsInline = true, preload = "auto", className }: VideoPlayerProps) => {
    if (!url) return null
    return (
        <video src={mediaUrlGenerator(url)}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            preload={preload}
            className={cn(`object-contain mx-auto w-full`, className)}
        >
        </video>
    )
}

export default VideoPlayer