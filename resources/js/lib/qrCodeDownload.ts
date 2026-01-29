import QRCodeStyling from 'qr-code-styling';
import { QRCustomization } from '@/types';

/**
 * Generate and download a styled QR code using qr-code-styling library
 * This ensures consistent styling across all download formats
 */
export function downloadStyledQRCode(
    data: string,
    customization: Partial<QRCustomization>,
    filename: string,
    format: 'png' | 'svg' | 'jpeg' | 'webp'
) {
    const hasGradient = customization.gradientEnabled;
    const gradient = hasGradient
        ? {
              type: (customization.gradientType || 'linear') as any,
              rotation:
                  typeof customization.gradientRotation === 'number'
                      ? customization.gradientRotation
                      : 0,
              colorStops: [
                  {
                      offset: 0,
                      color:
                          customization.gradientStartColor ||
                          customization.dotsColor ||
                          '#000000',
                  },
                  {
                      offset: 1,
                      color:
                          customization.gradientEndColor ||
                          customization.dotsColor ||
                          '#000000',
                  },
              ],
          }
        : undefined;

    const exportSize = customization.width || 1024;

    const options = {
        width: exportSize,
        height: exportSize,
        data: data,
        dotsOptions: {
            ...(gradient ? { gradient: gradient as any } : { color: customization.dotsColor || '#000000' }),
            type: (customization.dotsType || 'square') as any,
        },
        backgroundOptions: {
            color: customization.backgroundColor || '#ffffff',
        },
        cornersSquareOptions: {
            color: customization.cornersSquareColor || '#000000',
            type: (customization.cornersSquareType || 'square') as any,
        },
        cornersDotOptions: {
            color: customization.cornersDotsColor || '#000000',
            type: (customization.cornersDotsType || 'dot') as any,
        },
        image: customization.image,
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 8,
            imageSize: (customization.imageSize || 0.2) as number,
        },
        errorCorrectionLevel: (customization.errorCorrectionLevel || 'M') as any,
    };

    const qrCode = new QRCodeStyling(options);
    qrCode.download({ name: filename, extension: format });
}
