/**
 * Product Model.
 * Defines the product schema including relationships back to the User model.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// We define the exact blueprint for our products
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  // Adding the relation to the User model!
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Mongoose takes the blueprint and turns it into a Model we can use in our controllers
module.exports = mongoose.model('Product', productSchema);