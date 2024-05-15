const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
    colors: [Schema.Types.Mixed],
    sizes: [Schema.Types.Mixed],
    highlights: [String],
    discountPrice: Number,
    deleted: { type: Boolean, default: false }
});

const virtualId = productSchema.virtual('id');
virtualId.get(function () {
    return this._id;
});

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

exports.Product = mongoose.model('Product', productSchema);
