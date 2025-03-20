import { ElementImage } from '@/types/element';

export function cleanCssClasses(css: string): string {
    if (!css) return '';

    const classes = css.split(' ').filter(Boolean);
    const uniqueClasses = [...new Set(classes)];

    return uniqueClasses.join(' ');
}

export function randomId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function formatImageUrl(image: ElementImage | string): string {
    if (!image) return '';

    if (typeof image === 'string') {
        return image.startsWith('http') || image.startsWith('/api/placeholder')
            ? image
            : `/images/${image}`;
    }

    if (!image.url) return '';

    return image.url.startsWith('http') || image.url.startsWith('/api/placeholder')
        ? image.url
        : `/images/${image.url}`;
}

// Clone an object deeply
export function cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function getElementCoords(element: HTMLElement): DOMRect | null {
    if (!element) return null;
    return element.getBoundingClientRect();
}

export function isValidJson(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function getUniqueTags(items: Array<{ tags?: string[] }>): string[] {
    const allTags: string[] = [];

    items.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            allTags.push(...item.tags);
        }
    });

    return [...new Set(allTags)];
}

export const storage = {
    set: (key: string, value: never): void => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Error storing data:', error);
        }
    },

    get: <T>(key: string, defaultValue: T): T => {
        try {
            if (typeof window !== 'undefined') {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            }
            return defaultValue;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return defaultValue;
        }
    },

    remove: (key: string): void => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Error removing data:', error);
        }
    }
};

export const fileUtils = {
    readFile: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as string);
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = (e) => {
                reject(e);
            };
            reader.readAsText(file);
        });
    },

    downloadFile: (content: string, filename: string, contentType: string = 'application/json'): void => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    exportJson: (data: never, filename: string): void => {
        const jsonStr = JSON.stringify(data, null, 2);
        fileUtils.downloadFile(jsonStr, filename, 'application/json');
    }
};

export function debounce<T extends (...args: never[]) => never>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function(...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export const imageUtils = {
    getDimensions: (url: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = (err) => {
                reject(err);
            };
            img.src = url;
        });
    },

    getAspectRatio: async (url: string): Promise<number> => {
        try {
            const { width, height } = await imageUtils.getDimensions(url);
            return width / height;
        } catch (err) {
            console.error('Error getting aspect ratio:', err);
            return 1;
        }
    }
};

export function findElementById(root: never, id: string): never | null {
    if (!root) return null;

    if (root.id === id) return root;

    if (root.blocks && Array.isArray(root.blocks)) {
        for (const block of root.blocks) {
            const found = findElementById(block, id);
            if (found) return found;
        }
    }

    return null;
}

/**
 * Generates a random ID
 * @returns Random ID string
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}


/**
 * Clone an object deeply and generate new IDs
 * @param obj Object to clone
 * @returns Cloned object with new IDs
 */
export function cloneElementWithNewIds(obj: any): any {
  if (!obj) return null;
  
  // Create a deep copy
  const clone = JSON.parse(JSON.stringify(obj));
  
  // Helper function to traverse and update IDs
  const traverse = (o: any) => {
    for (const key in o) {
      if (o[key] !== null && typeof o[key] === "object") {
        traverse(o[key]);
      } else if (key === 'id') {
        o[key] = generateRandomId();
      }
    }
    return o;
  };
  
  return traverse(clone);
}