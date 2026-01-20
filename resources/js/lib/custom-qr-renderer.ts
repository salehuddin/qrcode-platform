import QRCode from 'qrcode';
import { QRShape, getShapeById } from './qr-shapes';

export interface CustomQROptions {
  data: string;
  size: number;
  bodyShapeId: string;
  eyeFrameShapeId: string;
  eyeBallShapeId: string;
  dotsColor: string;
  backgroundColor: string;
  cornersSquareColor: string;
  cornersDotsColor: string;
  gradient?: {
    enabled: boolean;
    type: 'linear' | 'radial';
    rotation: number;
    startColor: string;
    endColor: string;
  };
  logo?: string;
  logoSize?: number;
}

export class CustomQRRenderer {
  private qrMatrix: number[][];
  private options: CustomQROptions;
  private moduleSize: number;

  constructor(options: CustomQROptions) {
    this.options = options;
    this.qrMatrix = [];
    this.moduleSize = 0;
  }

  /**
   * Generate QR code matrix from data
   */
  private async generateQRMatrix(data: string): Promise<number[][]> {
    try {
      // Use QRCode.create to get the actual QR matrix
      const qr = QRCode.create(data, { errorCorrectionLevel: 'M' });
      
      // qr.modules is the actual QR matrix
      const size = qr.modules.size;
      const matrix: number[][] = [];

      for (let row = 0; row < size; row++) {
        matrix[row] = [];
        for (let col = 0; col < size; col++) {
          // modules.get(row, col) returns true if the module is dark
          matrix[row][col] = qr.modules.get(row, col) ? 1 : 0;
        }
      }

      return matrix;
    } catch (error) {
      throw new Error(`Failed to generate QR matrix: ${error}`);
    }
  }

  /**
   * Check if position is part of any eye region (entire 7x7 corner pattern)
   */
  private isInEyeRegion(row: number, col: number): boolean {
    const size = this.qrMatrix.length;
    
    // Top-left eye (entire 7x7 region)
    if (row < 7 && col < 7) {
      return true;
    }
    
    // Top-right eye (entire 7x7 region)
    if (row < 7 && col >= size - 7) {
      return true;
    }
    
    // Bottom-left eye (entire 7x7 region)
    if (row >= size - 7 && col < 7) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if position is part of eye frame (corner detection pattern)
   */
  private isEyeFrame(row: number, col: number): boolean {
    const size = this.qrMatrix.length;
    
    // Top-left eye
    if (row < 7 && col < 7) {
      return (row === 0 || row === 6 || col === 0 || col === 6);
    }
    
    // Top-right eye
    if (row < 7 && col >= size - 7) {
      return (row === 0 || row === 6 || col === size - 7 || col === size - 1);
    }
    
    // Bottom-left eye
    if (row >= size - 7 && col < 7) {
      return (row === size - 7 || row === size - 1 || col === 0 || col === 6);
    }
    
    return false;
  }

  /**
   * Check if position is part of eye ball (center of corner pattern)
   */
  private isEyeBall(row: number, col: number): boolean {
    const size = this.qrMatrix.length;
    
    // Top-left eye ball
    if (row >= 2 && row <= 4 && col >= 2 && col <= 4) {
      return true;
    }
    
    // Top-right eye ball
    if (row >= 2 && row <= 4 && col >= size - 5 && col <= size - 3) {
      return true;
    }
    
    // Bottom-left eye ball
    if (row >= size - 5 && row <= size - 3 && col >= 2 && col <= 4) {
      return true;
    }
    
    return false;
  }

  /**
   * Render a single module with custom shape
   */
  private renderModule(row: number, col: number, shape: QRShape, color: string): string {
    const x = col * this.moduleSize;
    const y = row * this.moduleSize;
    const scale = this.moduleSize / 10; // Assuming viewBox is 0 0 10 10

    return `<g transform="translate(${x},${y}) scale(${scale})">
      <path d="${shape.svgPath}" fill="${color}" fill-rule="evenodd"/>
    </g>`;
  }

  /**
   * Render eye frame (corner square)
   */
  private renderEyeFrame(startRow: number, startCol: number, shape: QRShape, color: string): string {
    const x = startCol * this.moduleSize;
    const y = startRow * this.moduleSize;
    const scale = (this.moduleSize * 7) / 30; // Eye frame is 7x7 modules, viewBox is 0 0 30 30

    return `<g transform="translate(${x},${y}) scale(${scale})">
      <path d="${shape.svgPath}" fill="${color}" fill-rule="evenodd"/>
    </g>`;
  }

  /**
   * Render eye ball (center dot in corner)
   */
  private renderEyeBall(startRow: number, startCol: number, shape: QRShape, color: string): string {
    const x = (startCol + 2) * this.moduleSize; // Center is offset by 2 modules
    const y = (startRow + 2) * this.moduleSize;
    const scale = (this.moduleSize * 3) / 10; // Eye ball is 3x3 modules, viewBox is 0 0 10 10

    return `<g transform="translate(${x},${y}) scale(${scale})">
      <path d="${shape.svgPath}" fill="${color}" fill-rule="evenodd"/>
    </g>`;
  }

  /**
   * Get color for gradient
   */
  private getGradientId(): string {
    return 'qr-gradient';
  }

  /**
   * Render gradient definition
   */
  private renderGradientDef(): string {
    if (!this.options.gradient || !this.options.gradient.enabled) {
      return '';
    }

    const { type, rotation, startColor, endColor } = this.options.gradient;

    if (type === 'linear') {
      const angle = (rotation * Math.PI) / 180;
      const x1 = 50 + 50 * Math.cos(angle);
      const y1 = 50 + 50 * Math.sin(angle);
      const x2 = 50 - 50 * Math.cos(angle);
      const y2 = 50 - 50 * Math.sin(angle);

      return `<defs>
        <linearGradient id="${this.getGradientId()}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </linearGradient>
      </defs>`;
    } else {
      return `<defs>
        <radialGradient id="${this.getGradientId()}">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </radialGradient>
      </defs>`;
    }
  }

  /**
   * Render logo overlay
   */
  private renderLogo(): string {
    if (!this.options.logo) {
      return '';
    }

    const logoSize = this.options.logoSize || 0.2;
    const size = this.options.size * logoSize;
    const x = (this.options.size - size) / 2;
    const y = (this.options.size - size) / 2;

    return `<image href="${this.options.logo}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }

  /**
   * Render complete QR code as SVG
   */
  public async renderToSVG(): Promise<string> {
    // Generate QR matrix
    this.qrMatrix = await this.generateQRMatrix(this.options.data);
    this.moduleSize = this.options.size / this.qrMatrix.length;

    // Get shapes
    const bodyShape = getShapeById('body', this.options.bodyShapeId);
    const eyeFrameShape = getShapeById('eye-frame', this.options.eyeFrameShapeId);
    const eyeBallShape = getShapeById('eye-ball', this.options.eyeBallShapeId);

    if (!bodyShape || !eyeFrameShape || !eyeBallShape) {
      throw new Error('Invalid shape IDs');
    }

    // Determine colors
    const dotsColor = this.options.gradient?.enabled 
      ? `url(#${this.getGradientId()})` 
      : this.options.dotsColor;

    let svg = `<svg width="${this.options.size}" height="${this.options.size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add gradient definition if needed
    svg += this.renderGradientDef();

    // Background
    svg += `<rect width="${this.options.size}" height="${this.options.size}" fill="${this.options.backgroundColor}"/>`;

    // Define eye positions
    const eyePositions = [
      { row: 0, col: 0 }, // Top-left
      { row: 0, col: this.qrMatrix.length - 7 }, // Top-right
      { row: this.qrMatrix.length - 7, col: 0 }, // Bottom-left
    ];

    // Clear eye regions with background color first
    for (const pos of eyePositions) {
      const eyeSize = this.moduleSize * 7;
      const x = pos.col * this.moduleSize;
      const y = pos.row * this.moduleSize;
      svg += `<rect x="${x}" y="${y}" width="${eyeSize}" height="${eyeSize}" fill="${this.options.backgroundColor}"/>`;
    }

    // Render eye frames
    for (const pos of eyePositions) {
      svg += this.renderEyeFrame(pos.row, pos.col, eyeFrameShape, this.options.cornersSquareColor);
      svg += this.renderEyeBall(pos.row, pos.col, eyeBallShape, this.options.cornersDotsColor);
    }

    // Render body modules (excluding eye regions)
    for (let row = 0; row < this.qrMatrix.length; row++) {
      for (let col = 0; col < this.qrMatrix[row].length; col++) {
        if (this.qrMatrix[row][col] === 1 && !this.isInEyeRegion(row, col)) {
          svg += this.renderModule(row, col, bodyShape, dotsColor);
        }
      }
    }

    // Render logo
    svg += this.renderLogo();

    svg += '</svg>';
    return svg;
  }

  /**
   * Download as SVG file
   */
  public async downloadAsSVG(filename: string = 'qrcode.svg'): Promise<void> {
    const svgContent = await this.renderToSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Download as PNG file
   */
  public async downloadAsPNG(filename: string = 'qrcode.png'): Promise<void> {
    const svgContent = await this.renderToSVG();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svg = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svg);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }

          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(pngUrl);
          resolve();
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load SVG'));
      };

      img.src = url;
    });
  }
}
