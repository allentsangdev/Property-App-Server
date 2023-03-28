// Define Property Documnet Data Schema 
// Export Property Data Model

const mongoose = require ('mongoose')

const propertySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	amentity: [],
	review: [],
	picture: [{
    	data: Buffer,
    	contentType: String
  	}]
})

const Property = mongoose.model('properties', propertySchema )

module.exports = Property