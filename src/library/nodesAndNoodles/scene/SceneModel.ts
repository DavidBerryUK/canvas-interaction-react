import { ConsoleFormatter as CF } from '../../utilities/ConsoleFormatter';
import ConnectionNoodleModel from './ConnectionNoodleModel';
import EnumNode from '../enums/EnumNodes';
import EnumSocketFlowDirection from '../enums/EnumSocketFlowDirection';
import EnumSocketPlacement from '../enums/EnumSocketPlacement';
import NodeGroupModel from './NodeGroupModel';
import NodeModel from './NodeModel';
import PulseModel from './PulseModel';
import Point from '../../geometry/Point';
import NodeRenderer from '../renderers/NodeRenderer';

export default class SceneModel {
	nodes: Array<NodeModel> = new Array<NodeModel>();
	nodeGroups: Array<NodeGroupModel> = new Array<NodeGroupModel>();
	connections: Array<ConnectionNoodleModel> = new Array<ConnectionNoodleModel>();

	addNode(node: NodeModel): SceneModel {
		this.nodes.push(node);
		return this;
	}

	/**
	 * Organises all node groups into a 2D structure by column and row.
	 *
	 * - Outer array index represents the column position (sorted ascending).
	 * - Inner arrays contain the node groups for that column,
	 *   sorted ascending by their row number.
	 *
	 * Example:
	 *   nodeGroups = [
	 *     { column: 1, row: 2 },
	 *     { column: 0, row: 1 },
	 *     { column: 1, row: 1 },
	 *     { column: 0, row: 0 }
	 *   ]
	 *
	 *   get nodeGroupsByColumnAndRow() returns:
	 *   [
	 *     [ { column: 0, row: 0 }, { column: 0, row: 1 } ],
	 *     [ { column: 1, row: 1 }, { column: 1, row: 2 } ]
	 *   ]
	 */
	get nodeGroupsByColumnAndRow(): NodeGroupModel[][] {
		// Step 1: Group node groups by their column index
		const columns: Record<number, NodeGroupModel[]> = {};

		for (const group of this.nodeGroups) {
			const col = group.column ?? 0;
			if (!columns[col]) {
				columns[col] = [];
			}
			columns[col].push(group);
		}

		// Step 2: Sort columns numerically and then sort the groups in each column by row
		const result: NodeGroupModel[][] = Object.keys(columns)
			.map((c) => parseInt(c, 10))
			.sort((a, b) => a - b) // ensure columns are ordered left-to-right
			.map(
				(col) => columns[col].sort((a, b) => (a.row ?? 0) - (b.row ?? 0)) // order rows top-to-bottom
			);

		return result;
	}

	addNodeGroup(nodeGroup: NodeGroupModel): SceneModel {
		// find all groups in the same column
		const groupsInColumn = this.nodeGroups.filter((group) => group.column === nodeGroup.column);

		if (groupsInColumn.length > 0) {
			// get max row in this column
			const maxRow = Math.max(...groupsInColumn.map((g) => g.row ?? 1));
			nodeGroup.setRow(maxRow + 1); // next row
		} else {
			nodeGroup.setRow(1); // first row
		}

		this.nodeGroups.push(nodeGroup);

		// add child nodes
		for (const node of nodeGroup.nodes) {
			this.addNode(node);
		}

		return this;
	}

	addConnection(nodeA: NodeModel, nodeB: NodeModel): SceneModel {
		const noodle = new ConnectionNoodleModel(nodeA, nodeB);
		this.connections.push(noodle);

		nodeA.addSocket(EnumSocketFlowDirection.output, noodle);
		nodeB.addSocket(EnumSocketFlowDirection.input, noodle);

		return this;
	}

	addPulse(fromNodeId: EnumNode, toNodeId: EnumNode) {
		const connection = this.connections.find((connection) => connection.from.id === fromNodeId && connection.to.id === toNodeId);

		if (!connection) {
			console.error(`Connection not found for pulse: ${fromNodeId} -> ${toNodeId}`);
			return;
		}

		const pointFrom = new Point(connection.from.rectangle.right, connection.from.rectangle.centerY);
		const pointTo = new Point(connection.to.rectangle.left, connection.to.rectangle.centerY);
		const pulse = new PulseModel(pointFrom, pointTo);
		connection.pulses.push(pulse);
	}

	draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		// clear

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// draw nodes

		this.nodes.forEach((node) => {
			NodeRenderer.render(ctx, node);
		});

		// draw connections and pluses

		this.connections.forEach((connection) => {
			connection.draw(ctx);
		});
	}

	toDebugConsole() {
		CF.clear();

		CF.header('SceneModel');

		this.nodeGroups.forEach((group) => {
			CF.subHeader(`Node Group:${group.name}`);
			CF.data(['Column', group.column], ['Row', group.row], ['Node Count', group.nodes.length], ['rectangle', group.rectangle.toString()]);

			CF.group('Nodes', () => {
				group.nodes.forEach((node) => {
					CF.data(['id', node.id], ['label', node.label], ['rectangle', node.rectangle.toString()], ['Sockets Left', node.socketCount(EnumSocketPlacement.left)], ['Sockets Right', node.socketCount(EnumSocketPlacement.right)]);
				});
			});
		});

		// Example for connections:
		// CF.subHeader('Connections:');
		// CF.group('Connections', () => {
		//   this.connections.forEach(c => {
		//     CF.custom(`${c.from.id} → ${c.to.id}`, 'color: teal; font-weight: bold;');
		//   });
		// });
	}
}
