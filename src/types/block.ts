export interface Block {
    id: string;
    name: string;
    description?: string;
    category?: string;
    tags?: string[];
    analytics?: string;
    image?: string;
    json: {
        blocks: Element;
    }
}
