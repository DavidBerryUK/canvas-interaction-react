import ConnectionNoodleModel from './ConnectionNoodleModel';
import ConnectionSocketModel from './ConnectionSocketModel';
import EnumNode from '../enums/EnumNodes';
import EnumSocketFlowDirection from '../enums/EnumSocketFlowDirection';
import EnumSocketPlacement from '../enums/EnumSocketPlacement';
import NodeGroupModel from './NodeGroupModel';
import Rectangle from '../../geometry/Rectangle';

export default class NodeModel {
	id: EnumNode;
	label: string;
	rectangle: Rectangle;
	group: NodeGroupModel | undefined;
	connectionSockets: Array<ConnectionSocketModel>;
	rowNo: number = 0; // row number within a node group

	constructor(id: EnumNode, label: string, rectangle?: Rectangle) {
		this.id = id;
		this.label = label;
		this.rectangle = rectangle ?? Rectangle.zero;
		this.connectionSockets = new Array<ConnectionSocketModel>();
	}

	setGroup(value: NodeGroupModel) {
		this.group = value;
	}

	addSocket(direction: EnumSocketFlowDirection, noodle: ConnectionNoodleModel) {
		const socket = new ConnectionSocketModel(this, noodle, direction);
		this.connectionSockets.push(socket);
	}

	getSockets(placement?: EnumSocketPlacement) {
		return this.connectionSockets.filter((socket) => socket.placement === placement);
	}
	socketCount(placement?: EnumSocketPlacement): number {
		if (placement) {
			return this.getSockets(placement).length;
		}
		return this.connectionSockets.length;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#ddd';
		ctx.fillRect(this.rectangle.left, this.rectangle.top, this.rectangle.width, this.rectangle.height);
		ctx.fillStyle = '#000';
		ctx.font = '16px sans-serif';
		ctx.fillText(this.label, this.rectangle.left + 10, this.rectangle.top + this.rectangle.heightHalf + 5);
	}
}
