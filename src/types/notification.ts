export interface NotificationState {
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
    isVisible: boolean;
}
