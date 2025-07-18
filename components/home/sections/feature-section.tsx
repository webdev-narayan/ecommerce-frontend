import { Headphones, RotateCcw, Shield, Truck } from "lucide-react"

const FeatureSection = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
                    <div className="text-center">
                        <div className="bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className=" h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 md:text-base text-sm">Free Shipping</h3>
                        <p className="text-gray-600 md:text-sm text-xs">On orders over ₹ 1599</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RotateCcw className=" h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 md:text-base text-sm">Easy Returns</h3>
                        <p className="text-gray-600 md:text-sm text-xs">30-day return policy</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className=" h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 md:text-base text-sm">Secure Payment</h3>
                        <p className="text-gray-600 md:text-sm text-xs">100% secure checkout</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Headphones className=" h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 md:text-base text-sm">24/7 Support</h3>
                        <p className="text-gray-600 md:text-sm text-xs">Customer service</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection