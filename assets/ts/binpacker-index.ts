
class PackerImage {
	
	constructor(public cache : CachedImageData) { }
	
	get width() : number {
		return this.cache.data.width; }
	get height() : number {
		return this.cache.data.height; }
	
	get size() : Hector {
		return new Hector(this.cache.data.width, this.cache.data.height); }

	renderOnContext(ctx : CanvasRenderingContext2D,
		origin : Hector = new Hector(0, 0)) {
		ctx.drawImage(this.cache.element, origin.x, origin.y); }

}

class PackerImageStripped extends PackerImage {
	public content_size : Hector;
	public content_origin : Hector;
	
	constructor(cache : CachedImageData) {
		super(cache); }
	
	get content_center() : Hector {
		return this.content_origin.plus(
			this.content_origin.divide(2.0));
	}
	
	renderOnContext(ctx : CanvasRenderingContext2D,
			origin : Hector = new Hector(0, 0)) {
		ctx.drawImage(this.cache.element,
			this.content_origin.x, this.content_origin.y,
			this.content_size.x, this.content_size.y,
			origin.x, origin.y,
			this.content_size.x, this.content_size.y);
	}
}

class CachedImageData {
	element : HTMLImageElement;
	data : ImageData;
	
	get width() {
		return this.data.width; }
	get height() {
		return this.data.height; }
	
	constructor(src : ImageData | HTMLImageElement) {
		if (src instanceof ImageData) {
			this.data = src;
			this.element = createElementFromImageData(this.data);
		} else if (src instanceof HTMLImageElement) {
			this.element = src;
			this.data = createImageDataFromElement(this.element);
		}
	}
}

function createImageDataFromElement(element : HTMLImageElement) : ImageData {
	var tmp_canvas : HTMLCanvasElement = document.createElement('canvas');
	tmp_canvas.width = element.width;
	tmp_canvas.height = element.height;

	var ctx = tmp_canvas.getContext("2d");
	ctx.drawImage(element, 0, 0);
	return ctx.getImageData(0, 0, element.width, element.height);
}

function createElementFromImageData(data : ImageData) : HTMLImageElement {
	var tmp_canvas : HTMLCanvasElement = document.createElement('canvas');
	tmp_canvas.width = data.width;
	tmp_canvas.height = data.height;
	var ctx = tmp_canvas.getContext("2d");
	ctx.putImageData(data, 0, 0);
	
	var img = document.createElement('img');
	img.src = tmp_canvas.toDataURL('image/png');
	return img;
}

// stackoverflow.com/questions/12175991/crop-image-white-space-automatically-using-jquery
function cropImage(cache : CachedImageData, callback : (image : PackerImageStripped) => any) {
	
	var data = cache.data;
	function scanX(left : boolean) : number {
		var offset = left ? 1 : -1;
		for (var x = left ? 0 : (data.width - 1);
			left ? (x < data.width) : (x > -1); x += offset) {
			for (var y = 0; y < data.height; y++) {
				if (data.data[(y * data.width + x) * 4 + 3] > 0) {
					return x; }
			}
		}
	}
	function scanY(top : boolean) : number {
		var offset = top ? 1 : -1;
		for (var y = top ? 0 : (data.height - 1);
			top ? (y < data.height) : (y > -1); y += offset) {
			for (var x = 0; x < data.width; x++) {
				if (data.data[(y * data.width + x) * 4 + 3] > 0) {
					return y; }
			}
		}
	}
	
	var top = scanY(true), bottom = scanY(false),
		left = scanX(true), right = scanX(false);

	console.log(`Top: ${top}, Bottom: ${bottom}, Left: ${left}, Right: ${right}`);	
	
	var sizeX = right - left, sizeY = bottom - top;
	
	var ret = new PackerImageStripped(cache);
	ret.content_origin = new Hector(left, top);
	ret.content_size = new Hector(sizeX, sizeY);
	
	callback(ret);
}

// function renderImage(src) {
// 	var image = new Image();
// 	image.onload = function () {
// 		var canvas = <HTMLCanvasElement>document.getElementById('center-canvas');
// 		var ctx : CanvasRenderingContext2D = canvas.getContext("2d");
// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
// 		ctx.drawImage(image, 0, 0, image.width, image.height);
		
// 		currentImage = new CachedImageData(image);
// 	}
// 	image.src = src;
// }


// var currentImage : CachedImageData = undefined;

// var target = document.getElementsByTagName('body')[0];
// target.addEventListener('dragover', function (e) {
// 	e.preventDefault() }, true);
// target.addEventListener('drop', function (e) {
// 	e.preventDefault();
// 	var img = e.dataTransfer.files[0];
// 	if (!img.type.match(/image.*/)) {
// 		return; }
// 	var reader = new FileReader();
// 	reader.onload = function (e) {
// 		renderImage(e.target.result); };
// 	reader.readAsDataURL(img);
// });

// function testCrop() {	
// 	cropImage(currentImage, function (img) {
// 		var canvas = <HTMLCanvasElement>document.getElementById('center-canvas')
// 		canvas.width = img.content_size.x; canvas.height = img.content_size.y;
// 		var ctx_t : CanvasRenderingContext2D = canvas.getContext('2d');
// 		ctx_t.clearRect(0, 0, canvas.width, canvas.height);
// 		img.renderOnContext(ctx_t);
// 	});
// }

