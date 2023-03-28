const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Property = require("./Property.js");
const app = express();
const PORT = process.env.port || 4000;
const router = express.Router();

const multer = require("multer");

// using cors() as middleware
// Cross-origin resource sharing (CORS) allows AJAX requests to skip the Same-origin policy and access resources from remote hosts.
app.use(cors());

// use body-parsing middleware to populate req.body
app.use(bodyParser.json());

// defining routes

// landing route
router.get("/", (req, res) => {
  res.send(
    "<html><head><body><h1>This is the landing page of the property app api</h1></body></head></html>"
  );
});

// GET route: To fetch all properties documents from MongoDB
router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find({});
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).send(`Server Side Error: ${error.message}`);
  }
});

// POST route: To add ONE new property document to MongoDB
const Storage = multer.diskStorage({
	destination: "uploads",
	filename: (req, file, cb) => {
	  cb(null, file.originalname);
	},
  });
  
  const uploadImage = multer({
	storage: Storage,
  }).single("testImage"); // <--- this should be the field name when requesting via Postman
  
  router.post("/properties/image", (req, res) => {
	try {
	  uploadImage(req, res, (err) => {
		if (err) {
		  console.log(err);
		} else {
		  const property = new Property({
			name: req.body.name,
			desc: req.body.desc,
			address: req.body.address,
			amentity: req.body.amentity,
			review: req.body.review,
			picture: {
			  data: req.file.filename, // using the multer object
			  contentType: "image/jpg",
			},
		  });
		  property.save().then((savedProperty) => {
			res.json(savedProperty);
		  });
		}
	  });
	} catch {
	  res.send(error.message).end();
	}
  });

// GET route: To fetch one documents from MongoDB by property name

// PUT route: To update property details by property name

// DELETE route: To remove property from MongoDB

app.use("/", router);

// connect to MongoDB
const apiUri =
  "mongodb+srv://allen-admin:test1234@cluster0.bzd3pij.mongodb.net/property-app?retryWrites=true&w=majority";
const dbConnect = () => {
  return mongoose.connect(apiUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });



/*

  // POST route: To add ONE new property document to MongoDB
router.post('/properties', async (req, res) => {
	const property = new Property(req.body)

	// Validate input data	
	try{
		await property.validate();
	} catch(error) {
		return res.status(400).send(`Client Side Error: ${error.message}`)
	}

	// Save data to MongoDB
	try{
		await property.save();
		return res.json(property)
	} catch(error) {
		return res.status(500).send(`Server Side Error: ${error.message}`)
	}
})

*/
