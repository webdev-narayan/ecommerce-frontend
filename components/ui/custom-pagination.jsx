import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Pagination, PaginationContent, PaginationLink, PaginationNext, PaginationPrevious } from './pagination'

const CustomPagination = ({ setPageSize, setPage, meta }) => {
    return (
        <div className={"ml-auto flex gap-x-2"}>
            <Select onValueChange={(value) => setPageSize(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
            <Pagination className={"gap-x-2"}>
                <PaginationPrevious
                    onClick={() => (meta?.pagination?.page > 1) && setPage(meta?.pagination?.page - 1)}
                    className={`border cursor-pointer ${(!meta || meta?.pagination?.page === 1) && "cursor-not-allowed opacity-50"}`}
                >
                    Previous
                </PaginationPrevious>
                <PaginationContent>
                    <PaginationLink className={`border ${!meta && "opacity-50"} cursor-default`}>
                        1
                    </PaginationLink>
                </PaginationContent>
                <PaginationNext
                    className={`border cursor-pointer ${meta?.pagination?.page === meta?.pagination?.pageCount && "cursor-not-allowed opacity-50"}`}
                    onClick={() => (meta?.pagination?.page < meta?.pagination?.pageCount) && setPage(meta?.pagination?.page + 1)}
                >Next</PaginationNext>
            </Pagination>
        </div>
    )
}

export default CustomPagination
