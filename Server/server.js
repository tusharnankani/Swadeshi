const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// DB connection
const db = "mongodb://127.0.0.1:27017/tsec_codestorm_july_2020"
mongoose.connect(
	db, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("MongoDB local connected..."))
	.catch(console.err);

// Middleware
app.use(express.urlencoded({extended: false}));

// Routes
//app.use("/wholesaler", require("./routes/wholesaler.js"));
//app.use("/farmer", require("./routes/farmer.js"));

// Static files
app.use(express.static(path.join(__dirname, "../HomePage")));

// Port
const PORT = process.env.PORT || 5000;
app.listen(
	PORT,
	(err) => {
		if(err)
			throw err;

		console.log("Server started on http://localhost:" + PORT);
	}
);