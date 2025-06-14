import { Router,Request,Response } from "express";
import {updateMetaData} from "../../../src/services/auth.service"

const router = Router()

router.put('/update/:id',async(req:Request,res:Response)=>{
    const {metaData} = req.body
    const id = req.params.id
    if(!id){
        res.status(500).json({message:"user id params missing"})
        return
    }
    updateMetaData(metaData,id).then((response)=>{
        return res.status(200).json(response)
    }).catch((err)=>{
        return res.status(500).json(err)
    })

})

export default router