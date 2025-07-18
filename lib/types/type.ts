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

export enum BannerPlacement {
    GENERAL = "GENERAL",
    HOME_TOP = "HOME_TOP",
    HOME_MID = "HOME_MID",
    HOME_FOOT = "HOME_FOOT",
    CATEGORY = "CATEGORY",
    PRODUCT = "PRODUCT",
    BRAND = "BRAND",
    CART = "CART",
    COLLECTION = "COLLECTION",
}