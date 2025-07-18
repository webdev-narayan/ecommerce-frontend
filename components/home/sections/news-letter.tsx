import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const NewsLetter = () => {
    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input placeholder="Enter your email" className="bg-white text-black border-0" />
                    <Button className="bg-white text-black hover:bg-gray-100">Subscribe</Button>
                </div>
            </div>
        </section>
    )
}

export default NewsLetter