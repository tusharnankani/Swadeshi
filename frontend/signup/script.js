let
	entities,
	name,
	aadhaar
;

window.addEventListener("load", () => {
	checkAuthentication();
	
	entities = Array.from(document.querySelectorAll(".entity"));
	get("#EntitySelect").addEventListener("click", selectEntity);
	
	name = get("#Name");
	aadhaar = get("#Aadhar");
	
	get("#Submit").addEventListener("click", signupUser);
});

function selectEntity(e){
	if(!e.target.matches("button:not(.disabled)"))
		return;
	
	for(let i of entities)
		i.classList.remove("selected");
	e.target.classList.add("selected")
}

async function signupUser(){
	let data = validateInputs();
	if(!data)
		return;
	
	let r = await sendApiRequest("/auth/add", {
		method: "POST",
		body: {
			name: data.name,
			aadhaar: data.aadhaar,
			isFarmer: (data.entity == "farmer"),
			isWholesaler: (data.entity == "wholesaler")
		}
	});
	
	if(r.status == 200)
		await checkAuthentication();
	else
		console.error(await r.json());
}

function validateInputs(){
	let data = {};
	let isValid = true;
	
	data.entity = null;
	for(let i of entities)
		if(i.classList.contains("selected"))
			data.entity = i.dataset.value;
	if(!data.entity){
		isValid = false;
		alert("Please select one entity");
		console.error("Please select one entity");
	}
	
	data.name = name.value;
	if(!isInputValid(name)){
		isValid = false;
		alert("Please check the name");
		console.error("Please check the name");
	}
	
	data.aadhaar = aadhaar.value;
	if(!isInputValid(aadhaar)){
		isValid = false;
		alert("Please check the aadhaar card number");
		console.error("Please check the aadhaar card number");
	}
	
	if(!isValid)
		return null;
	return data;
}
