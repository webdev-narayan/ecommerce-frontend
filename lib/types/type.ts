export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail: {
            url: string;
        };
    };
    url: string;
}

export interface MetaResponse {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}