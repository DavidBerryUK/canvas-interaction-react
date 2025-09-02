import ConnectionSocketModel from './ConnectionSocketModel';
import EnumNode from '../enums/EnumNodes';
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

	addSocket(socket: ConnectionSocketModel) {
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
}
