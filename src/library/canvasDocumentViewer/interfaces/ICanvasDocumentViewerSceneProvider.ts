import type Rectangle from '../../../library/geometry/Rectangle';
import CanvasRegion from '../models/CanvasRegion';

/**
 * Provides a scene definition for the `UICanvasDocumentViewer` component.
 *
 * Implementations of this interface supply the document's dimensions
 * and handle rendering logic within the viewer's canvas context.
 */
export default interface ICanvasDocumentViewerSceneProvider {
	/**
	 * The scene name
	 */
	name: string;

	/**
	 * Returns the bounding rectangle of the document.
	 *
	 * This method is invoked by the `UICanvasDocumentViewer` to determine
	 * the full size of the document that will be displayed.
	 *
	 * @returns A {@link Rectangle} representing the document boundaries.
	 */
	getBoundingRect(): Rectangle;

	/**
	 * Renders the scene within the provided canvas context.
	 *
	 * This method is called by the `UICanvasDocumentViewer` whenever the scene
	 * should be drawn. The viewer automatically applies scaling, offsets, and
	 * background grid rendering. Implementations only need to render custom
	 * elements within the specified region.
	 *
	 * @param ctx - The 2D rendering context of the canvas.
	 * @param region - The visible region of the document to render.
	 *                 Elements outside this area should not be drawn.
	 */
	render(ctx: CanvasRenderingContext2D, region: Rectangle): void;

	/**
	 * Returns a collection of predefined regions within the document.
	 *
	 * These regions represent specific areas of interest (e.g., sections,
	 * annotations, or highlights) that the user can navigate to or interact with
	 * in the `UICanvasDocumentViewer`.
	 *
	 * @returns An array of {@link CanvasRegion} objects describing
	 *          the navigable regions of the document.
	 */
	getRegions(): Array<CanvasRegion>;
}
