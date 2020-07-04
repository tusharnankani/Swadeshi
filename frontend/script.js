const get = document.querySelector.bind(document);

let
	phone,
	otp,
	resendOtp,
	submit
;

window.addEventListener("load", e => {
	phone = get("#Number");
	otp = get("#Otp");
	
	submit = get("#Submit");
	submit.addEventListener("click", handleSubmit);
	
	resendOtp = get("#Resend");
	resendOtp.addEventListener("click", e => {
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
		resendOtp.classList.remove("hide");
		get("#OtpWrapper").classList.remove("hide");
		
		state = "otp";
	}
	else if(state == "otp"){
		let authResponse = await authenticateUser(phone.value, otp.value);
		if(authResponse.status == 200){
			await checkAuthentication();
			state = "done";
		}
		else
			displayError("#OtpWrapper", "Invalid or expired OTP");
	}
}

function checkInputs(){
	let isValid = true;
	if(!isInputValid(phone)){
		displayError("#NumberWrapper", "Please check the phone number");
		isValid = false;
	}
	if(state == "otp" && !isInputValid(otp)){
		displayError("#OtpWrapper", "OTP must be 4 digits");
		isValid = false;
	}
	
	return isValid;
}

function isInputValid(input){
	return new RegExp(input.pattern).test(input.value);
}

function displayError(inputWrapper, message){
	if(typeof inputWrapper == "string")
		inputWrapper = get(inputWrapper);
	
	//TODO: Show error somehow.
	console.error(message);
}

async function getOtp(phone){
	return sendApiRequest("/auth/otp", {
		method: "POST",
		body: {
			phoneNumber: phone
		}
	}).then(assertOK);
}

async function authenticateUser(phone, otp){
	return sendApiRequest("/auth", {
		method: "POST",
		body: {
			phoneNumber: phone,
			otp
		}
	});
}

async function checkAuthentication(){
	let r = await sendApiRequest("/auth/user");
	let data = await r.json();
	
	let path;
	if(r.status == 200){
		if(data.isFarmer)
			path = "/dashboard/farmer";
		else if(data.isWholesaler)
			path = "/dashboard/wholesaler";
	}
	else if(r.status == 404)
		path = "/signup";
		
	if(path)
		window.location.pathname += path;
}

function assertOK(e){
	if(!e || !e.status || e.status != 200)
		throw new Error("Assert OK failed");
	
	return e;
}

async function sendApiRequest(url, options = {}){
	options = Object.assign({}, options);
	
	if(typeof options.body == "object"){
		if(!options.headers)
			options.headers = {};
		if(!options.headers["Content-Type"])
			options.headers["Content-Type"] = "application/json";
		
		options.body = JSON.stringify(options.body);
	}
	
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