//when the page loads, call the init function
window.addEventListener("DOMContentLoaded", init);
var categories = new Array();
const defaultPicUrl = "res/missing_image.jpg";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

function init() {
	if (!id) {
		getCategoryData();
	} else {
		getSingleEvent();
	}
	getAllCategories();
}

function getAllCategories() {
	fetch("https://lovethatwillnotdie.com/wp_duo/wp-json/wp/v2/categories?_embed")
		.then(res => res.json())
		.then(handleCategories);
}

function getSingleEvent() {
	fetch("https://lovethatwillnotdie.com/wp_duo/wp-json/wp/v2/posts/" + id + "?_embed")
		.then(res => res.json())
		.then(handleSingleEvent);
}

function handleSingleEvent(event) {
	console.log(event);
	const template = document.querySelector(".newsTemplate").content;
	const eventCopy = template.cloneNode(true);

	const h1 = eventCopy.querySelector("h1");
	h1.textContent = event.title.rendered;

	const dateTime = eventCopy.querySelector(".date-time");
	dateTime.textContent = event.date.substring(0, 10);

	const categoryField = eventCopy.querySelector(".event-category");
	categoryField.textContent = categories[event.categories[0]];

	const content = eventCopy.querySelector("section");
	content.innerHTML = event.content.rendered;
	document.querySelector("#events").appendChild(eventCopy)
}

function handleCategories(data) {
	data.forEach(saveCategoriesInArray);
}

function saveCategoriesInArray(data) {
	categories[data.id] = data.name;
}

function getCategoryData() {
	fetch("https://lovethatwillnotdie.com/wp_duo/wp-json/wp/v2/posts?_embed")
		.then(res => res.json())
		.then(handleData);
}

function handleData(myData) {
	myData.forEach(showEvent);
}

function showEvent(event) {

	const template = document.querySelector(".newsTemplate").content;
	const eventCopy = template.cloneNode(true);

	const h1 = eventCopy.querySelector("h1");
	h1.textContent = event.title.rendered;

	const dateTime = eventCopy.querySelector(".date-time");
	dateTime.textContent = event.date.substring(0, 10);

	const categoryField = eventCopy.querySelector(".event-category");
	categoryField.textContent = categories[event.categories[0]];

	var imgNode = event._embedded["wp:featuredmedia"];
	imgPath = imgPath ? imgPath : defaultPicUrl;
	var imgPath = imgNode ? imgNode[0].media_details.sizes.medium_large.source_url : defaultPicUrl;
	//imgNode[0].media_details.sizes.medium_large.source_url : defaultPicUrl;
	console.log(imgPath);
	const img = eventCopy.querySelector("img.cover");
	img.setAttribute("src", imgPath)

	const a = eventCopy.querySelector("a");
	a.href = "sub-news.html?id=" + event.id

	const content = eventCopy.querySelector("section");
	content.innerHTML = event.excerpt.rendered;
	document.querySelector("#events").appendChild(eventCopy)
}
