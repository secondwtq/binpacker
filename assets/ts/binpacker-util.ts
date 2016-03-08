
namespace Utility {

export function canvasContextStoreCall(ctx : CanvasRenderingContext2D, 
		func : (ctx : CanvasRenderingContext2D) => void) {
	ctx.save();
	func(ctx);
	ctx.restore();
}

export function canvasStoreAndClearCall(element : HTMLCanvasElement, 
		func : (ctx : CanvasRenderingContext2D) => void) {
	var canvas = <HTMLCanvasElement>element;
	var ctx : CanvasRenderingContext2D = element.getContext('2d');
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	func(ctx);
	ctx.restore();
}

// stackoverflow.com/questions/2677671/how-do-i-rotate-a-single-object-on-an-html-5-canvas
export function canvasDrawImageRotated(ctx : CanvasRenderingContext2D, img,
		ix : number, iy : number, iw : number, ih : number, 
		x : number, y : number, width : number, height : number, rad : number){
	ctx.translate(x + width / 2, y + height / 2);
	ctx.rotate(rad);
	ctx.drawImage(img, ix, iy, iw, ih, -width / 2, -height / 2, width, height);
	ctx.rotate(-rad);
    ctx.translate(-(x + width / 2), -(y + height / 2));
}

export function mToRad(val : number) {
	return val * Math.PI / 180; }
    
}

export default Utility;
