"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    initialRating?: number
    onRatingChange?: (rating: number) => void
    size?: "sm" | "md" | "lg"
    readonly?: boolean
    className?: string
}

export default function StarRating({
    initialRating = 0,
    onRatingChange,
    size = "md",
    readonly = false,
    className,
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating)
    const [hoverRating, setHoverRating] = useState(0)

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    }

    const handleClick = (value: number) => {
        if (readonly) return
        setRating(value)
        onRatingChange?.(value)
    }

    const handleMouseEnter = (value: number) => {
        if (readonly) return
        setHoverRating(value)
    }

    const handleMouseLeave = () => {
        if (readonly) return
        setHoverRating(0)
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating)
                return (
                    <button
                        key={star}
                        type="button"
                        className={cn(
                            "transition-all duration-150 ease-in-out",
                            !readonly &&
                            "hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded",
                            readonly ? "cursor-default" : "cursor-pointer",
                        )}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readonly}
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "transition-colors duration-150",
                                isFilled ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300 hover:text-yellow-400",
                            )}
                        />
                    </button>
                )
            })}
            <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating}/5` : "No rating"}</span>
        </div>
    )
}
