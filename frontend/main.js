const get = document.getElementById.bind(document);

let
	phoneNumber,
	otp,
	submit
;

window.addEventListener("load", e => {
	phoneNumber = get("#number");
	otp = get("#Otp");
	
	submit = get("#Submit");
	submit.addEventListener("click", handleSubmit);
	
	get("#NewOtp").addEventListener("click", e => {
		if(checkInputs())
			getOtp(phone.value);
	});
	
	checkAuthentication();
});

let state = "phone";
async function handleSubmit(e){
	if(!checkInputs())
		return;
	
	if(state == "phone"){
		await getOtp(phone.value)
		get("#OtpWrapper").classList.remove("hide");
		state = "otp";
	}
	else if(state == "otp"){
		if(await authenticateUser(phone.value, otp.value)){
			checkAuthentication(true);
			state = "done";
		}
		else
			displayError("#OtpWrapper", "Invalid or expired OTP");
	}
}

function checkInputs(){
	let isValid = true;
	if(!isInputValid(phone.value)){
		displayError("#NumberWrapper", "Please check the phone number");
		isValid = false;
	}
	if(!isInputValid(otp.value)){
		displayError("#OtpWrapper", "OTP must be 4 digits");
		isValid = false;
	}
	
	return isValid;
}

function isInputValid(input){
	return (input.value.match(new RegExp(input.pattern)) == null);
}

function displayError(inputWrapper, message){
	if(typeof inputWrapper == "string")
		inputWrapper = get(inputWrapper);
	
	console.err(message);
	//TODO: Show error somehow.
}

async function getOtp(phone){
	return sendApiRequest("/otp", {
		method: "POST",
		body: {
			"phone_number": phone
		}
	}).then(assertOK);
}

async function authenticateUser(phone, otp){
	return sendApiRequest("/authenticate", {
		method: "POST",
		body: {
			"phone_number": phone,
			"otp": otp
		}
	}).then(assertOK);
}

async function checkAuthentication(isAuthenticated = false){
	let r = await sendApiRequest("/users");
	let data = await r.json();
	
	let path; 
	if(r.status == 200 && data.status == "OK")
		if(data.isFarmer)
			path = "/dashboard/farmer";
		else if(data.isWholesaler)
			path = "/dashboard/wholesaler";
	
	else if(isAuthenticated && r.status == 403 && data.status == "Access denied")
		path = "/signup";
	
	if(path)
		window.location.href += path;
}

function assertOK(e){
	if(!e || !e.status || e.status != 200)
		throw new Error("Assert OK failed");
	
	return e;
}

async function sendApiRequest(url, options){
	options = Object.assign({}, options);
	
	if(options && typeof options.body == "object")
		options.body = JSON.stringify(options.body);
	
	return fetch(url, options);
}



// A+ A- Buttons

function fontInc(){
	var el = document.getElementById('body');
	var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style); 
	el.style.fontSize = (fontSize + 1) + 'px';
	// adding smooth transitioning;
	el.style.transition = 'ease 0.3s';
}

function fontDec(){
	var el = document.getElementById('body');
	var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style); 
	el.style.fontSize = (fontSize - 1) + 'px';
	el.style.transition = 'ease 0.3s';
}