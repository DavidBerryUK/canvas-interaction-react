import type Rectangle from '../../../models/geometry/Rectangle';

export default interface ISceneProvider {
	getBoundingRect(): Rectangle;
	render(ctx: CanvasRenderingContext2D, region: Rectangle): void;
}
