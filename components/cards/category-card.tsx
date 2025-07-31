import { Category } from '@/app/dashboard/categories/categories.type'
import { mediaUrlGenerator } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

const CategoryCard = ({ category }: { category: Category }) => {

    return (
        <div onClick={() => redirect(`/shop?category=${category.id}`)} className='rounded-2xl relative aspect-[3/2] overflow-hidden cursor-pointer'>
            <Image
                width={250}
                height={250}
                alt={category.name}
                className='w-full h-full object-cover'
                src={mediaUrlGenerator(category.thumbnail?.url)}
            />
            <div className='absolute bg-gradient-to-t from-black/60 to-transparent bottom-0 w-full h-[70%]'></div>
            <span className='absolute bottom-4 left-4 text-white lg:text-2xl text-lg font-semibold max-w-[60%]'>{category.name}</span>
            {/* <ArrowRight className='absolute bottom-4 right-4 text-white w-8 h-8' /> */}
        </div>
    )
}

export default CategoryCard