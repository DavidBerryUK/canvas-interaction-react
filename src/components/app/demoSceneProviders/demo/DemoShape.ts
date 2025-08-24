import type Rectangle from '../../../../library/geometry/Rectangle';
import { EnumShapeColor, EnumShapeDrawStyle, EnumShapeType } from './DemoEnums';

export default class EnumDemoShape {
	rectangle: Rectangle;
	type: EnumShapeType;
	fillColor: EnumShapeColor;
	strokeColor?: EnumShapeColor;
	style: EnumShapeDrawStyle;

	constructor(
		rectangle: Rectangle,
		type: EnumShapeType,
		fillColor: EnumShapeColor,
		style: EnumShapeDrawStyle = EnumShapeDrawStyle.Fill,
		strokeColor?: EnumShapeColor
	) {
		this.rectangle = rectangle;
		this.type = type;
		this.fillColor = fillColor;
		this.style = style;
		this.strokeColor = strokeColor;
	}

	draw(ctx: CanvasRenderingContext2D) {
		const fill = this.style === EnumShapeDrawStyle.Fill || this.style === EnumShapeDrawStyle.FillAndStroke;
		const stroke = this.style === EnumShapeDrawStyle.Stroke || this.style === EnumShapeDrawStyle.FillAndStroke;

		if (fill) ctx.fillStyle = EnumShapeColor[this.fillColor].toLowerCase();
		if (stroke && this.strokeColor !== undefined) ctx.strokeStyle = EnumShapeColor[this.strokeColor].toLowerCase();

		switch (this.type) {
			case EnumShapeType.Circle:
				this.drawCircle(ctx, this.rectangle, fill, stroke);
				break;
			case EnumShapeType.Triangle:
				this.drawTriangle(ctx, this.rectangle, fill, stroke);
				break;
			case EnumShapeType.Diamond:
				this.drawDiamond(ctx, this.rectangle, fill, stroke);
				break;
			case EnumShapeType.Rectangle:
				this.drawRectangle(ctx, this.rectangle, fill, stroke);
				break;
			case EnumShapeType.Pentagon:
				this.drawPolygon(ctx, this.rectangle, 5, fill, stroke);
				break;
			case EnumShapeType.Heptagon:
				this.drawPolygon(ctx, this.rectangle, 7, fill, stroke);
				break;
			case EnumShapeType.Hexagon:
				this.drawPolygon(ctx, this.rectangle, 6, fill, stroke);
				break;
			case EnumShapeType.Octagon:
				this.drawPolygon(ctx, this.rectangle, 8, fill, stroke);
				break;
		}
	}

	private drawRectangle(ctx: CanvasRenderingContext2D, rect: Rectangle, fill: boolean, stroke: boolean) {
		if (fill) ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		if (stroke) ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}

	private drawCircle(ctx: CanvasRenderingContext2D, rect: Rectangle, fill: boolean, stroke: boolean) {
		ctx.beginPath();
		ctx.ellipse(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.abs(rect.width / 2), Math.abs(rect.height / 2), 0, 0, 2 * Math.PI);
		if (fill) ctx.fill();
		if (stroke) ctx.stroke();
	}

	private drawTriangle(ctx: CanvasRenderingContext2D, rect: Rectangle, fill: boolean, stroke: boolean) {
		ctx.beginPath();
		ctx.moveTo(rect.x + rect.width / 2, rect.y);
		ctx.lineTo(rect.x, rect.y + rect.height);
		ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
		ctx.closePath();
		if (fill) ctx.fill();
		if (stroke) ctx.stroke();
	}

	private drawDiamond(ctx: CanvasRenderingContext2D, rect: Rectangle, fill: boolean, stroke: boolean) {
		ctx.beginPath();
		ctx.moveTo(rect.x + rect.width / 2, rect.y);
		ctx.lineTo(rect.x + rect.width, rect.y + rect.height / 2);
		ctx.lineTo(rect.x + rect.width / 2, rect.y + rect.height);
		ctx.lineTo(rect.x, rect.y + rect.height / 2);
		ctx.closePath();
		if (fill) ctx.fill();
		if (stroke) ctx.stroke();
	}

	private drawPolygon(ctx: CanvasRenderingContext2D, rect: Rectangle, sides: number, fill: boolean, stroke: boolean) {
		const cx = rect.x + rect.width / 2;
		const cy = rect.y + rect.height / 2;
		const radius = Math.min(rect.width, rect.height) / 2;
		ctx.beginPath();
		for (let i = 0; i < sides; i++) {
			const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
			const x = cx + radius * Math.cos(angle);
			const y = cy + radius * Math.sin(angle);
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.closePath();
		if (fill) ctx.fill();
		if (stroke) ctx.stroke();
	}
}
