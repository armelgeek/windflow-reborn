import {UIKit} from "@/types/ui-kit";

export interface DesktopState {
    tabs: Array<{
        label: string;
        object: never;
        type: string;
        mode?: string;
    }>;
    currentTab: number;
    component: never;
    library: UIKit | null;
    uikits: UIKit[];
    galleryFilter: string;
    dbmode: boolean;
}
