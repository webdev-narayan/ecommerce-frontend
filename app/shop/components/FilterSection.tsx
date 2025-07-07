import { Brand } from '@/app/dashboard/brands/brand.type';
import { Category } from '@/app/dashboard/categories/categories.type';
import { VariantAttribute } from '@/app/dashboard/products/attributes/attribute.type';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DualSlider } from '@/components/ui/dua-range-slider';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, Search } from 'lucide-react'
import React from 'react'

interface FilterSectionProps {
    categories: Category[];
    brands: Brand[];
    selectedVariantOptions: number[];
    searchQuery: string;

    priceRange: number[];
    selectedCategories: number[];
    selectedBrands: number[];
    attributes: VariantAttribute[];

    setSearchQuery: any;
    setPriceRange: any;
    handleCategoryChange: any;
    handleBrandChange: any;
    handleSizeChange: any;
    clearAllFilters: any;
    isMobile?: boolean
}

const FilterSection = ({
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    categories,
    selectedCategories,
    handleCategoryChange,
    brands,
    selectedBrands,
    handleBrandChange,
    attributes,
    selectedVariantOptions,
    handleSizeChange,
    clearAllFilters,
    isMobile = false
}: FilterSectionProps) => {

    return (
        <>{
            isMobile ?

                <ScrollArea className='h-[50vh] px-2' scrollHideDelay={100}>
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="col-span-2 p-1">
                            <Label className="text-sm font-medium mb-2 block">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="col-span-2 p-1">
                            <Label className="text-sm font-medium mb-2 block">
                                Price Range: ₹ {priceRange[0]} - ₹ {priceRange[1]}
                            </Label>
                            <DualSlider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={10000}
                                min={0}
                                step={100}
                                className="w-full"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Categories</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((category) => (
                                    <div key={category.documentId} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={category.documentId}
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                                        />
                                        <Label htmlFor={category.documentId} className="text-sm">
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Brands</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {brands.map((brand) => (
                                    <div key={brand.documentId} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={brand.documentId}
                                            checked={selectedBrands.includes(brand.id)}
                                            onCheckedChange={(checked) => handleBrandChange(brand.id, checked)}
                                        />
                                        <Label htmlFor={brand.documentId} className="text-sm">
                                            {brand.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {attributes.length > 0 && attributes.filter(atr => atr.variant_options.length > 0).map(item => {
                            return <div key={item.documentId}>
                                <Label className="text-sm font-medium mb-2 block">{item.name}</Label>
                                <div className="flex flex-wrap gap-2 gap-x-4">
                                    {item.variant_options.map((vop) => (
                                        <div key={vop.documentId} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={vop.documentId}
                                                checked={selectedVariantOptions.includes(vop.id)}
                                                onCheckedChange={(checked) => handleSizeChange(vop.id, checked)}
                                            />
                                            <Label htmlFor={vop.documentId} className="text-xs">
                                                {vop.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        })}


                        <div className="flex gap-2">
                            <Button variant="outline" onClick={clearAllFilters} className="w-full">
                                <Filter /> Clear Filters
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
                :
                <div className="space-y-6 md:block grid grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="col-span-2">
                        <Label className="text-sm font-medium mb-2 block">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            // autoFocus
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="col-span-2">
                        <Label className="text-sm font-medium mb-2 block">
                            Price Range: ₹ {priceRange[0]} - ₹ {priceRange[1]}
                        </Label>
                        <DualSlider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={10000}
                            min={0}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Categories</Label>
                        <div className="space-y-2">
                            <ScrollArea className="h-36">
                                {categories.map((category) => (
                                    <div key={category.documentId} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={category.documentId}
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                                        />
                                        <Label htmlFor={category.documentId} className="text-sm">
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Brands */}
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Brands</Label>
                        <div className="space-y-2">
                            {brands.map((brand) => (
                                <div key={brand.documentId} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={brand.documentId}
                                        checked={selectedBrands.includes(brand.id)}
                                        onCheckedChange={(checked) => handleBrandChange(brand.id, checked)}
                                    />
                                    <Label htmlFor={brand.documentId} className="text-sm">
                                        {brand.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {attributes.length > 0 && attributes.filter(atr => atr.variant_options.length > 0).map(item => {
                        return <div key={item.documentId}>
                            <Label className="text-sm font-medium mb-2 block">{item.name}</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {item.variant_options.map((vop) => (
                                    <div key={vop.documentId} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={vop.documentId}
                                            checked={selectedVariantOptions.includes(vop.id)}
                                            onCheckedChange={(checked) => handleSizeChange(vop.id, checked)}
                                        />
                                        <Label htmlFor={vop.documentId} className="text-xs">
                                            {vop.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    })}


                    <div className="flex gap-2">
                        {/* Clear Filters */}
                        {/* <Button size={"sm"} variant="outline" onClick={clearAllFilters} className="w-full">
          <Filter /> Apply
          </Button> */}

                        {/* Clear Filters */}
                        <Button size={"sm"} variant="outline" onClick={clearAllFilters} className="w-full">
                            <Filter /> Clear
                        </Button>
                    </div>
                </div>

        }
        </>
    )
}



export default FilterSection