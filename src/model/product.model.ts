import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript type
type images = {
    url: string;
};

// Define the ProductPayload interface
export interface ProductPayload extends Document {
    vendorRef: string;
    productTitle: string;
    productType: string;
    postAt: string;
    availableStatus: boolean;
    propertyOccupancy: string[];
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
        propertyImages: images[];
    };
}

// Define the schema
const ProductSchema = new Schema<ProductPayload>({
    vendorRef: { type: String, required: true },
    productTitle: { type: String, required: true },
    productType: { type: String, required: true },
    postAt: { type: String, required: true },
    availableStatus: { type: Boolean, required: true },
    propertyOccupancy: { type: [String], required: true },
    metaData: {
        type: new Schema({
            description: { type: String, required: true },
            availableAminities: [{
                name: { type: String, required: true },
                count: { type: Number, required: true }
            }],
            rentInfo: {
                depositeAmount: { type: String, required: true },
                rent_per_month: { type: String, required: true }
            },
            vendorContactInfo: {
                name: { type: String, required: true },
                email: { type: String, required: true },
                contactNumber: { type: String, required: true }
            },
            addressInfo: {
                pinCode: { type: String, required: true },
                district: { type: String, required: true },
                state: { type: String, required: true },
                town: { type: String, required: true },
                localAdd: { type: String, required: true }
            },
            geoLocation: {
                type: Schema.Types.Mixed,
                required: false
            },
            propertyImages: [{
                url: { type: String, required: true }
            }]
        }),
        required: true
    }
});

// Create and export the model
const Product = mongoose.model<ProductPayload>('Product', ProductSchema);
export default Product;
