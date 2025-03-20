import {Template} from "@/types/template";

export interface EditorSettings {
    autosave: boolean;
    autosaveTimeout: number;
    categories: string[];
}

export interface EditorState {
    current: Element | null;
    document: Element | null;
    page: Template | null;
    settings: EditorSettings;
    preview: boolean;
    customizeTab: string | null;
    component: never;
}
