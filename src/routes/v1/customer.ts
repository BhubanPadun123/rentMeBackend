import {Router,Request,Response} from "express"
import { GetCustomerOrder } from "../../services/v1/productPost.service"
import {
    CreatePayment,
    GetAllPayment,
    GetPaymentStatus,
    UpdatePayment
} from "../../services/v1/payment.service"
import {
    UpdateBookingStatus
} from "../../services/v1/order.manage"
import {
    PaymentModelCheck
} from "../../types/product.type"

const route = Router()

route.get('/order_detail',async(req:Request,res:Response)=>{
    const params = req.query
    const cutomerRef = params.customerRef as string
    if(!cutomerRef){
        res.status(501).json({message:"customer id missing"})
        return
    }
    GetCustomerOrder(cutomerRef).then((result)=>{
        return res.status(200).json(result)
    }).catch((error)=>{
        return res.status(500).json(error)
    })
})

route.post('/payment',async(req:Request,res:Response)=>{
    const body = req.body
    const {
        orderRef,
        customerRef,
        productRef,
        paymentId,
        paymentStatus,
        numberOfAttep=0
    } = body
    const data ={
        orderRef,
        customerRef,
        productRef,
        paymentId,
        paymentStatus,
        numberOfAttep
    }
    const validate = PaymentModelCheck.parse(data)
    GetPaymentStatus(validate.orderRef).then((result)=>{
        if(result){
            UpdatePayment(validate.orderRef,validate).then((result_1)=>{
                UpdateBookingStatus(validate.orderRef,"4").then((result_3)=>{
                    return res.status(200).json(result_3)
                }).catch((err)=>{
                    return res.status(500).json(err)
                })
            }).catch((err)=>{
                return res.status(500).json(err)
            })
        }else{
            CreatePayment(validate).then((result_2)=>{
                UpdateBookingStatus(validate.orderRef,"4").then((result_3)=>{
                    return res.status(200).json(result_3)
                }).catch((err)=>{
                    return res.status(500).json(err)
                })
            }).catch((err)=>{
                return res.status(500).json(err)
            })
        }
    }).catch((err)=>{
        res.status(500).json(err)
    })
})
route.get('/payment_detail/:orderid',(req:Request,res:Response)=>{
    const param = req.params
    const orderId = param.orderid as string
    

    if(!orderId){
        res.status(401).json({
            message:"order id missing!"
        })
    }
    GetPaymentStatus(orderId).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})

route.get('/payment',(req:Request,res:Response)=>{
    GetAllPayment().then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})


export default route