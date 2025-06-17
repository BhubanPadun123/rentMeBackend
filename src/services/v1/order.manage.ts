import BookingModel, {
    BookingPayload
} from "../../model/stockBooking.model";
import BookingConfirmationModel, {
    BookingConfirmationPayload
} from "../../model/bookingConfirmation.model";
import { bookingConfirmationPayloadCheck } from "../../types/vendor.type";

export const GetVendorBooking = (vendorId: string): BookingPayload[] | any => {
    return new Promise(async (resolved, rejected) => {
        try {
            const list = await BookingModel.find({ customerRef: vendorId })
            let productIds: BookingPayload[] = []
            if (Array.isArray(list) && list.length > 0) {
                list.map((item) => {
                    productIds.push(item)
                })
            }
            resolved(productIds)
        } catch (error) {
            rejected(error)
        }
    })
}

export const CreateOrderStatus = (data: BookingConfirmationPayload) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const dataValidation = bookingConfirmationPayloadCheck.parse(data)
            const newConfirmOrder = new BookingConfirmationModel(dataValidation)
            const saveData = await newConfirmOrder.save()
            resolved({
                message: "Updated successfully!"
            })
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetBookingStatus = (productId: string, uid: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const item = await BookingModel.findOne({ productRef: productId, customerRef: uid })
            resolved(item ? item : [])
        } catch (error) {
            rejected(error)
        }
    })
}

export const UpdateBookingStatus = (id: string, status: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const updateData = await BookingModel.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    bookingStatus: status
                }
            }, {
                new: false
            })
            resolved(updateData)
        } catch (error) {
            rejected(error)
        }
    })
}
export const CheckIsBookingAllow = (orderRef: string) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const order = await BookingModel.findById(orderRef)
            if (order) {
                const code = order.bookingStatus
                if (code !== "1") {
                    rejected({
                        message: "Can't allow for booking,This property is alrady occupy with other person",
                        occupancyCustomerId: order.customerRef
                    })
                } else {
                    resolved({
                        message: "Allow for booking"
                    })
                }
            } else {
                rejected({
                    message: `Order does not exist with id=${orderRef}`
                })
            }
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetOrdersInRange = async (start: number, end: number) => {
    return new Promise(async (resolved, rejected) => {
        const limit = end - start
        try {
            const data = await BookingModel.find().sort().skip(start).limit(limit)
            resolved(data)
        } catch (error) {
            rejected(error)
        }
    })
}