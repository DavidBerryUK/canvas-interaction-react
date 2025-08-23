import { EnumShapeDrawStyle, EnumShapeType } from './DemoEnums';
import DemoShape from './DemoShape';
import Point from '../../models/geometry/Point';
import Rectangle from '../../models/geometry/Rectangle';
import Size from '../../models/geometry/Size';
import type ICanvasDocumentViewerSceneProvider from '../../components/canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';

export default class DemoSceneProvider implements ICanvasDocumentViewerSceneProvider {
	private shapes: DemoShape[] = [];
	private boundingRect?: Rectangle = undefined;

	constructor() {
		this.createDemoShapes();
	}

	getBoundingRect(): Rectangle {
		if (this.boundingRect === undefined) {
			this.boundingRect == (this.boundingRect = this.calculateAndCacheBoundingRect());
		}
		return this.boundingRect!;
	}
	private lastRenderLog = 0; // timestamp of last log in ms

	render(ctx: CanvasRenderingContext2D, region: Rectangle): void {
		let total = this.shapes.length;
		let rendered = 0;
		let offScreen = 0;

		this.shapes.forEach((shape) => {
			if (region.intersects(shape.rectangle)) {
				shape.draw(ctx);
				rendered++;
			} else {
				offScreen++;
			}
		});

		// const now = performance.now();
		// if (now - this.lastRenderLog > 1000) {
		// 	// log at most once per second
		// 	console.log(`DemoSceneProvider: Total=${total}, Rendered=${rendered}, Off-screen=${offScreen}`);
		// 	this.lastRenderLog = now;
		// }
	}

	private createDemoShapes() {
		const width = Math.floor(Math.random() * 2000) + 200;
		const height = Math.floor(Math.random() * 2000) + 200;
		const numShapes = Math.floor(Math.random() * 2000) + 10;

		for (let i = 0; i < numShapes; i++) {
			const w = Math.floor(30 + Math.random() * 150);
			const h = Math.floor(30 + Math.random() * 150);

			// pick a center uniformly in [-width/2, width/2] and [-height/2, height/2]
			const x = Math.floor(Math.random() * (width - w)) - (width - w) / 2;
			const y = Math.floor(Math.random() * (height - h)) - (height - h) / 2;

			const rect = new Rectangle(new Point(x, y), new Size(w, h));

			const type = Math.floor((Math.random() * Object.keys(EnumShapeType).length) / 2);
			const fillColor = Math.floor(Math.random() * 5);
			const style = Math.floor(Math.random() * 3) as EnumShapeDrawStyle;
			const strokeColor =
				style === EnumShapeDrawStyle.Stroke || style === EnumShapeDrawStyle.FillAndStroke ? Math.floor(Math.random() * 5) : undefined;

			this.shapes.push(new DemoShape(rect, type, fillColor, style, strokeColor));
		}
	}

	private calculateAndCacheBoundingRect(): Rectangle {
		if (this.shapes.length === 0) return Rectangle.zero;

		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;
		this.shapes.forEach((s) => {
			minX = Math.min(minX, s.rectangle.x);
			minY = Math.min(minY, s.rectangle.y);
			maxX = Math.max(maxX, s.rectangle.x + s.rectangle.width);
			maxY = Math.max(maxY, s.rectangle.y + s.rectangle.height);
		});
		return new Rectangle(new Point(minX, minY), new Size(maxX - minX, maxY - minY));
	}
}
