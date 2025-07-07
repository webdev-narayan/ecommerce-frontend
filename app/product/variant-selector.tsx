"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface VariantOption {
    id: number
    name: string
    variant_attribute: {
        id: number
        name: string
    }
}

interface ProductVariant {
    id: number
    documentId: string
    sku: string | null
    price: number
    quantity: number
    mrp: number
    variant_options?: VariantOption[]
}

interface VariantSelectorProps {
    product_variants: ProductVariant[]
    onSelect: (variantId: number) => void
    onNoCombination: () => void
    className?: string
}

export default function VariantSelector({
    product_variants,
    onSelect,
    onNoCombination,
    className,
}: VariantSelectorProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    // Extract all available attributes and their options
    const availableAttributes = useMemo(() => {
        const attributeMap = new Map<string, Set<string>>()

        product_variants.forEach((variant) => {
            variant?.variant_options?.forEach((option) => {
                const attributeName = option.variant_attribute.name
                if (!attributeMap.has(attributeName)) {
                    attributeMap.set(attributeName, new Set())
                }
                attributeMap.get(attributeName)!.add(option.name)
            })
        })

        // Convert to array format for easier rendering
        return Array.from(attributeMap.entries()).map(([attributeName, optionsSet]) => ({
            name: attributeName,
            options: Array.from(optionsSet),
        }))
    }, [product_variants])

    // Find matching variant based on selected options
    const findMatchingVariant = useMemo(() => {
        const selectedKeys = Object.keys(selectedOptions)

        // If no options selected, return null
        if (selectedKeys.length === 0) return null

        // Find variant that matches all selected options
        const matchingVariant = product_variants.find((variant) => {
            return selectedKeys.every((attributeName) => {
                const selectedValue = selectedOptions[attributeName]
                return variant.variant_options?.some(
                    (option) => option.variant_attribute.name === attributeName && option.name === selectedValue,
                )
            })
        })

        return matchingVariant || null
    }, [selectedOptions, product_variants])

    // Get all variants that contain a specific option
    const getVariantsWithOption = (attributeName: string, optionValue: string) => {
        return product_variants.filter((variant) =>
            variant.variant_options?.some(
                (option) => option.variant_attribute.name === attributeName && option.name === optionValue,
            ),
        )
    }

    // Check if an option is available (exists in at least one variant)
    const isOptionAvailable = (attributeName: string, optionValue: string) => {
        return getVariantsWithOption(attributeName, optionValue).length > 0
    }

    // Handle option selection with smart conflict resolution
    const handleOptionSelect = (attributeName: string, optionValue: string) => {
        // Get all variants that have this option
        const variantsWithThisOption = getVariantsWithOption(attributeName, optionValue)

        if (variantsWithThisOption.length === 0) return

        // Start with the new selection
        const newSelectedOptions = {
            ...selectedOptions,
            [attributeName]: optionValue,
        }

        // Check if current combination is valid
        const isCurrentCombinationValid = product_variants.some((variant) => {
            return Object.entries(newSelectedOptions).every(([attr, value]) =>
                variant.variant_options?.some((option) => option.variant_attribute.name === attr && option.name === value),
            )
        })

        if (isCurrentCombinationValid) {
            // If the combination is valid, use it as is
            setSelectedOptions(newSelectedOptions)
        } else {
            // If not valid, find the best matching variant and update other options accordingly
            const bestMatchingVariant = variantsWithThisOption[0] // Take the first variant with this option

            const updatedOptions: Record<string, string> = {}
            bestMatchingVariant.variant_options?.forEach((option) => {
                updatedOptions[option.variant_attribute.name] = option.name
            })

            setSelectedOptions(updatedOptions)
        }
    }

    // Initialize with first available variant if no selection
    useEffect(() => {
        if (Object.keys(selectedOptions).length === 0 && product_variants.length > 0) {
            const firstVariant = product_variants[0]
            const initialOptions: Record<string, string> = {}

            firstVariant.variant_options?.forEach((option) => {
                initialOptions[option.variant_attribute.name] = option.name
            })

            setSelectedOptions(initialOptions)
        }
    }, [product_variants, selectedOptions])

    // Notify parent component about selection changes
    useEffect(() => {
        if (findMatchingVariant) {
            onSelect(findMatchingVariant.id)
        } else if (Object.keys(selectedOptions).length > 0) {
            onNoCombination()
        }
    }, [findMatchingVariant, selectedOptions, onSelect, onNoCombination])

    if (availableAttributes.length === 0) {
        return null
    }

    return (
        <div className={cn("space-y-5", className)}>
            <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900">Select Options</h3>

                {availableAttributes.map((attribute) => {
                    return (
                        <div key={attribute.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">{attribute.name}</label>
                                {/* {selectedOptions[attribute.name] && (
                                    <Badge variant="secondary" className="text-xs px-2 py-1">
                                        {selectedOptions[attribute.name]}
                                    </Badge>
                                )} */}
                            </div>

                            {/* Universal button selection for all attributes */}
                            <div className="flex flex-wrap gap-2">
                                {attribute.options.map((option) => {
                                    const isSelected = selectedOptions[attribute.name] === option
                                    const isAvailable = isOptionAvailable(attribute.name, option)

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => isAvailable && handleOptionSelect(attribute.name, option)}
                                            disabled={!isAvailable}
                                            className={cn(
                                                "px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-150",
                                                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1",
                                                isSelected
                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                    : isAvailable
                                                        ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                                        : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed",
                                            )}
                                            title={!isAvailable ? `${option} (Not available)` : option}
                                        >
                                            {option}
                                            {!isAvailable && <span className="ml-1 text-xs opacity-60">×</span>}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Selected combination display */}
            {Object.keys(selectedOptions).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Current Selection</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(selectedOptions).map(([attribute, value]) => (
                                <Badge
                                    key={attribute}
                                    variant={findMatchingVariant ? "default" : "destructive"}
                                    className="text-xs px-2 py-1"
                                >
                                    {attribute}: {value}
                                </Badge>
                            ))}
                        </div>
                        {!findMatchingVariant && Object.keys(selectedOptions).length > 0 && (
                            <p className="text-sm text-red-600 font-medium">This combination is not available</p>
                        )}
                        {/* {findMatchingVariant && (
                            <div className="text-xs text-gray-500 mt-1">
                                <span>Variant ID: {findMatchingVariant.id}</span>
                                {findMatchingVariant.sku && <span> • SKU: {findMatchingVariant.sku}</span>}
                            </div>
                        )} */}
                    </div>
                </div>
            )}
        </div>
    )
}
