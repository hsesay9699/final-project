// Created the Order model using Mongoose. This schema defines how an order 
// document is structured, embedding the full product data and linking to the User.
/**
 * Order Model.
 * Defines the final order schema for completed checkouts.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
