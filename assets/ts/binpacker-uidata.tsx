
import { Rectangle } from './binpacker';
import { PackerImageStripped } from './binpacker-index';

export class HPackerFolder {
    constructor(public name: string) { }
    images: HPackerImageData[] = [ ];
    get length () { return this.images.length; }
}

export class HPackerImageData {
	constructor(public image : PackerImageStripped,
		public name : string) { }
	packedrect : Rectangle;
	flipped : boolean = false;
}