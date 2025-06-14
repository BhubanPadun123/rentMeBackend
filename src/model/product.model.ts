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
    metaData: any;
}

// Define the schema
const ProductSchema = new Schema<ProductPayload>({
    vendorRef: { type: String, required: true },
    productTitle: { type: String, required: true },
    productType: { type: String, required: true },
    postAt: { type: String, required: true },
    availableStatus: { type: Boolean, required: true },
    propertyOccupancy: { type: [String], required: true },
    metaData: {type:Object}
});

// Create and export the model
const Product = mongoose.model<ProductPayload>('Product', ProductSchema);
export default Product;
