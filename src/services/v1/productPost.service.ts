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
    productTitle: string;
    productType: string;
    postAt: string;
    availableStatus: boolean;
    metaData: {
        description: string;
        availableAminities: availableAminities[],
        rentInfo: {
            depositeAmount: string;
            rent_per_month: string
        },
        vendorContactInfo: {
            name: string;
            email: string;
            contactNumber: string;
        },
        addressInfo: {
            pinCode: string;
            district: string;
            state: string;
            town: string;
            localAdd: string;
        },
        geoLocation: any,
        propertyImages: images[]
    },
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

export const GetProductList = (start: number, end: number) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const limit = end - start
            const products = await Product.find().skip(start).limit(limit).exec()
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
            const newBooking = new BookingModel(validateData)
            const saveNewBooking = await newBooking.save()
            resolved(saveNewBooking)
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetVendorProduct = (id: string[]) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const productList = await Product.find({ vendorRef: id })
            resolved(productList ? productList : [])
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetOrderVendor = (productRef: string, vendorRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await BookingModel.find({ productRef: productRef, vendorRef: vendorRef })
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
            console.log(productData)
            return true
        }
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}
export const UpdateBookingStatus = async (
    vendorRef: string,
    customerRef: string,
    productRef: string,
    status: string,
    message: string
): Promise<boolean> => {
    try {
        const updateData = await BookingModel.findOneAndUpdate({
            vendorRef,
            customerRef,
            productRef
        }, {
            $set: {
                bookingStatus: status,
                message: message
            }
        }, {
            new: true
        })
        return !!updateData
    } catch (error) {
        console.log(error)
        return false
    }
}