import type ICanvasDocumentViewerSceneProvider from '../../canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvasRegion from '../../canvasDocumentViewer/models/CanvasRegion';
import Rectangle from '../../geometry/Rectangle';
import type SceneModel from '../scene/SceneModel';
import NodeRenderer from './NodeRenderer';

export default class NodesAndNoodlesSceneRenderer implements ICanvasDocumentViewerSceneProvider {
	private boundingRect?: Rectangle = undefined;
	private scene: SceneModel;

	constructor(scene: SceneModel) {
		this.scene = scene;
		this.boundingRect = this.calculateAndCacheBoundingRect();
	}

	get name(): string {
		return `Nodes and Noodles  size:${this.getBoundingRect().toString()}`;
	}

	getBoundingRect(): Rectangle {
		if (this.boundingRect === undefined) {
			this.boundingRect == (this.boundingRect = this.calculateAndCacheBoundingRect());
		}
		return this.boundingRect!;
	}

	render(ctx: CanvasRenderingContext2D, region: Rectangle): void {
		//
		// Render nodes
		//
		this.scene.nodes.forEach((node) => {
			if (node.rectangle.intersects(region)) {
				NodeRenderer.render(ctx, node);
			}
		});
	}

	private calculateAndCacheBoundingRect(): Rectangle {
		var allNodeRects = this.scene.nodes.map((node) => node.rectangle);
		var boundingRectangle = Rectangle.createEncapsulatingRectangle(allNodeRects);
		return boundingRectangle;
	}

	getRegions(): Array<CanvasRegion> {
		return new Array<CanvasRegion>();
	}
}
