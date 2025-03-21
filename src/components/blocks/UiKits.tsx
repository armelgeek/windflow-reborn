'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDesktop } from '@/context/DesktopContext';
import ComponentsGallery from './ComponentsGallery';
import { Icon } from '@iconify/react';

export default function UiKits() {
    const router = useRouter();
    const { state, dispatch } = useDesktop();

    const [limit, setLimit] = useState(0);
    const [skip, setSkip] = useState(0);
    const [pages, setPages] = useState(null);
    const [total, setTotal] = useState(0);
    const [galleryID, setGalleryID] = useState(null);
    const [freeKits, setFreeKits] = useState(false);
    const [whoobeKits, setWhoobeKits] = useState(null);

    useEffect(() => {
        if (state.desktop.library) {
            setGalleryID(generateRandomID());
            importUIKit();
        }
    }, [state.desktop.library]);

    // Generate a random ID for the gallery
    const generateRandomID = () => {
        return Math.random().toString(36).substring(2, 9);
    };

    // Load a UI kit from a URL
    const loadUIKit = async (kit) => {
        try {
            const response = await fetch(kit);
            const data = await response.json();

            dispatch({
                type: 'ADD_UIKIT',
                payload: data
            });

            dispatch({
                type: 'SET_LIBRARY',
                payload: data
            });

            setFreeKits(false);
        } catch (err) {
            console.error(err);
        }
    };

    const importUIKit = () => {
        const kit = state.desktop.library;
        setPages([...kit.templates]);
        setTotal(kit.templates.length);
    };

    useEffect(() => {
        setWhoobeKits(fetchTemplateKits());

        if (state.desktop.library && state.desktop.library.templates.length) {
            setPages(state.desktop.library.templates);
        } else {
            dispatch({
                type: 'OPEN_MODAL',
                payload: {
                    component: 'createUIKit',
                    title: 'Create UI Kit'
                }
            });
        }

        setGalleryID(generateRandomID());
    }, []);

    return (
        <div className="pages-gallery bg-white w-screen overflow-hidden max-h-screen h-screen mt-0 inset-0" key={galleryID}>
            <div className="py-1 mt-8 bg-white shadow w-screen z-40 hidden md:flex md:flex-row items-center">
                <div className="flex items-center pl-2">
                    <button
                        className="mr-2 rounded btn-purple py-1 px-2 absolute right-0"
                        onClick={() => setFreeKits(!freeKits)}
                        title="Load Whoobe UI Kits"
                    >
                        Whoobe UI Kits
                    </button>

                    <select
                        className="mr-2 rounded ring-1 ring-purple-500 bg-gray-200 py-2"
                        value={state.desktop.library || ''}
                        onChange={() => importUIKit()}
                    >
                        {state.desktop.uikits.map((uikit, index) => (
                            <option key={index} value={uikit}>{uikit.name}</option>
                        ))}
                    </select>

                    <Icon
                        icon="bx:bx-import"
                        className="icon-button border cursor-pointer text-2xl"
                        onClick={() => dispatch({
                            type: 'OPEN_MODAL',
                            payload: {
                                component: 'importUIKit',
                                title: 'Import UI Kit'
                            }
                        })}
                        title="Upload UI Kit"
                    />

                    {state.desktop.library && (
                        <Icon
                            icon="bx:bx-export"
                            className="icon-button border cursor-pointer text-2xl"
                            onClick={() => dispatch({ type: 'EXPORT_CUSTOM_LIBRARY' })}
                            title="Export UI Kit"
                        />
                    )}

                    <Icon
                        icon="material-symbols:add"
                        className="icon-button cursor-pointer text-2xl border"
                        onClick={() => dispatch({
                            type: 'OPEN_MODAL',
                            payload: {
                                component: 'createUIKit',
                                title: 'Create UI Kit'
                            }
                        })}
                        title="Create a new UI Kit"
                    />

                    <div className="border-l h-10 w-1"></div>

                    <button
                        className="btn btn-blue border-0 rounded"
                        onClick={() => dispatch({
                            type: 'OPEN_MODAL',
                            payload: {
                                component: 'startEmpty',
                                title: 'New Template'
                            }
                        })}
                        title="Create a new template"
                    >
                        New Template
                    </button>
                </div>

                {freeKits && whoobeKits && (
                    <div className="absolute right-0 top-0 mt-20 ml-2 w-64 shadow flex flex-col p-2 bg-white z-40 cursor-pointer border">
                        {whoobeKits.map((kit, index) => (
                            <div
                                key={index}
                                className="hover:bg-purple-500 hover:text-white p-1"
                                onClick={() => loadUIKit(kit.url)}
                            >
                                {kit.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pages && (
                <ComponentsGallery
                    pages={pages}
                    skip={skip}
                    limit={limit}
                    dbmode={false}
                />
            )}
        </div>
    );
}
