const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    fname:{
        type : 'string',
    },
    lname :{
        type : 'string',
    },
    email:{
        type : 'string',
        unquie:true,
    },
    address:{
        type : 'string',
    }
})


const contact = mongoose.model('contact', contactSchema);

module.exports = contact

