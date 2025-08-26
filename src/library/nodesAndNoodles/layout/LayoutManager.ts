import AppConst from '../../../configurations/AppConst';
import EnumNode from '../enums/EnumNodes';
import EnumSocketPlacement from '../enums/EnumSocketPlacement';
import Point from '../../geometry/Point';
import Rectangle from '../../geometry/Rectangle';
import Size from '../../geometry/Size';
import type SceneModel from '../scene/SceneModel';

export default class LayoutManager {
	static layout(scene: SceneModel) {
		// calculation of positions are relative until placement do sockets are done,
		// this then determines size of nodes, and then nodes within node groups

		this.calculateSocketPlacements(scene); // this works
		this.calculateNodeSize(scene); // this works
		this.calculateSocketPositions(scene); // ??
		this.calculateNodeGroupPositions(scene); // this works
		this.calculateNodePositions(scene); // this works

		// after relative positions and sizes have been made, then
		// are converted to absolute coordinates for speed of rendering
		// this.convertRelativePositionsToAbsolute(scene);
	}

	private static calculateNodePositions(scene: SceneModel) {
		scene.nodeGroups.forEach((nodeGroup) => {
			let y = nodeGroup.rectangle.y;
			nodeGroup.nodes.forEach((node) => {
				if (node.group === undefined) {
					throw `Node ${EnumNode[node.id]} must be in a group`;
				}

				const group = node.group;
				const x = group.rectangle.x + group.rectangle.x;

				node.rectangle = node.rectangle.cloneWithOrigin(new Point(x, y));
				y = y + node.rectangle.height;
			});
		});
	}

	private static calculateNodeGroupPositions(scene: SceneModel) {
		const sortedGroups = scene.nodeGroupsByColumnAndRow;

		sortedGroups.forEach((columnGroup) => {
			let y = 0;
			columnGroup.forEach((nodeGroup) => {
				const colNo = nodeGroup.column ?? 0;
				const x = (colNo - 1) * AppConst.node.width;
				let height = 0;
				nodeGroup.nodes.forEach((node) => {
					height = height + node.rectangle.height + AppConst.nodeGroup.spacingBottom;
				});
				nodeGroup.rectangle = new Rectangle(new Point(x, y), new Size(AppConst.node.width, height));
				y = y + height;
			});
		});
	}

	private static calculateNodeSize(scene: SceneModel) {
		scene.nodes.forEach((node) => {
			const left = node.getSockets(EnumSocketPlacement.left);
			const right = node.getSockets(EnumSocketPlacement.right);
			const maxCount = Math.max(left.length, right.length);

			let height = AppConst.node.headerHeight + AppConst.node.footerHeight + maxCount * AppConst.socket.radius * 2;
			if (maxCount > 1) {
				height = height + AppConst.socket.spacing * (maxCount - 1);
			}

			node.rectangle = node.rectangle.cloneWithSize(new Size(AppConst.node.width, height));
		});
	}

	private static calculateSocketPositions(scene: SceneModel) {
		scene.nodes.forEach((node) => {
			const left = node.getSockets(EnumSocketPlacement.left);
			const right = node.getSockets(EnumSocketPlacement.right);
			const maxCount = Math.max(left.length, right.length);

			if (maxCount === 0) {
				return;
			}

			const leftX = node.rectangle.left + AppConst.socket.inset;
			const rightY = node.rectangle.right - AppConst.socket.inset;

			let y = 0;
			left.forEach((socket) => {
				socket.point = new Point(leftX, y);
				y = y + AppConst.socket.spacing;
			});

			y = 0;
			right.forEach((socket) => {
				socket.point = new Point(rightY, y);
				y = y + AppConst.socket.spacing;
			});
		});
	}

	/**
	 * determine if sockets connectors are on left or right
	 */
	private static calculateSocketPlacements(scene: SceneModel) {
		scene.nodes.forEach((node) => {
			node.connectionSockets.forEach((socket) => {
				const otherNode = socket.connectionNoodle.otherNode(node);
				const nodeColumn = node.group?.column;
				const otherNodeColumn = otherNode.group?.column;

				if (nodeColumn === undefined) {
					throw `Node ${EnumNode[node.id]} must be in a group with a defined column`;
				}

				if (otherNodeColumn === undefined) {
					throw `Node ${EnumNode[otherNode.id]} must be in a group with a defined column`;
				}

				if (nodeColumn < otherNodeColumn) {
					socket.placement = EnumSocketPlacement.right;
				} else {
					socket.placement = EnumSocketPlacement.left;
				}
			});
		});
	}
}
