
export const productStore = {

    addToLikes: (productId: number) => {
        if (typeof window === 'undefined') return;
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        if (!likedProducts.includes(productId) && productId > 0) {
            likedProducts.push(productId)
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts))
        }
    },
    removeFromLikes: (productId: number) => {
        if (typeof window === 'undefined') return;
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        const index = likedProducts.indexOf(productId)
        if (index > -1) {
            likedProducts.splice(index, 1)
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts))
        }
    },
    isProductAddedToLikes: (productId: number) => {
        if (typeof window === 'undefined') return;
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        return likedProducts.includes(productId)
    },
    getLikedProducts: () => {
        if (typeof window === 'undefined') return;
        return JSON.parse(localStorage && localStorage.getItem('likedProducts') || '[]')
    }

}