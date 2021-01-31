const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    number_of_items: {
        type: Number,
        required: true
    },
    /* `status` field may be in 1 of 4 states:
    * - 'placed'
    * - 'sent'
    * - 'delivered'
    * - 'cancelled' (once done, can't be reversed)*/
    status: {
        type: String,
        required: true
    }
})

mongoose.model('Order', orderSchema);