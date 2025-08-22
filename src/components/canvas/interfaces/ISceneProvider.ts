import type Rectangle from '../../../models/geometry/Rectangle';

export default interface IDemoSceneProvider {
	getBoundingRect(): Rectangle;
	render(ctx: CanvasRenderingContext2D, region: Rectangle): void;
}
