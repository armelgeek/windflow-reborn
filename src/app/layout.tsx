import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { EditorProvider } from '@/context/EditorContext';
import { DesktopProvider } from '@/context/DesktopContext';
import { ModalProvider } from '@/context/ModalContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Tabs from '@/components/common/Tabs';
import Notification from '@/components/common/Notification';
import Modal from '@/components/common/Modal';
import Loading from '@/components/common/Loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'WindFlow - UI Builder',
    description: 'Component builder for TailwindCSS',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-white overflow-x-hidden`}>
        <EditorProvider>
            <DesktopProvider>
                <ModalProvider>
                    <NotificationProvider>
                        <div className="bg-white grid w-screen h-screen max-h-screen overflow-x-hidden bg-no-repeat bg-cover bg-center">
                            <Tabs />
                            {children}
                            <Modal />
                            <Notification />
                        </div>
                    </NotificationProvider>
                </ModalProvider>
            </DesktopProvider>
        </EditorProvider>
        </body>
        </html>
    );
}
