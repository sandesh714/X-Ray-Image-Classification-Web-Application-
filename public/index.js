let image_loaded = false;
$("#image-selector").change(function () {
	image_loaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let data_path = reader.result;
		$("#selected-image").attr("src", data_path);
		$("#prediction-list").empty();
		image_loaded = true;
	}
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
let model_loaded = false;
$( document ).ready(async function () {
	model_loaded = false;
	$('.progress-bar').show();
    // Loading the model
    model = await tf.loadLayersModel('model/model.json');
	$('.progress-bar').hide();
	model_loaded = true;
});

$("#predict-button").click(async function () {
	if (!model_loaded) {
		 alert("The model must be loaded first"); 
		 return; 
	}
	if (!image_loaded) {
		 alert("Please select an image first");
		 return; 
	}
	
	let image = $('#selected-image').get(0);
	let tensor = tf.browser.fromPixels(image, 3)
		.resizeNearestNeighbor([128, 128]) // Imagesize
		.expandDims()
		.toFloat();
	let predictions = await model.predict(tensor).data();
	let prob = Array.from(predictions)
		.map(function (p, i) { 
			return {
				probability: p,
				className: TARGET_CLASSES[i]
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 3);
	$("#prediction-list").empty();
	$("#prediction-list").append('<h2>Prediction</h2>');
	prob.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
		});
});