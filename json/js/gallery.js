/* Add global variables */
var viewer, photo_list, arrow_right, arrow_left, thumbnails;
var current = 3;

/* Execute start functions when document has loaded */
document.addEventListener("DOMContentLoaded", function(event) { 
	viewer = document.getElementById("viewer");
	loadJSON();
	addArrows();
});

/* Load JSON file from server, parse and
   call registerEvents function when finished */
function loadJSON() {
	var data_file = "json/gallery.json";
	var request = new XMLHttpRequest();

	request.onreadystatechange = function(){
		if (request.readyState==4 && request.status==200){
			photo_list = JSON.parse(request.responseText).photos;
			registerEvents();
		}
	}

	request.open("GET", data_file, true);
	request.send();
}


/* Add arrow */
function addArrows(){
	viewer_image = viewer.getElementsByTagName("img")[0];
	arrow_left = document.createElement("span");
	arrow_left.id = "arrow_left";
	arrow_left.innerHTML = "&lt;";
	viewer.insertBefore(arrow_left,viewer_image);
	arrow_right = document.createElement("span");
	arrow_right.id = "arrow_right";
	arrow_right.innerHTML = "&gt;";
	viewer.insertBefore(arrow_right,viewer_image.nextSibling);
}

/* Register events for thumbnails, arrows and keys */
function registerEvents(){
	thumbnails = document.getElementById("thumbnails").getElementsByTagName("a");
	for (var i=0, len=thumbnails.length; i<len ;i++){
		thumbnails[i]._id = i+1;
		thumbnails[i].addEventListener('click', showPhoto);
	}
	arrow_left.addEventListener('click',showPrev);
	arrow_right.addEventListener('click',showNext);
	document.onkeydown = function(event) {
    	switch(event.keyCode) {
    		case 37:
    		showPrev();
    		break;
    		case 39:
    		showNext();
    		break;
    	}
	}
}

/* Show next photo on viewer */
function showNext(){
	if (current == 6){
		thumbnails[0].click();
	} else {
		thumbnails[current].click();
	}
	
}

/* Show previous photo on viewer */
function showPrev(){
	if (current == 1){
		thumbnails[5].click();
	} else {
		thumbnails[current-2].click();
	}
}

/* Change photo on viewer */
function showPhoto() {
	event.preventDefault();
	//Remove selected class from previous selected
	var selected = document.getElementsByClassName("selected");
	for (var i =0, len=selected.length; i<len ; i++) {
		selected[i].className = selected[i].className.replace(/\s*?selected/,'');
	}

	//Save current ID
	current = this._id;

	//Add selected class to current one
	var li_node = this.parentNode;
	li_node.className += " selected";

	// Change viewer to selected photo
	var this_photo = photo_list[this._id-1];
	viewer.getElementsByTagName("img")[0].src = this_photo.image;
	viewer.getElementsByTagName("h2")[0].innerHTML = this_photo.title;
	viewer.getElementsByTagName("p")[0].innerHTML = "Taken at the Intel Conference in " + this_photo.location + " on " + this_photo.date;

}