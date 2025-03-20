
interface IconSearchResult {
    icons: string[];
    total: number;
    title?: string;
    prefix?: string;
  }
  
  /**
   * Search for icons using the Iconify API
   * @param search Search term
   * @param limit Maximum number of results (default: 120)
   * @returns Promise with search results
   */
  export async function searchIcons(search: string, limit: number = 120): Promise<IconSearchResult> {
    if (!search) {
      return { icons: [], total: 0 };
    }
    
    try {
      const response = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(search)}&limit=${limit}`,
        { mode: 'cors' }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch icons: ${response.status} ${response.statusText}`);
      }
      
      const icons = await response.json();
      return icons;
    } catch (error) {
      console.error('Error searching for icons:', error);
      return { icons: [], total: 0 };
    }
  }
  
  /**
   * Get icon component based on name
   * This is a utility function to get icon data from the Iconify API
   * Not currently used in the BlockIconFinder component directly
   * @param iconName Icon name
   * @returns Promise with icon data
   */
  export async function getIconComponent(iconName: string): Promise<any> {
    try {
      const response = await fetch(
        `https://api.iconify.design/${iconName.split(':')[0]}.json?icons=${iconName.split(':')[1]}`,
        { mode: 'cors' }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch icon: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting icon component:', error);
      return null;
    }
  }