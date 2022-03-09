const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
},
{
    toJson: {
        virtuals: true,
    },
    id: false,
}
);

PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
  });

// create model using schema
const Pizza = model('Pizza', PizzaSchema);

// export
module.exports =  Pizza;