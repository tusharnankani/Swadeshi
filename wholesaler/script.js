let
	user,
	openOrders,
	closedOrders,
	
	searchInput,
	dropdown,
	items,
	
	currentElement
;

window.addEventListener("load", async () => {
	checkAuthentication();
	
	user = await sendApiRequest("/auth/user")
		.then(assertOK)
		.then(e => e.json());
	
	openOrders = get("#open-orders > tbody");
	closedOrders = get("#delivered-items > tbody");
	loadOrders();
	
	dropdown = get("#dropdown");
	items = [];
	loadProducts();
	
	searchInput = get("#searchInput");
	searchInput.addEventListener("keyup", updateSearchResults);
	
	get("#AddNewOrder").addEventListener("click", postOrder);
});

async function loadOrders(){
	let data = await sendApiRequest("/wholesaler/orders")
		.then(assertOK)
		.then(e => e.json());
	
	for(let o of data.orders)
		addOrderRow(o);
}

function addOrderRow(p){
	let tr = createElement("tr");
	
	let d = new Date(p.date);
	let date = 
		(d.getDate()) + "/" +
		(d.getMonth() + 1) + "/" +
		(d.getYear() + 1900)
	;
	
	for(let e of [
			date,
			p.product.category,
			p.product.item,
			p.quantity + " " + p.product.unit,
			"₹ " + p.product.price,
			p.farmerId
		])
		createElement("td", tr, {innerText: e});
	
	if(p.isOpen){
		let completeButton = createElement("td", tr);
		createElement("i.fa.fa-check", completeButton);
		completeButton.addEventListener("click", () => orderComplete(p, completeButton));
		
		openOrders.appendChild(tr);
	}
	else
		closedOrders.appendChild(tr);
	
	return tr;
}

async function orderComplete(p, element){
	let order = element.parentElement;
	
	await sendApiRequest("/wholesaler/orders/complete", {
		method: "PATCH",
		body: {
			_id: p._id
		}
	}).then(assertOK);
	
	order.remove();
	element.remove();
	closedOrders.appendChild(order);
}

async function loadProducts(){
	let data = await sendApiRequest("/wholesaler/farmers")
		.then(assertOK)
		.then(e => e.json());
	
	let item;
	for(let farmer of data.farmers)
		for(let i of farmer.products){
			item = createDropdownElement(i, dropdown);
			item.farmer = farmer;
			items.push(item);
		}
}

function createDropdownElement(data, parent = null){
	let element = createElement("div.dropdown-item", parent);
	element.data = data;

	element.show = function(){
		this.classList.remove("hide");
	};
	element.hide = function(){
		this.classList.add("hide");
	};

	element.filter = function(text){
		let searchValues = text.replace(/[^A-Za-z0-9 ]/g, "").split(" ");

		this.matchScore = 0;

		const INDEX_PROPERTIES = ["category", "item", "price", "availableQty"];
		for(let i = 0; i < INDEX_PROPERTIES.length; i++)
			for(let token of searchValues){
				if(
					this.data[INDEX_PROPERTIES[i]]
						.toString()
						.replace(/[^A-Za-z0-9 ]/g, "")
						.match(new RegExp(token, "i"))
				){
					this.show();
					this.matchScore = INDEX_PROPERTIES.length - i;
					return true;
				}
			}

		this.hide();
		return false;
	};

	element.addEventListener("click", () => placeOrder(element));

	createElement("span.category", element, {innerText: data.category});
	createElement("span.price", element, {innerText: "₹ " + data.price + "/" + data.unit});
	createElement("span.item", element, {innerText: data.item});
	createElement("span.availableQty", element, {innerText: data.availableQty + " " + data.unit});

	return element;
}

function placeOrder(element){
	if(!element || !element.farmer)
		return;
	
	get("#AddOrder").classList.remove("hide");
	
	get("#Date").value = new Date().toISOString().substring(0, 10);
	get("#Category").value = element.data.category;
	get("#Item").value = element.data.item;
	get("#Price").value = "₹ " + element.data.price + "/" + element.data.unit;
	
	currentElement = element;
}

async function postOrder(){
	if(!currentElement)
		return;
	
	let data = {
		wholesalerId: user.id,
		farmerId: currentElement.farmer.id,
		date: get("#Date").value,
		product: currentElement.data,
		quantity: +get("#Quantity").value
	};
	
	let order = await sendApiRequest("/wholesaler/orders", {
		method: "POST",
		body: data
	})
		.then(assertOK)
		.then(e => e.json());
	data._id = order._id;
	data.isOpen = true;
	openOrders.appendChild(addOrderRow(data));
	
	get("#AddOrder").classList.add("hide");
	get("#Quantity").value = "";
	currentElement = null;
}

function updateSearchResults(e){
	let value = searchInput.value;
	if(value.length > 0)
		dropdown.classList.add("show");
	else{
		dropdown.classList.remove("show");
		return;
	}

	const MAX_HITS = 8;
	let n = 0;
	for(let element of items)
		if(n >= MAX_HITS)
			element.hide();
		else if(element.filter(value))
			n++;

	items.sort((a, b) => {
		let p = b.matchScore - a.matchScore;
		if(p != 0)
			return p;

		return a.data.item.localeCompare(b.data.item);
	});
	for(let element of items)
		dropdown.appendChild(element);
}