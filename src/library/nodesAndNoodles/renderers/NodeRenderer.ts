import type NodeModel from '../scene/NodeModel';

export default class NodeRenderer {
	static render(ctx: CanvasRenderingContext2D, node: NodeModel) {
		ctx.fillStyle = '#ddd';
		ctx.fillRect(node.rectangle.left, node.rectangle.top, node.rectangle.width, node.rectangle.height);
		ctx.fillStyle = '#000';
		ctx.font = '16px sans-serif';
		ctx.fillText(node.label, node.rectangle.left + 10, node.rectangle.top + node.rectangle.heightHalf + 5);
	}
}
