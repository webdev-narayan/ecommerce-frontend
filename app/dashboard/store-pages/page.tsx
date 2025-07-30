"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { putApi } from "@/lib/api"
import toast from "react-hot-toast"

interface PageContent {
    about_us: string
    contact_us: string
    privacy_policy: string
    terms_and_condition: string
    size_guide: string
    return_policy: string
    disclaimer: string
}

const defaultContent: PageContent = {
    about_us: `# About Us

Welcome to our store! We are passionate about providing high-quality products and exceptional customer service.

## Our Story

Founded in 2020, we started with a simple mission: to make shopping easier and more enjoyable for everyone.

## Our Values

- **Quality**: We source only the finest products
- **Service**: Customer satisfaction is our top priority
- **Innovation**: We continuously improve our offerings`,

    contact_us: `# Contact Us

We'd love to hear from you! Get in touch with us through any of the following methods:

## Customer Service

- **Email**: support@store.com
- **Phone**: 1-800-STORE-01
- **Hours**: Monday - Friday, 9 AM - 6 PM EST

## Address

123 Store Street  
Commerce City, CC 12345  
United States

## Business Inquiries

For partnership and business inquiries, please contact:  
**Email**: business@store.com`,

    privacy_policy: `# Privacy Policy

*Last updated: January 1, 2024*

## Information We Collect

We collect information you provide directly to us, such as when you:
- Create an account
- Make a purchase
- Contact customer service

## How We Use Your Information

We use the information we collect to:
- Process transactions
- Provide customer support
- Send marketing communications (with your consent)

## Data Security

We implement appropriate security measures to protect your personal information.`,

    terms_and_condition: `# Terms and Conditions

*Last updated: January 1, 2024*

## Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.

## Disclaimer

The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.

## Limitations

In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.`,

    size_guide: `# Size Guide

Find your perfect fit with our comprehensive size guide.

## Clothing Sizes

### Women's Sizes
| Size | Bust | Waist | Hips |
|------|------|-------|------|
| XS   | 32"  | 24"   | 34"  |
| S    | 34"  | 26"   | 36"  |
| M    | 36"  | 28"   | 38"  |
| L    | 38"  | 30"   | 40"  |
| XL   | 40"  | 32"   | 42"  |

### Men's Sizes
| Size | Chest | Waist | 
|------|-------|-------|
| S    | 36"   | 30"   |
| M    | 38"   | 32"   |
| L    | 40"   | 34"   |
| XL   | 42"   | 36"   |
| XXL  | 44"   | 38"   |

## How to Measure

1. **Chest/Bust**: Measure around the fullest part
2. **Waist**: Measure around the narrowest part
3. **Hips**: Measure around the fullest part`,

    return_policy: `# Return Policy

We want you to be completely satisfied with your purchase. If you're not happy, we're here to help.

## Return Window

- **Standard Items**: 30 days from delivery
- **Sale Items**: 14 days from delivery
- **Custom Items**: Not eligible for return

## Return Process

1. **Initiate Return**: Contact customer service or use our online return portal
2. **Package Items**: Use original packaging when possible
3. **Ship Back**: Use the prepaid return label provided

## Refund Timeline

- **Credit Card**: 5-7 business days
- **PayPal**: 3-5 business days
- **Store Credit**: Immediate

## Conditions

Items must be:
- Unused and in original condition
- In original packaging
- Accompanied by receipt or proof of purchase`,

    disclaimer: `# Disclaimer

## General Information

The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this company:

- Excludes all representations and warranties relating to this website and its contents
- Excludes all liability for damages arising out of or in connection with your use of this website

## Product Information

While we strive to provide accurate product information, we do not warrant that:
- Product descriptions are accurate, complete, reliable, current, or error-free
- Products will be available
- Prices are current and accurate

## External Links

This website may contain links to other websites. We are not responsible for the content or privacy practices of other sites.

## Changes to Disclaimer

We reserve the right to modify this disclaimer at any time without prior notice.`,
}

const tabConfig = [
    { key: "about_us", label: "About Us", description: "Company information and story" },
    { key: "contact_us", label: "Contact Us", description: "Contact information and support details" },
    { key: "privacy_policy", label: "Privacy Policy", description: "Data collection and privacy practices" },
    { key: "terms_and_condition", label: "Terms & Conditions", description: "Terms of service and usage" },
    { key: "size_guide", label: "Size Guide", description: "Product sizing information" },
    { key: "return_policy", label: "Return Policy", description: "Return and refund procedures" },
    { key: "disclaimer", label: "Disclaimer", description: "Legal disclaimers and limitations" },
]

export default function StorePageSections() {
    const [content, setContent] = useState<PageContent>(defaultContent)
    const [activeTab, setActiveTab] = useState("about_us")
    const [isSaving, setIsSaving] = useState(false)

    const handleContentChange = (field: keyof PageContent, value: string) => {
        setContent((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)

        try {
            // Simulate API call
            const res = await putApi("/store-page", { data: content }, true)
            if (res.data) {
                toast.success("Page Saved")
            }
        } catch (error) {
            toast.error('Error Occured')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Store Pages</h1>
                    <p className="text-muted-foreground">Your store's informational pages</p>
                </div>
                <Button onClick={handleSave} >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>

            <div className=" ">

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
                        {tabConfig.map((tab) => (
                            <TabsTrigger key={tab.key} value={tab.key} className="text-xs lg:text-sm">
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabConfig.map((tab) => (
                        <TabsContent key={tab.key} value={tab.key} className="space-y-4 bg-white p-3">
                            <div className="space-y-2">
                                <Label htmlFor={tab.key} className="text-lg font-semibold">
                                    {tab.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">{tab.description}</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`${tab.key}-content`}>Content (Markdown)</Label>
                                <Textarea
                                    id={`${tab.key}-content`}
                                    value={content[tab.key as keyof PageContent]}
                                    onChange={(e) => handleContentChange(tab.key as keyof PageContent, e.target.value)}
                                    placeholder={`Enter ${tab.label.toLowerCase()} content in markdown format...`}
                                    className="min-h-[400px] font-mono text-sm"
                                />
                            </div>

                            <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Markdown Tips:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Use # for headings (# H1, ## H2, ### H3)</li>
                                    <li>• Use **bold** for bold text and *italic* for italic</li>
                                    <li>• Use - or * for bullet points</li>
                                    <li>• Use | for tables and --- for separators</li>
                                    <li>• Use [link text](url) for links</li>
                                </ul>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="flex justify-end mt-6 pt-6 border-t">
                    <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save All
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
