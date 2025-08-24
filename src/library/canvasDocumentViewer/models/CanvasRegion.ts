import type Rectangle from '../../geometry/Rectangle';

/**
 *  regions represent specific areas of interest (e.g., sections,
 * annotations, or highlights) that the user can navigate to or interact with
 * in the `UICanvasDocumentViewer`.
 */
export default class CanvasRegion {
	id: string;
	name: string;
	rectangle: Rectangle;

	constructor(id: string, name: string, rectangle: Rectangle) {
		this.id = id;
		this.name = name;
		this.rectangle = rectangle;
	}
}
