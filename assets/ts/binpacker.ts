
"use strict";

import Hector from './hector';

export class Rectangle {
	position : Hector = new Hector();
	size : Hector = new Hector();
	
	area() : number {
		return this.size.x * this.size.y; }
		
	toString() : string {
		return `Rectangle: ${this.position.toString()}, ${this.size.toString()}`; }
}

export interface RectangleBinPackerI {
	
	init(size : Hector);
	insertSingle(size : Hector) : Rectangle;
	occupancy() : number;
	
}

class NodeSkyline {
	x : number;
	y : number;
	width : number;
	
	static create(x : number = 0,
			y : number = 0, width : number = 0) {
		var ret = new NodeSkyline();
		ret.x = x, ret.y = y, ret.width = width;
		return ret;
	}
}

class ResultSkylineFindPosition {
	rect : Rectangle;
	size : Hector;
	index : number; 
}

export class RectangleBinPackerSkyline implements RectangleBinPackerI {
	
	constructor(public size : Hector) {
		this.init(size); }
	
	init(size : Hector) {
		this.size = size.clone();
		this.skylines = new Array<NodeSkyline>();
		this.skylines.push(NodeSkyline.create(0, 0, this.size.x));
	}
	
	private skylines : NodeSkyline[] = new Array<NodeSkyline>();
	private used_area : number = 0;
	
	insertSingle(size : Hector) : Rectangle {
		return this.insertSingleBottomLeft(size); }
	
	insertSingleBottomLeft(size : Hector) : Rectangle {
		var node = this.findNewPositionBottomLeft(size);
		if (node.index != -1) {
			this.addSkylineLevel(node.index, node.rect);
			this.used_area += node.rect.area();
			console.log(`insertSingleBottomLeft: ${node.rect.toString()}.`);
			return node.rect;
		}
		
		console.log(`Unable to insertSingleBottomLeft for ${size.toString()}!`);
		return undefined;
	}
	
	occupancy() : number {
		return this.used_area / (this.size.x * this.size.y); }
	
	private rectangleFits(nodeidx : number, size : Hector) : { fits : boolean, y : number } {
		var x = this.skylines[nodeidx].x;
		if (x + size.x > this.size.x) {
			return { fits: false, y: undefined }; }
		var width_left = size.x;
		var i = nodeidx;
		var y = this.skylines[nodeidx].y;
		while (width_left > 0) {
			y = Math.max(y, this.skylines[i].y);
			if (y + size.y > this.size.y) {
				return { fits: false, y: undefined }; }
			width_left -= this.skylines[i].width;
			i++;
		}
		return { fits: true, y: y };
	}
	
	private addSkylineLevel(nodeidx : number, rect : Rectangle) {
		var node = NodeSkyline.create(rect.position.x,
			rect.position.y + rect.size.y, rect.size.x);
		
		this.skylines.splice(nodeidx, 0, node);
		
		for (var i = nodeidx + 1; i < this.skylines.length; i++) {
			if (this.skylines[i].x < this.skylines[i-1].x + this.skylines[i-1].width) {
				var shrink = this.skylines[i-1].x + this.skylines[i-1].width - this.skylines[i].x;
				
				this.skylines[i].x += shrink;
				this.skylines[i].width -= shrink;
				if (this.skylines[i].width <= 0) {
					this.skylines.splice(i, 1);
					i--;
				} else { break; }
			} else { break; }
		}
		this.mergeSkylines();
	}
	
	private mergeSkylines() {
		for (var i = 0; i < this.skylines.length - 1; i++) {
			if (this.skylines[i].y == this.skylines[i+1].y) {
				this.skylines[i].width += this.skylines[i+1].width;
				this.skylines.splice(i+1, 1);
				i--;
			}
		}
	}
	
	private findNewPositionBottomLeft(size : Hector) : ResultSkylineFindPosition {
		var bestsize = new Hector(0xFFFF, 0xFFFF);
		var bestidx = -1;
		var node = new Rectangle();
		
		for (var i = 0; i < this.skylines.length; i++) {
			var t = this.rectangleFits(i, size);
			if (t.fits) {
				if ((t.y + size.y < bestsize.y) ||
						(t.y + size.y == bestsize.y &&
						this.skylines[i].width < bestsize.x)) {
					bestsize = new Hector(this.skylines[i].width, t.y + size.y);
					bestidx = i;
					node.position = new Hector(this.skylines[i].x, t.y);
					node.size = size.clone();
				}
			}
			if ((t = this.rectangleFits(i, size.flip())).fits) {
				if ((t.y + size.x < bestsize.y) ||
						(t.y + size.x == bestsize.x &&
						this.skylines[i].width < bestsize.x)) {
					bestsize = new Hector(this.skylines[i].width, t.y + size.x);
					bestidx = i;
					node.position = new Hector(this.skylines[i].x, t.y);
					node.size = size.flip();
				}
			}
		}

		return { rect : node, size : bestsize,
			index : bestidx == -1 ? -1 : bestidx
		};
	}
	
}
