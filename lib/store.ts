export const productStore = {
    addToLikes: (productId: number) => {
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        if (!likedProducts.includes(productId) && productId > 0) {
            likedProducts.push(productId)
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts))
        }
    },
    removeFromLikes: (productId: number) => {
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        const index = likedProducts.indexOf(productId)
        if (index > -1) {
            likedProducts.splice(index, 1)
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts))
        }
    },
    isProductAddedToLikes: (productId: number) => {
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]')
        return likedProducts.includes(productId)
    },
    getLikedProducts: () => {
        return JSON.parse(localStorage.getItem('likedProducts') || '[]')
    }

}