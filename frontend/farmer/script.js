let
	items,
	createNewItem
;

window.addEventListener("load", () => {
	checkAuthentication();
	
	items = get("#Items > tbody");
	loadItems();
	
	createNewItem = get("#createNewItem");
	createNewItem.addEventListener("click", e => {
		get("#AddItem").classList.toggle("hide");
		e.preventDefault();
	});
	
	get("#AddNewItem").addEventListener("click", addItem);
});

async function loadItems(){
	let r = await sendApiRequest("/farmer/products");
	let data = await r.json();
	
	if(r.status != 200)
		console.error(data);
	
	for(let p of data.products)
		items.appendChild(createItemRow(p));
}

function createItemRow(p){
	let tr = createElement("tr");
	
	for(let e of [
			p.category,
			p.item,
			p.totalQty + " " + p.unit,
			p.availableQty + " " + p.unit,
			"₹ " + p.price
		])
		createElement("td", tr, {innerText: e});
	
	let removeButton = createElement("td", tr);
	createElement("i.fa.fa-minus-circle", removeButton);
	removeButton.addEventListener("click", removeItem);
	
	return tr;
}

async function removeItem(e){
	await sendApiRequest("/farmer/product", {
		method: "DELETE",
		body: {
			item: this.parentElement.querySelector("td:nth-child(2)").innerText
		}
	}).then(assertOK);
	
	this.parentElement.remove();
}

async function addItem(){
	let data = {
		category: get("#Item").selectedOptions[0].parentElement.label,
		item: get("#Item").selectedOptions[0].value,
		unit: get("#Unit").selectedOptions[0].value,
		totalQty: +get("#Quantity").value,
		availableQty: +get("#Quantity").value,
		price: +get("#Price").value,
	};
	
	await sendApiRequest("/farmer/product/add", {
		method: "POST",
		body: data
	}).then(assertOK);
	items.appendChild(createItemRow(data));
	
	get("#AddItem").classList.add("hide");
	get("#Quantity").value = "";
	get("#Price").value = "";
}

function createOrderRow(p){
	let tr = createElement("tr");
	
	for(let e of [
			p.date.toLocaleString(),
			p.category,
			p.item,
			p.required + p.unit,
			"₹ " + p.price,
			p.phoneNumber
		])
		createElement("td", tr, {innerText: e});
	
	return tr;
}