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
import { Plus, X, Upload, ImageIcon, Save, Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Specification {
  key: string
  value: string
}

interface VariantAttribute {
  name: string
  values: string[]
}

interface VariantCombination {
  attributes: Record<string, string>
  price: string
  thumbnail: string
}

interface ProductForm {
  name: string
  description: string
  slug: string
  price: string
  thumbnail: string
  gallery: string[]
  specifications: Specification[]
  isFeatured: boolean
  category: string
  brand: string
  genders: string[]
  variantAttributes: VariantAttribute[]
  variants: VariantCombination[]
}

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"]

const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "Microsoft", "Google", "Amazon"]

const genderOptions = ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"]

// Add predefined variant attributes that would typically come from database
const variantAttributeOptions = [
  {
    value: "color",
    label: "Color",
    commonValues: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Gray"],
  },
  { value: "size", label: "Size", commonValues: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  {
    value: "material",
    label: "Material",
    commonValues: ["Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather"],
  },
  { value: "style", label: "Style", commonValues: ["Casual", "Formal", "Sport", "Vintage", "Modern", "Classic"] },
  {
    value: "pattern",
    label: "Pattern",
    commonValues: ["Solid", "Striped", "Checkered", "Floral", "Geometric", "Abstract"],
  },
  { value: "fit", label: "Fit", commonValues: ["Slim", "Regular", "Loose", "Tight", "Relaxed", "Athletic"] },
  { value: "sleeve", label: "Sleeve", commonValues: ["Short", "Long", "3/4", "Sleeveless", "Cap"] },
  { value: "weight", label: "Weight", commonValues: ["1kg", "2kg", "5kg", "10kg", "15kg", "20kg"] },
  { value: "capacity", label: "Capacity", commonValues: ["Small", "Medium", "Large", "500ml", "1L", "2L"] },
]

// Add this new component for better value input
const ValueInput = ({
  values,
  onChange,
  suggestions = [],
}: { values: string[]; onChange: (values: string[]) => void; suggestions?: string[] }) => {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addValue = (value: string) => {
    if (value.trim() && !values.includes(value.trim())) {
      onChange([...values, value.trim()])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(suggestion),
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {values.map((value, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {value}
            <button
              type="button"
              onClick={() => removeValue(index)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addValue(inputValue)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Type and press Enter to add value"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-muted text-sm"
                onClick={() => addValue(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          {suggestions
            .slice(0, 5)
            .filter((s) => !values.includes(s))
            .map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addValue(suggestion)}
                className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default function CreateProductPage() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    slug: "",
    price: "",
    thumbnail: "",
    gallery: [],
    specifications: [{ key: "", value: "" }],
    isFeatured: false,
    category: "",
    brand: "",
    genders: [],
    variantAttributes: [],
    variants: [],
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [showVariants, setShowVariants] = useState(false)

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name) {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setForm((prev) => ({ ...prev, slug }))
    }
  }, [form.name])

  // Generate variant combinations
  useEffect(() => {
    if (form.variantAttributes.length > 0) {
      const combinations = generateVariantCombinations(form.variantAttributes)
      setForm((prev) => ({
        ...prev,
        variants: combinations.map((combo) => ({
          attributes: combo,
          price: "",
          thumbnail: "",
        })),
      }))
    }
  }, [form.variantAttributes])

  const generateVariantCombinations = (attributes: VariantAttribute[]): Record<string, string>[] => {
    if (attributes.length === 0) return []

    const combinations: Record<string, string>[] = []

    const generate = (index: number, current: Record<string, string>) => {
      if (index === attributes.length) {
        combinations.push({ ...current })
        return
      }

      const attribute = attributes[index]
      for (const value of attribute.values) {
        current[attribute.name] = value
        generate(index + 1, current)
      }
    }

    generate(0, {})
    return combinations
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Update the addVariantAttribute function
  const addVariantAttribute = () => {
    setForm((prev) => ({
      ...prev,
      variantAttributes: [...prev.variantAttributes, { name: "", values: [] }],
    }))
  }

  // Update the updateVariantAttribute function to handle both name and values
  const updateVariantAttribute = (index: number, field: "name" | "values", value: string | string[]) => {
    setForm((prev) => ({
      ...prev,
      variantAttributes: prev.variantAttributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)),
    }))
  }

  const updateVariant = (index: number, field: "price" | "thumbnail", value: string) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    }))
  }

  const handleGenderChange = (gender: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      genders: checked ? [...prev.genders, gender] : prev.genders.filter((g) => g !== gender),
    }))
  }

  const handleSubmit = () => {
    console.log("Product data:", form)
    // Here you would typically send the data to your API
  }

  const removeVariantAttribute = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variantAttributes: prev.variantAttributes.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-8xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Product</h1>
          <p className="text-muted-foreground">Add a new product to your catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
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
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
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
                <Label htmlFor="description">Description</Label>
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
                  <Select value={form.category} onValueChange={(value) => updateForm("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={form.brand} onValueChange={(value) => updateForm("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Target Gender</Label>
                <div className="flex flex-wrap gap-3">
                  {genderOptions.map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox
                        id={gender}
                        checked={form.genders.includes(gender)}
                        onCheckedChange={(checked) => handleGenderChange(gender, checked as boolean)}
                      />
                      <Label htmlFor={gender} className="text-sm font-normal">
                        {gender}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>Upload product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thumbnail Image *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload thumbnail</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>Add detailed product specifications</CardDescription>
            </CardHeader>
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
                <Switch id="show-variants" checked={showVariants} onCheckedChange={setShowVariants} />
                <Label htmlFor="show-variants">This product has variants</Label>
              </div>

              {showVariants && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Variant Attributes</h3>
                    {form.variantAttributes.map((attr, attrIndex) => {
                      const selectedOption = variantAttributeOptions.find((opt) => opt.value === attr.name)

                      return (
                        <Card key={attrIndex}>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <Label>Attribute Type</Label>
                                  <Select
                                    value={attr.name}
                                    onValueChange={(value) => {
                                      updateVariantAttribute(attrIndex, "name", value)
                                      // Reset values when attribute type changes
                                      updateVariantAttribute(attrIndex, "values", [])
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select attribute type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {variantAttributeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
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

                              {attr.name && (
                                <div className="space-y-2">
                                  <Label className="text-sm">Values for {selectedOption?.label}</Label>
                                  <ValueInput
                                    values={attr.values}
                                    onChange={(values) => updateVariantAttribute(attrIndex, "values", values)}
                                    suggestions={selectedOption?.commonValues || []}
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
                          <h3 className="text-lg font-semibold">Variant Combinations</h3>
                          <Badge variant="outline">{form.variants.length} combinations</Badge>
                        </div>

                        <div className="grid gap-4">
                          {form.variants.map((variant, index) => {
                            const attributeLabels = Object.entries(variant.attributes).map(([key, value]) => {
                              const option = variantAttributeOptions.find((opt) => opt.value === key)
                              return `${option?.label || key}: ${value}`
                            })

                            return (
                              <Card key={index} className="relative">
                                <CardContent className="pt-4">
                                  <div className="space-y-4">
                                    <div className="flex flex-wrap gap-1">
                                      {attributeLabels.map((label, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {label}
                                        </Badge>
                                      ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`variant-price-${index}`}>Price *</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                            $
                                          </span>
                                          <Input
                                            id={`variant-price-${index}`}
                                            type="number"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(index, "price", e.target.value)}
                                            placeholder="0.00"
                                            className="pl-8"
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor={`variant-thumbnail-${index}`}>Thumbnail</Label>
                                        <div className="flex gap-2">
                                          <Input
                                            id={`variant-thumbnail-${index}`}
                                            value={variant.thumbnail}
                                            onChange={(e) => updateVariant(index, "thumbnail", e.target.value)}
                                            placeholder="Image URL or upload"
                                            className="flex-1"
                                          />
                                          <Button variant="outline" size="icon" type="button">
                                            <Upload className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>

                        {form.variants.some((v) => !v.price) && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                              <span className="text-xs text-yellow-800">!</span>
                            </div>
                            <p className="text-sm text-yellow-800">
                              Some variants are missing prices. Please add prices for all variants.
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
