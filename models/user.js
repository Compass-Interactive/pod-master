const mongoose = require('mongoose');

//An user can have multiple podcasts so array used 

const user = new mongoose.Schema({
    username :{
        type: String,
        unique: true,
        required: true,
    },
    email :{
        type: String,
        unique: true,
        required: true,
    },
    password :{
        type: String,
        unique: true,
        required: true,
    },
    podcasts :[{
        type: mongoose.Types.ObjectId,
        ref: "podcasts"
    },
],

},
{timestamps: true}
);

module.exports = mongoose.model('user', user);