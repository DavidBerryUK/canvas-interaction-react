import ConnectionNoodleModel from './ConnectionNoodleModel';
import EnumSocketFlowDirection from '../enums/EnumSocketFlowDirection';
import EnumSocketPlacement from '../enums/EnumSocketPlacement';
import NodeModel from './NodeModel';
import Point from '../../geometry/Point';

/**
 * Belongs to a node and details the point where
 * a Connection Noodle is joined onto the node
 * for rendering purposes
 */
export default class ConnectionSocketModel {
	node: NodeModel;
	connectionNoodle: ConnectionNoodleModel;
	point: Point;
	flow: EnumSocketFlowDirection;
	placement: EnumSocketPlacement;

	constructor(node: NodeModel, connectionNoodle: ConnectionNoodleModel, direction: EnumSocketFlowDirection) {
		this.node = node;
		this.connectionNoodle = connectionNoodle;
		this.point = Point.zero;
		this.flow = direction;
		this.placement = EnumSocketPlacement.unknown;
	}
}
