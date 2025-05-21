import {
    Router,
    Request,
    Response
} from "express"
import {
    GetVendorProduct,
    GetOrderVendor,
    GetVendorCustomers
} from "../../services/v1/productPost.service"
import {
    GetVendorBooking,
    CreateOrderStatus,
} from "../../services/v1/order.manage"
import {
    bookingConfirmationPayloadCheck
} from "../../types/vendor.type"
import {
    BookingPayload
} from "../../model/stockBooking.model"
import {
    BookingConfirmationPayload
} from "../../model/bookingConfirmation.model"


const router = Router()
router.get('/vender/product',async(req:Request,res:Response)=>{
    const params = req.query
    const id:string = params.userId as string
    GetVendorProduct([id]).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(401).json(err)
    })
})
router.get('/vendor/booking',async(req:Request,res:Response)=>{
    const params = req.query
    const vendorId:string = params.vendorRef as string

    GetVendorBooking(vendorId).then((result:BookingPayload[])=>{
        let productIds:string[] = []
        result.length > 0 && result.map((item)=> productIds.push(item.vendorRef))
        GetVendorProduct(productIds).then((result_1)=>{
            return res.status(200).json(result_1)
        }).catch((err)=>{
            return res.status(500).json(err)
        })
    }).catch((error:any)=>{
        return res.status(500).json(error)
    })
})
router.get('/vendor/order_details',async(req:Request,res:Response)=>{
    const params = req.query
    const productRef = params.productRef as string
    const vendorRef = params.vendorRef as string
    GetOrderVendor(productRef,vendorRef).then((result)=>{
        let customerIds:string[] = []
        result && Array.isArray(result) && result.map((item)=> customerIds.push(item.customerRef))
        GetVendorCustomers(customerIds).then((result_1)=>{
            return res.status(200).json(result_1)
        }).catch((err)=>{
            return res.status(501).json(err)
        })
    }).catch((error)=>{
        return res.status(501).json(error)
    })
    
})


export default router