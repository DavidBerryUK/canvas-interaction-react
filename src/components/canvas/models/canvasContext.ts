import PointModel from '../../../models/geometry/PointModel';

export default class CanvanContext {
	scale = 1;
	targetScale = 1;
	isDragging = false;
	lastDist = 0;
	offset: PointModel = PointModel.zero;
	target: PointModel = PointModel.zero;
	last: PointModel = PointModel.zero;
	lastMouse: PointModel = PointModel.zero;
	pinchMid: PointModel = PointModel.zero;

	minX = Infinity;
	minY = Infinity;
	maxX = -Infinity;
	maxY = -Infinity;
}
