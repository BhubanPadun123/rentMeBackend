import {
    Router,
    Request,
    Response
} from "express"
import {
    GetVendorProduct,
    GetOrderVendor,
    GetVendorCustomers,
    UpdateBookingStatus,
    CheckProductAvailable,
    GetBookingProducts,
    GetProductList,
    UpdateProductAvialableStatus
} from "../../services/v1/productPost.service"
import {
    GetVendorBooking,
    CreateOrderStatus,
    GetBookingStatus,
    CheckIsBookingAllow,
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
import {
    updateMetaData
} from "../../services/v1/productPost.service"


const router = Router()
router.get('/metaData',async(req:Request,res:Response)=>{
    const params = req.query
    const id:string = params.userId as string
    GetVendorProduct([id]).then((result:any)=>{
        const metaData = Array.isArray(result) && result[0].metaData && JSON.parse(result[0].metaData)
        return res.status(200).json(metaData)
    }).catch((err)=>{
        return res.status(401).json(err)
    })
})
router.get('/booking',async(req:Request,res:Response)=>{
    const params = req.query
    const vendorId:string = params.vendorRef as string

    GetVendorBooking(vendorId).then((result:BookingPayload[])=>{
        let productIds:string[] = []
        result.length > 0 && result.map((item)=> productIds.push(item.productRef))
        GetVendorProduct(productIds).then((result_1)=>{
            return res.status(200).json(result_1)
        }).catch((err)=>{
            return res.status(500).json(err)
        })
    }).catch((error:any)=>{
        return res.status(500).json(error)
    })
})
router.get('/status',async(req:Request,res:Response)=>{
    const params = req.query
    const orderId:string = params.orderId as string
    const uid:string = params.uid as string
    GetBookingStatus(orderId,uid).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})
router.get('/order_details',async(req:Request,res:Response)=>{
    const params = req.query
    const vendorRef = params.vendorRef as string
    GetOrderVendor(vendorRef).then((result)=>{
        return res.status(200).json(result)
    }).catch((error)=>{
        return res.status(501).json(error)
    })
    
})

router.put('/vendor/orders',async(req:Request,res:Response)=>{
    let {
        ids
    } = req.body
    if(!ids){
        res.status(501).json({
            message:"Property booking ids misshing!!"
        })
        return
    }
    GetBookingProducts(ids).then((result)=>{
        res.status(200).json(result)
        return
    }).catch((error)=>{
        res.status(500).json(error)
        return
    })
})

router.put('/update_booking',async(req:Request,res:Response)=>{
    let {
        bookingRef,
        status,
        pid,
        metaData
    } = req.body

    if(!bookingRef || !pid || !metaData){
        res.status(401).json({
            message:"mandatory data not provided!"
        })
        return
    }
    updateMetaData(pid,metaData).then(async(result)=>{
        console.log(result,"<<<")
        const isUpdated = await UpdateBookingStatus(bookingRef,status)
        if(isUpdated){
            res.status(200).json({
                message:"status updated successfully!"
            })
        }else{
            res.status(500).json({
                message:"Error while update the booking status,Please try after sometime"
            })
            return
        }
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})

router.get('/product',async(req:Request,res:Response)=>{
    
})


export default router