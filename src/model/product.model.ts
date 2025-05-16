import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interface
type images = {
    url:string
}
export interface ProductPayload extends Document {
    vendorRef: string;
    productTitle: string;
    productType: string;
    postAt: string;
    availableStatus: boolean;
    propertyOccupancy: {
        occupancy: string;
    }[];
    metaData: {
        description: string;
        availableAminities: {
            name: string;
            count: number;
        }[];
        rentInfo: {
            depositeAmount: string;
            rent_per_month: string;
        };
        vendorContactInfo: {
            name: string;
            email: string;
            contactNumber: string;
        };
        addressInfo: {
            pinCode: string;
            district: string;
            state: string;
            town: string;
            localAdd: string;
        };
        geoLocation?: any;
        propertyImages:images[]
    };
}

// Sub-schemas
const AvailableAmenitySchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true }
});

const RentInfoSchema = new Schema({
    depositeAmount: { type: String, required: true },
    rent_per_month: { type: String, required: true }
});

const VendorContactInfoSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true }
});

const AddressInfoSchema = new Schema({
    pinCode: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    town: { type: String, required: true },
    localAdd: { type: String, required: true }
});

const PropertyOccupancySchema = new Schema({
    occupancy: { type: String, required: true }
});
const PropertyImagesSchema = new Schema({
    url:{type:String,require:true}
})

const MetaDataSchema = new Schema({
    description: { type: String, required: true },
    availableAminities: [AvailableAmenitySchema],
    rentInfo: RentInfoSchema,
    vendorContactInfo: VendorContactInfoSchema,
    addressInfo: AddressInfoSchema,
    geoLocation: { type: Schema.Types.Mixed },
    propertyImages:PropertyImagesSchema
});

// Main Product Schema
const ProductSchema = new Schema<ProductPayload>({
    vendorRef: { type: String, required: true },
    productTitle: { type: String, required: true, minlength: 6, maxlength: 100 },
    productType: { type: String, required: true },
    postAt: { type: String, required: true },
    availableStatus: { type: Boolean, required: true },
    propertyOccupancy: [PropertyOccupancySchema],
    metaData: MetaDataSchema
});

const Product = mongoose.model<ProductPayload>('Product', ProductSchema);

export default Product;
