import Rectangle from '../../geometry/Rectangle';
import NodeModel from './NodeModel';

export default class NodeGroupModel {
	name: string;
	column: number | undefined;
	row: number | undefined;
	nodes: Array<NodeModel> = new Array<NodeModel>();
	rectangle: Rectangle = Rectangle.zero;

	constructor(name: string) {
		this.name = name;
	}

	get maxRowNo(): number {
		return this.nodes.length > 0 ? Math.max(...this.nodes.map((n) => n.rowNo ?? 0)) : 0;
	}

	add(node: NodeModel): NodeGroupModel {
		// set row number

		node.rowNo = this.maxRowNo + 1;

		node.setGroup(this);
		this.nodes.push(node);
		return this;
	}

	setRow(value: number): NodeGroupModel {
		this.row = value;
		return this;
	}

	setColumn(value: number): NodeGroupModel {
		this.column = value;
		return this;
	}
}
