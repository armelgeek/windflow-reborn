import html2canvas from 'html2canvas';

interface ScreenshotOptions {
  type?: string;
  useCORS?: boolean;
  scale?: number;
}

/**
 * Captures a screenshot of a DOM element
 * @param element - The DOM element to capture
 * @param options - Screenshot options
 * @returns Promise resolving to a data URL of the screenshot
 */
export const captureElementScreenshot = async (
  element: Element, 
  options: ScreenshotOptions = {}
): Promise<string> => {
  const defaultOptions = {
    type: 'dataURL',
    useCORS: true,
    scale: 1
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const canvas = await html2canvas(element, {
      useCORS: finalOptions.useCORS,
      scale: finalOptions.scale,
      logging: false,
      allowTaint: true
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
};

/**
 * Converts a data URL to a File object
 * @param dataUrl - The data URL string
 * @param fileName - The desired file name
 * @param mimeType - The MIME type of the file
 * @returns Promise resolving to a File object
 */
export const dataUrlToFile = async (
  dataUrl: string, 
  fileName: string, 
  mimeType: string = 'image/png'
): Promise<File> => {
  // Convert base64 to blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  
  // Create File from blob
  return new File([blob], fileName, { type: mimeType });
};