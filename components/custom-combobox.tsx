/* eslint-disable no-unused-vars */
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Option {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: Option[];
    value: string;
}

interface CustomComboboxProps {
    onSearch?: (query: string) => Promise<Option[]>;
    options?: Option[];
    value: string;
    onValueChange: (value: string) => void;
    onAddClick?: () => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    addButtonText?: string;
    className?: string;
    debounceMs?: number;
    minSearchLength?: number;
    enableServerSearch?: boolean;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export function CustomCombobox({
    onSearch,
    options = [],
    value,
    onValueChange,
    onAddClick,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    addButtonText = "Add new",
    className = "w-full",
    debounceMs = 300,
    minSearchLength = 1,
    enableServerSearch = false,
}: CustomComboboxProps) {
    const [open, setOpen] = React.useState<boolean>(false)
    const [searchQuery, setSearchQuery] = React.useState<string>("")
    const [serverOptions, setServerOptions] = React.useState<Option[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)

    // Debounce search query
    const debouncedSearchQuery = useDebounce<string>(searchQuery, debounceMs)

    // Determine which options to use
    const currentOptions = enableServerSearch ? serverOptions : options
    const selectedOption = currentOptions.find((option) => option.value === value)

    // Server search effect
    React.useEffect(() => {
        if (!enableServerSearch || !onSearch) return

        if (searchQuery.length < minSearchLength) {
            setServerOptions(options)
            return
        }

        const performSearch = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const results = await onSearch(debouncedSearchQuery)
                setServerOptions(results || [])
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch options"
                setError(errorMessage)
                setServerOptions([])
            } finally {
                setIsLoading(false)
            }
        }

        performSearch()
    }, [debouncedSearchQuery, onSearch, enableServerSearch, minSearchLength, options])

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
    }

    // Reset search when popover closes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setSearchQuery("")
            if (enableServerSearch) {
                setServerOptions(options)
                setError(null)
            }
        }
    }

    React.useEffect(() => {
        if (searchQuery.length < minSearchLength) {
            setServerOptions(options)
        }
    }, [searchQuery, minSearchLength, options])

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("justify-between flex-1", className)}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={!enableServerSearch}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="h-9"
                            value={searchQuery}
                            onValueChange={handleSearchChange}
                        />
                        <CommandList>
                            {isLoading && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                </div>
                            )}

                            {error && (
                                <div className="px-2 py-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && currentOptions.length === 0 && searchQuery.length >= minSearchLength && (
                                <CommandEmpty>{emptyText}</CommandEmpty>
                            )}

                            {!isLoading && !error && (
                                <CommandGroup>
                                    {currentOptions.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={(currentValue: string) => {
                                                onValueChange(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {option.label}
                                            <Check className={cn("ml-auto h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {onAddClick && (
                <Button variant="outline" size="icon" onClick={onAddClick} type="button">
                    <Plus className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}