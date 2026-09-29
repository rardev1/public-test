/**
 * Renderer class handles the core pixel rendering logic for the mountain scene
 */
export class Renderer {
  /**
   * Creates a new renderer instance
   * @param {Object} options - Renderer options
   * @param {number} [options.width=128] - Canvas width in pixels
   * @param {number} [options.height=128] - Canvas height in pixels
   */
  constructor({ width = 128, height = 128 } = {}) {
    this.width = width;
    this.height = height;
    this.clear();
  }

  /**
   * Checks if given coordinates are within canvas bounds
   * @param {Object} coord - Coordinate object
   * @param {number} coord.x - X position
   * @param {number} coord.y - Y position
   * @returns {boolean} Whether coordinates are valid
   */
  isValidCoordinate(coord) {
    return (
      coord.x >= 0 &&
      coord.x < this.width &&
      coord.y >= 0 &&
      coord.y < this.height
    );
  }

  /**
   * Renders a single object onto the bitmap
   * @param {Object} pixelObject - Object to render
   * @param {number} time - Current animation time
   */
  renderObject(pixelObject, time = 0) {
    // Get pixels, either static or animated
    const pixels = pixelObject.animate
      ? pixelObject.animate(time, pixelObject.pixels)
      : pixelObject.pixels;

    // Render each pixel accounting for object position
    pixels.forEach((pixel) => {
      const absoluteX = Math.floor(pixelObject.position.x + pixel.position.x);
      const absoluteY = Math.floor(pixelObject.position.y + pixel.position.y);

      if (this.isValidCoordinate({ x: absoluteX, y: absoluteY })) {
        this.bitmap[absoluteY][absoluteX] = pixel.color;
      }
    });
  }

  /**
   * Renders all objects in the scene
   * @param {Array} objects - Array of objects to render
   * @param {number} time - Current animation time
   * @returns {Array<Array<string|null>>} The rendered bitmap
   */
  render(objects, time = 0) {
    this.clear();
    objects.forEach((obj) => this.renderObject(obj, time));
    return this.bitmap;
  }

  /**
   * Returns the current state of the bitmap
   * @returns {Array<Array<string|null>>} The current bitmap
   */
  getBitmap() {
    return this.bitmap;
  }

  /**
   * Clears the bitmap to its initial state
   */
  clear() {
    this.bitmap = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(null));
  }
}
