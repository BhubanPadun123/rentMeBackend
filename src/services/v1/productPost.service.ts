import Product from "../../model/product.model";
import UserModel from "../../model/user.model";
import BookingModel, {
    BookingPayload
} from "../../model/stockBooking.model";
import {
    productTypeCheck,
    BookingModelCheck
} from "../../types/product.type";

type availableAminities = {
    name: string;
    count: string
}
type occupancy = {
    occupancy: string
}
type images = {
    url: string;
}
export type ProductPayload = {
    vendorRef: string;
    tag:string;
    productTitle: string;
    productType: string;
    postAt: string;
    availableStatus: boolean;
    metaData: any,
    propertyOccupancy: string[]
}
export const PostProduct = (data: ProductPayload) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const validateData = productTypeCheck.parse(data)
            const addProduct = new Product(validateData)
            const addedProduct = await addProduct.save()
            resolved({
                message: "Product added successfully!",
                product: addedProduct
            })
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetProductList = (start: number, end: number,tag:string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const limit = end - start
            const products = await Product.find({tag:tag}).skip(start).limit(limit).exec()
            resolved(products)
        } catch (error) {
            rejected(error)
        }
    })
}
export const BookingProperty = (data: BookingPayload) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const validateData = BookingModelCheck.parse(data)
            const isCustomerBook = await BookingModel.findOne({
                productRef: validateData.productRef,
                customerRef: validateData.customerRef
            })
            if (isCustomerBook) {
                rejected({
                    message: "This property is already added to your cart!"
                })
            } else {
                const newBooking = new BookingModel(validateData)
                const saveNewBooking = await newBooking.save()
                resolved(saveNewBooking)
            }
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetVendorProduct = (id: string[]) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const productList = await Product.find({ _id: id })
            resolved(productList ? productList : [])
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetOrderVendor = (vendorRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await BookingModel.find({ vendorRef: vendorRef })
            resolved(list)
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetCustomerOrder = (customerRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await BookingModel.find({ customerRef: customerRef })
            resolved(list)
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetVendorCustomers = (customerIds: string[]) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await UserModel.find({ _id: customerIds })
            resolved(list.length > 0 ? list : [])
        } catch (error) {
            rejected(error)
        }
    })
}

export const CheckProductAvailable = async (vendorRef: string, productRef: string): Promise<boolean> => {
    try {
        const productData = await Product.find({ vendorRef, _id: productRef })
        if (productData && productData.length) {
            if (productData[0].availableStatus) {
                return productData[0].availableStatus
            }
        }
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}
export const UpdateProductAvialableStatus = async (vendorRef: string, productRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const productData = await Product.findOneAndUpdate({
                vendorRef,
                _id: productRef
            }, {
                $set: {
                    availableStatus: false
                }
            }, {
                new: false
            })
            productData ? resolved(productData) : rejected({ message: "product not found" })
        } catch (error) {
            console.log(error)
            rejected(error)
        }
    })
}
export const UpdateBookingStatus = async (
    bookingRef: string,
    status: string
) => {
    try {
        const updateData = await BookingModel.findOneAndUpdate({
            _id: bookingRef
        }, {
            $set: {
                bookingStatus: status,
            }
        }, {
            new: true
        })
        return updateData
    } catch (error) {
        console.log(error)
        return false
    }
}
export const GetBookingProducts = (ids: string[]) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await BookingModel.find({ _id: ids })
            if (list && list.length) {
                resolved(list)
            } else {
                resolved([])
            }
        } catch (error) {
            rejected(error)
        }
    })
}

export const updateMetaData = (pid: string, metaData: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const update = await Product.findOneAndUpdate({
                _id: pid
            }, {
                $set: {
                    metaData: metaData
                }
            }, {
                new: false
            })
            resolved(update)
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetVendorStock = (vendorRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await Product.find({ vendorRef: vendorRef })
            resolved(list)
        } catch (error) {
            rejected(error)
        }
    })
}

export const UpdateProduct = (productRef: string, data: ProductPayload) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const updateData = await Product.findOneAndUpdate(
                { _id: productRef },
                data,
                { new: false }
            )
            resolved(updateData)
        } catch (error) {
            rejected(error)
        }
    })
}
export const DeleteProduct = (productRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const deleteProduct = await Product.findByIdAndDelete(productRef)
            resolved(deleteProduct)
        } catch (error) {
            rejected(error)
        }
    })
}

export const FindAllProperty = () => {
    return new Promise(async (resolved, rejected) => {
        try {
            const data = await Product.find({})
            resolved(data)
        } catch (error) {
            rejected(error)
        }
    })
}
