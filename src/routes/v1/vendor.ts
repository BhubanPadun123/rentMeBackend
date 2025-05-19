import {
    Router,
    Request,
    Response
} from "express"
import {
    GetVendorProduct
} from "../../services/v1/productPost.service"
import {
    GetVendorBooking
} from "../../services/v1/order.manage"


const router = Router()
router.get('/vender/product',async(req:Request,res:Response)=>{
    const params = req.query
    const id:string = params._id as string
    GetVendorProduct(id).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(401).json(err)
    })
})
router.get('/vendor/booking',async(req:Request,res:Response)=>{
    const params = req.query
    const vendorId:string = params.vendorRef as string
    const productRef:string = params.productRef as string

    GetVendorBooking(vendorId,productRef).then((result)=>{
        let productList:any = []
        GetVendorProduct(vendorId).then((result_1)=>{
            if(Array.isArray(result_1) && result_1.length > 0 && Array.isArray(result)){
                result_1.map((item)=>{
                    if(result.includes(item.productRef)){
                        productList.push(item)
                    }
                })
            }
            return res.status(200).json(productList)
        }).catch((err)=>{
            return res.status(500).json(err)
        })
    }).catch((error)=>{
        return res.status(500).json(error)
    })
})


export default router