Farmer's Dashboard
1. Manage {Products|Produce|Crops}
	- List with + on bottom and - next to each item
	
		| Items |
		|-------|
		|Matar (-) {in RED}
		|Gajar (-)
		|{+Add new}

	- Add new
		- (With an option to search through all categories)

		|Categories:|
		|-----------|
		|Fruits	    |Apple, Orange, Mango, Pear, Watermelon, Lychee, Banana, Coconut
		|Vegetables |Tomato, Carrot, Peas, Cucmber, Potato, Onion, Garlic, Cabbage, Cauliflower, Lady's finger
		|Pulses     |Moong dal, Rajma, Chole, Chana dar, Toor dal, Kali daal, Urad dal
		|Grains     |Rice, Wheat, Bajra, Ragi, Millets, Oats, Barley
		|Spices     |Coriander, Pudhina (Mint), Turmeric, Ginger, Cloves, Chillies, Pepper, Cumin, Fenugreek (Methi)


	- Units of measurements
		- Quintal (Kg)
		- Ton
		- Kg

1. View Orders
	- (Two tabs)
	- Past orders
	- Open orders

| Orders  |
|Past|Open|

1. Account Settings
	- Get help
	- Add email
	- Profile Picture (Base64 String (`btoa(<data>)`); max size 1 Mb)
	- Location (With option to use current location using `navigator.geolocation.getCurrentPosition(console.log);`)
	- {
		latitude: <8 digits of precision>
		longitude: <8 digits of precision>
		accuracy: <32 bit integer>
	}
	- Maybe use Location along with https://wiki.openstreetmap.org/wiki/API to display map like Booking.com https://www.booking.com/searchresults.en-gb.html?ss=paris#map_opened-map-header-cta

On UserSchema Products: [
	{
		category: <Category (String)>
		item: <Item of Category>
		original units: <Unit of Units>
		total quantity: double representing Kg
		available quantity: double representing Kg
		price: ₹ per Kg
	}
]

1. Endpoints
	- /otp (Rate-limited?)
	POST: {
		phone_number: String
		regex: /+\d{0,3} \d{10}/
	}
	RET: {
		status: "OK"
	}
	else: {	
		status: "Invalid Phone"
	}
	
	- /authenticate
	POST: {
		phone_number: String,
		regex: /+\d{0,3} \d{10}/
		
		otp: String
		regex: /+\d{4}/
	}
	RET: {
		status: "OK" + Set Cookie (X-User-Auth-Token) Header
	}
	else: {
		status: "Invalid Phone" | "Invalid OTP" | "Access denied"
	}
	
	- /user
	GET: {}
	RET: {
		status: "OK"
		user: {Authenticated user}
	}
	else: {
		status: "Access denied"
	}
	
	- /users/add
	POST: {
		farmer/wholesaler
		
		name
		regex: /\w{3}/
	}
	RET: {
		status: "OK"
	}
	else: {
		status: "User already exists" | "Incomplete data"
	}