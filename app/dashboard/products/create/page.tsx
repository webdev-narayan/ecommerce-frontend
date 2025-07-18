
/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Save, Package } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { VariantAttribute, VariantOption } from "../attributes/attribute.type"
import { getApi, postApi, uploadToStrapi } from "@/lib/api"
import type { MetaResponse } from "@/lib/types/type"
import { Category } from "../../categories/categories.type"
import { Brand } from "../../brands/brand.type"
import { Gender, Product } from "../product.type"
import FileUpload from "@/components/ui/file-upload"
import RichTextEditor from "@/components/RichTextEditor";

interface Specification {
    key: string
    value: string
}

interface VariantAttributeForm {
    attributeId: string
    attributeName: string
    selectedOptions: Array<{ value: string; label: string }>
}

interface VariantCombination {
    variant_options: string[] // Array of option documentIds
    mrp: string
    price: string
    gallery?: File[]
    thumbnail?: File
    quantity: number
    sku: string
}

interface ProductForm {
    title: string
    description: string
    description_rich_text: string
    slug: string
    price: string
    thumbnail: File | null
    gallery: number[] | null
    specifications: Specification[]
    isFeatured: boolean
    category: number | null
    brand: number | null
    genders: number[] | null
    variantAttributes: VariantAttributeForm[]
    variants: VariantCombination[]
}


// Multi-select component for options
const MultiSelectOptions = ({
    options,
    selectedOptions,
    onChange,
    placeholder = "Select options...",
}: {
    options: Array<{ value: string; label: string }>
    selectedOptions: Array<{ value: string; label: string }>
    onChange: (selected: Array<{ value: string; label: string }>) => void
    placeholder?: string
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOption = (option: { value: string; label: string }) => {
        const isSelected = selectedOptions.some((selected) => selected.value === option.value)
        if (isSelected) {
            onChange(selectedOptions.filter((selected) => selected.value !== option.value))
        } else {
            onChange([...selectedOptions, option])
        }
    }

    const removeOption = (optionValue: string) => {
        onChange(selectedOptions.filter((selected) => selected.value !== optionValue))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1 mb-2">
                {selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary" className="flex items-center gap-1">
                        {option.label}
                        <button
                            type="button"
                            onClick={() => removeOption(option.value)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            <div className="relative">
                <Button type="button" variant="outline" onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between">
                    {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
                    <X className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>

                {isOpen && (
                    <div
                        className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = selectedOptions.some((selected) => selected.value === option.value)
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`w-full px-3 py-2 text-left hover:bg-muted text-sm flex items-center gap-2 ${isSelected ? "bg-muted" : ""
                                        }`}
                                    onClick={() => toggleOption(option)}
                                >
                                    <Checkbox checked={isSelected} />
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function CreateProductPage() {
    const [form, setForm] = useState<ProductForm>({
        title: "",
        description: "",
        description_rich_text: "",
        slug: "",
        price: "",
        thumbnail: null,
        gallery: [],
        specifications: [{ key: "", value: "" }],
        isFeatured: false,
        category: null,
        brand: null,
        genders: [],
        variantAttributes: [],
        variants: [],
    })

    const [activeTab, setActiveTab] = useState("basic")
    const [hasVariants, setHasVariants] = useState(false)
    const [defaultPrice, setDefaultPrice] = useState("")

    const [categories, setCategories] = useState<Category[]>([])
    const [genders, setGenders] = useState<Gender[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [attributes, setAttributes] = useState<VariantAttribute[]>([])
    const [attributeOptions, setAttributeOptions] = useState<Record<string, VariantOption[]>>({})
    const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({})

    const getAttributes = async () => {
        const res = await getApi<{ data: VariantAttribute[]; meta: MetaResponse }>(`/variant-attributes`, true)
        if (res.success && res.data) {
            setAttributes(res.data?.data)
        }
    }
    const getCategories = async () => {
        const res = await getApi<{ data: Category[]; meta: MetaResponse }>(`/categories`, true)
        if (res.success && res.data) {
            setCategories(res.data?.data)
        }
    }
    const getBrands = async () => {
        const res = await getApi<{ data: Brand[]; meta: MetaResponse }>(`/brands`, true)
        if (res.success && res.data) {
            setBrands(res.data?.data)
        }
    }
    const getGenders = async () => {
        const res = await getApi<{ data: Gender[]; meta: MetaResponse }>(`/genders`, true)
        if (res.success && res.data) {
            setGenders(res.data?.data)
        }
    }

    const getOptions = async (attributeId: string) => {
        if (attributeOptions[attributeId]) {
            return attributeOptions[attributeId]
        }

        setLoadingOptions((prev) => ({ ...prev, [attributeId]: true }))

        const res = await getApi<{ data: VariantOption[]; meta: MetaResponse }>(
            `/variant-options?filters[variant_attribute][documentId][$eq]=${attributeId}`,
            true,
        )

        setLoadingOptions((prev) => ({ ...prev, [attributeId]: false }))

        if (res.success && res.data) {
            setAttributeOptions((prev) => ({
                ...prev,
                [attributeId]: res.data?.data || [],
            }))
            return res.data?.data || []
        }
        return []
    }

    useEffect(() => {
        Promise.all([getAttributes(), getCategories(), getBrands(), getGenders()])
    }, [])

    // Auto-generate slug from name
    useEffect(() => {
        if (form.title) {
            const slug = form.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            setForm((prev) => ({ ...prev, slug }))
        }
    }, [form.title])

    // Generate variant combinations when attributes change
    useEffect(() => {
        if (form.variantAttributes.length > 0 && form.variantAttributes.every((attr) => attr.selectedOptions.length > 0)) {
            const combinations = generateVariantCombinations(form.variantAttributes)
            setForm((prev) => ({
                ...prev,
                variants: combinations.map((combo) => ({
                    variant_options: combo,
                    mrp: defaultPrice || "",
                    price: defaultPrice || "",
                    quantity: 0,
                    sku: "",
                    // gallery: [],
                    // thumbnail: null,
                })),
            }))
        } else {
            setForm((prev) => ({ ...prev, variants: [] }))
        }
    }, [form.variantAttributes, defaultPrice])

    const generateVariantCombinations = (attributes: VariantAttributeForm[]): string[][] => {
        if (attributes.length === 0) return []

        const combinations: string[][] = []

        const generate = (index: number, current: string[]) => {
            if (index === attributes.length) {
                combinations.push([...current])
                return
            }

            const attribute = attributes[index]
            for (const option of attribute.selectedOptions) {
                current.push(option.value)
                generate(index + 1, current)
                current.pop()
            }
        }

        generate(0, [])
        return combinations
    }


    const updateForm = (field: keyof ProductForm, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const addSpecification = () => {
        setForm((prev) => ({
            ...prev,
            specifications: [...prev.specifications, { key: "", value: "" }],
        }))
    }

    const updateSpecification = (index: number, field: "key" | "value", value: string) => {
        setForm((prev) => ({
            ...prev,
            specifications: prev.specifications.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
        }))
    }

    const removeSpecification = (index: number) => {
        setForm((prev) => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index),
        }))
    }

    const addVariantAttribute = () => {
        setForm((prev) => ({
            ...prev,
            variantAttributes: [
                ...prev.variantAttributes,
                {
                    attributeId: "",
                    attributeName: "",
                    selectedOptions: [],
                },
            ],
        }))
    }

    const updateVariantAttribute = async (index: number, attributeId: string) => {
        const selectedAttribute = attributes.find((attr) => attr.documentId === attributeId)
        if (!selectedAttribute) return

        // Get options for this attribute
        await getOptions(attributeId)

        setForm((prev) => ({
            ...prev,
            variantAttributes: prev.variantAttributes.map((attr, i) =>
                i === index
                    ? {
                        attributeId,
                        attributeName: selectedAttribute.name,
                        selectedOptions: [],
                    }
                    : attr,
            ),
        }))
    }

    const updateVariantAttributeOptions = (index: number, selectedOptions: Array<{ value: string; label: string }>) => {
        setForm((prev) => ({
            ...prev,
            variantAttributes: prev.variantAttributes.map((attr, i) => (i === index ? {
                ...attr,
                selectedOptions
            } : attr)),
        }))
    }

    const removeVariantAttribute = (index: number) => {
        setForm((prev) => ({
            ...prev,
            variantAttributes: prev.variantAttributes.filter((_, i) => i !== index),
        }))
    }

    const updateVariant = (index: number, field: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
        }))
    }

    const applyDefaultPricing = () => {
        if (!defaultPrice) return

        setForm((prev) => ({
            ...prev,
            variants: prev.variants.map((variant) => ({
                ...variant,
                mrp: defaultPrice,
            })),
        }))
    }

    const handleGenderChange = (gender: number, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            genders: checked ? [...(prev.genders ?? []), gender] : (prev.genders ?? []).filter((g) => g !== gender),
        }))
    }

    const handleSubmit = async () => {

        const variants = [];
        let productThumbnail = null;
        if (hasVariants && form.variants?.length > 0) {
            for (const item of form.variants) {

                let thumbnail = null;
                let gallery = null;
                if (item.gallery?.length) {
                    gallery = await uploadToStrapi(item.gallery)
                }
                if (item.thumbnail) {
                    thumbnail = await uploadToStrapi(item.thumbnail)
                }

                variants.push(
                    {
                        mrp: item.mrp,
                        price: item.price,
                        sku: item.sku,
                        quantity: item.quantity,
                        gallery: gallery?.map(item => item.id) || [],
                        thumbnail: thumbnail?.map(item => item.id)[0] || null,
                        variant_options: item.variant_options
                    }
                )
            }
        }

        if (form.thumbnail) {
            productThumbnail = await uploadToStrapi(form.thumbnail)
        }

        const data = {
            title: form.title,
            description: form.description,
            slug: form.slug,
            price: form.price,
            thumbnail: productThumbnail?.map(item => item.id)[0] || null,
            // gallery: form.gallery,
            specifications: form.specifications,
            isFeatured: form.isFeatured,
            category: form.category,
            brand: form.brand,
            genders: form.genders,
            variantAttributes: form.variantAttributes,
            variants,
        }
        console.log(data)
        const res = await postApi<{ data: Product }>("/products/create", data, true)
        if (res.success && res.data) {
            console.log("added")
            // toast.success("Product added successfully")
            // router.push(`/dashboard/products/${res.data.data.documentId}`)
        }

    }

    const getVariantDisplayName = (variant: VariantCombination) => {
        const optionNames: string[] = []

        variant.variant_options.forEach((optionId) => {
            // Find the option name from our cached options
            Object.values(attributeOptions).forEach((options) => {
                const option = options.find((opt) => opt.id.toString() === optionId)
                if (option) {
                    optionNames.push(option.name)
                }
            })
        })

        return optionNames.join(" × ")
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-8xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Create New Product</h1>
                    <p className="text-muted-foreground">Add a new product to your catalog</p>
                </div>
                <div className="flex gap-2">
                    {/* <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button> */}
                    <Button onClick={handleSubmit} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Product
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="variants">Variants</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Essential product details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={form.title}
                                        onChange={(e) => updateForm("title", e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={form.slug}
                                        onChange={(e) => updateForm("slug", e.target.value)}
                                        placeholder="auto-generated-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Short)</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) => updateForm("description", e.target.value)}
                                    placeholder="Describe your product..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (Optional)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => updateForm("price", e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <p className="text-xs text-muted-foreground">Required if no variants are added</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={form.category?.toString()}
                                        onValueChange={(value) => updateForm("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.documentId} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Select value={form.brand?.toString()}
                                        onValueChange={(value) => updateForm("brand", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.documentId} value={brand.id.toString()}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Gender Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-x-2 flex items-center">
                                    <Label>Target Gender</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {genders.map((gender) => (
                                            <div key={gender.documentId} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={gender?.id.toString()}
                                                    checked={form?.genders?.includes(gender.id)}
                                                    onCheckedChange={(checked) => handleGenderChange(gender.id, checked as boolean)}
                                                />
                                                <Label htmlFor={gender.id.toString()} className="text-sm font-normal">
                                                    {gender.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="featured"
                                        checked={form.isFeatured}
                                        onCheckedChange={(checked) => updateForm("isFeatured", checked)}
                                    />
                                    <Label htmlFor="featured">Featured Product</Label>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-6 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Media</CardTitle>
                            <CardDescription>Upload product images</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FileUpload
                                    isMultiple={false}
                                    acceptedFileTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
                                    maxFileSize={2}
                                    title="Product Thumbnail"
                                // onFilesChange={(files) => handleFileUpload(files, "thumbnail")}
                                />

                                <FileUpload
                                    isMultiple={true}
                                    acceptedFileTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
                                    maxFileSize={5}
                                    title="Product Video"
                                // onFilesChange={(files) => handleFileUpload(files, "gallery")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <div>

                            <div className="p-6 flex flex-col gap-1">
                                <CardTitle>Product Specifications</CardTitle>
                                <CardDescription>Add detailed product specifications</CardDescription>
                            </div>
                            <CardContent className="space-y-4">
                                {form.specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Label htmlFor={`spec-key-${index}`}>Key</Label>
                                            <Input
                                                id={`spec-key-${index}`}
                                                value={spec.key}
                                                onChange={(e) => updateSpecification(index, "key", e.target.value)}
                                                placeholder="e.g., Material"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor={`spec-value-${index}`}>Value</Label>
                                            <Input
                                                id={`spec-value-${index}`}
                                                value={spec.value}
                                                onChange={(e) => updateSpecification(index, "value", e.target.value)}
                                                placeholder="e.g., Cotton"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeSpecification(index)}
                                            disabled={form.specifications.length === 1}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addSpecification} className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Specification
                                </Button>
                            </CardContent>

                            <div>
                                <div className="p-6 flex flex-col gap-1">
                                    <CardTitle>Product Description</CardTitle>
                                    <CardDescription>Add detailed product description</CardDescription>
                                </div>

                                <CardContent className="space-y-4">
                                    <RichTextEditor
                                        initialContent={form.description_rich_text}
                                        onChange={(value) => updateForm("description_rich_text", value)} />
                                </CardContent>
                            </div>
                        </div>

                    </Card>
                </TabsContent>

                <TabsContent value="variants" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Variants</CardTitle>
                            <CardDescription>Create product variations with different attributes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Switch id="show-variants" checked={hasVariants} onCheckedChange={setHasVariants} />
                                <Label htmlFor="show-variants">This product has variants</Label>
                            </div>

                            {hasVariants && (
                                <>
                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Variant Attributes</h3>
                                        {form.variantAttributes.map((attr, attrIndex) => {
                                            const availableOptions = attributeOptions[attr.attributeId] || []
                                            const optionsForSelect = availableOptions.map((option) => ({
                                                value: option.id.toString(),
                                                label: option.name,
                                            }))

                                            return (
                                                <Card key={attrIndex}>
                                                    <CardContent className="pt-4">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1">
                                                                    <Label>Attribute Type</Label>
                                                                    <Select
                                                                        value={attr.attributeId}
                                                                        onValueChange={(value) => updateVariantAttribute(attrIndex, value)}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder="Select attribute type" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attributes.map((attribute) => (
                                                                                <SelectItem key={attribute.documentId}
                                                                                    value={attribute.documentId}>
                                                                                    {attribute.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => removeVariantAttribute(attrIndex)}
                                                                    className="mt-6"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>

                                                            {attr.attributeId && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">
                                                                        Values for {attr.attributeName}
                                                                        {loadingOptions[attr.attributeId] && (
                                                                            <span
                                                                                className="ml-2 text-xs text-muted-foreground">(Loading...)</span>
                                                                        )}
                                                                    </Label>
                                                                    <MultiSelectOptions
                                                                        options={optionsForSelect}
                                                                        selectedOptions={attr.selectedOptions}
                                                                        onChange={(selected) => updateVariantAttributeOptions(attrIndex, selected)}
                                                                        placeholder={`Select ${attr.attributeName.toLowerCase()} options...`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}

                                        <Button type="button" variant="outline" onClick={addVariantAttribute}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Attribute
                                        </Button>
                                    </div>

                                    {form.variants.length > 0 && (
                                        <>
                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold">Default Pricing</h3>
                                                </div>

                                                <Card>
                                                    <CardContent className="pt-4">
                                                        <div className="flex gap-4 items-end">
                                                            <div className="flex-1">
                                                                <Label htmlFor="default-price">Default Price for All
                                                                    Variants</Label>
                                                                <div className="relative">
                                                                    <span
                                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                                                        ₹
                                                                    </span>
                                                                    <Input
                                                                        id="default-price"
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={defaultPrice}
                                                                        onChange={(e) => setDefaultPrice(e.target.value)}
                                                                        placeholder="0.00"
                                                                        className="pl-8"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button type="button" onClick={applyDefaultPricing}
                                                                disabled={!defaultPrice}>
                                                                Apply to All
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold">Variant Combinations</h3>
                                                    <Badge variant="outline">{form.variants.length} combinations</Badge>
                                                </div>

                                                <div className="grid gap-4">
                                                    {form.variants.map((variant, index) => {
                                                        const displayName = getVariantDisplayName(variant)

                                                        return (
                                                            <Card key={index} className="relative">
                                                                <CardContent className="pt-4">
                                                                    <div className="space-y-4">
                                                                        <div className="flex flex-wrap gap-1">
                                                                            <Badge variant="secondary"
                                                                                className="text-xs">
                                                                                {displayName || `Variant ${index + 1}`}
                                                                            </Badge>
                                                                        </div>

                                                                        <div
                                                                            className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">

                                                                            <div className="md:col-span-2 grid md:grid-cols-4 grid-cols-2 gap-x-4 gap-y-6">
                                                                                <div className="flex flex-col gap-2">
                                                                                    <Label htmlFor={`variant-mrp-${index}`}>MRP</Label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                                                                                        <Input
                                                                                            id={`variant-mrp-${index}`}
                                                                                            type="number"
                                                                                            step="0.1"
                                                                                            value={variant.mrp}
                                                                                            onChange={(e) => updateVariant(index, "mrp", e.target.value)}
                                                                                            placeholder="0.00"
                                                                                            className="pl-8"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex flex-col gap-2">
                                                                                    <Label htmlFor={`variant-price-${index}`}>Price</Label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                                                                                        <Input
                                                                                            id={`variant-price-${index}`}
                                                                                            type="number"
                                                                                            step="0.1"
                                                                                            value={variant.price}
                                                                                            onChange={(e) => updateVariant(index, "price", e.target.value)}
                                                                                            placeholder="0.00"
                                                                                            className="pl-8"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col gap-2">
                                                                                    <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                                                                                    <div className="relative">
                                                                                        <span
                                                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                                                                            <Package className="w-4 h-4" />
                                                                                        </span>
                                                                                        <Input
                                                                                            id={`variant-sku-${index}`}
                                                                                            type="text"
                                                                                            step="0.1"
                                                                                            value={variant.sku}
                                                                                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                                                                            placeholder="sku"
                                                                                            className="pl-8"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex flex-col gap-2">
                                                                                    <Label htmlFor={`variant-qty-${index}`}>Quantity</Label>
                                                                                    <div className="relative">
                                                                                        <span
                                                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                                                                            <Package className="w-4 h-4" />
                                                                                        </span>
                                                                                        <Input
                                                                                            id={`variant-qty-${index}`}
                                                                                            type="number"
                                                                                            step="1"
                                                                                            value={variant.quantity}
                                                                                            onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                                                                                            placeholder="0"
                                                                                            className="pl-8"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>


                                                                            <div className="space-y-2">
                                                                                {/* <Label>Thumbnail</Label> */}
                                                                                <FileUpload
                                                                                    isMultiple={false}
                                                                                    acceptedFileTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
                                                                                    title="Upload thumbnail"
                                                                                    onFilesChange={(files) => updateVariant(index, "thumbnail", files[0])}

                                                                                />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {/* <Label>Gallery Images</Label> */}
                                                                                <FileUpload
                                                                                    isMultiple={true}
                                                                                    acceptedFileTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
                                                                                    maxFileSize={5}
                                                                                    title="Upload gallery images"
                                                                                    onFilesChange={(files) => updateVariant(index, "gallery", files)}
                                                                                />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>

                                                {form.variants.some((v) => !v.mrp) && (
                                                    <div
                                                        className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                        <div
                                                            className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                                                            <span className="text-xs text-yellow-800">!</span>
                                                        </div>
                                                        <p className="text-sm text-yellow-800">
                                                            Some variants are missing MRP. Please add MRP for all
                                                            variants.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
