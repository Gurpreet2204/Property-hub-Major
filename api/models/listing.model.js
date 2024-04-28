import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    appointmentFees:{
      type:Number,
      required:true,
    },
    keywords:{
      type:String,
      required:true
    },
    villa:{
      type:Boolean,
    },
    bunglow:{
      type:Boolean,
    },
    appartment:{
      type:Boolean,
    },
    townHouse:{
      type:Boolean,
    },
    condominum:{
      type:Boolean,
    },
    duplex:{
      type:Boolean,
    },
    triplex:{
      type:Boolean
    },
    other:{
      type:Boolean,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
