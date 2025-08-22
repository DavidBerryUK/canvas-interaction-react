import { EnumShapeDrawStyle, EnumShapeType } from './DemoEnums';
import DemoShape from './DemoShape';
import Point from '../../models/geometry/Point';
import Rectangle from '../../models/geometry/Rectangle';
import Size from '../../models/geometry/Size';
import type ISceneProvider from '../../components/canvas/interfaces/ISceneProvider';

export default class DemoSceneProvider implements ISceneProvider {
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

		const now = performance.now();
		if (now - this.lastRenderLog > 1000) {
			// log at most once per second
			console.log(`DemoSceneProvider: Total=${total}, Rendered=${rendered}, Off-screen=${offScreen}`);
			this.lastRenderLog = now;
		}
	}

	private createDemoShapes() {
		const randomStep = (min: number, max: number, step: number) => {
			const count = Math.floor((max - min) / step) + 1;
			return min + step * Math.floor(Math.random() * count);
		};

		const width = randomStep(50, 2000, 50);
		const height = randomStep(50, 2000, 50);
		const numShapes = randomStep(10, 1000, 10);

		for (let i = 0; i < numShapes; i++) {
			const w = 30 + Math.random() * 70;
			const h = 30 + Math.random() * 70;
			const x = Math.random() * (width - w);
			const y = Math.random() * (height - h);
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
