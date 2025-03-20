'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { colors } from '@/lib/tailwind-classes';

interface TailwindColorProps {
    attr?: string;
    css?: string;
    onChange?: (value: string) => void;
    front?: string;
    hover?: string;
}

export default function TailwindColor({
                                          attr = 'textcolor',
                                          css = '',
                                          onChange,
                                          front,
                                          hover
                                      }: TailwindColorProps) {
    const { state } = useEditor();
    const [showPalette, setShowPalette] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [color, setColor] = useState<{
        front: string;
        over: string;
    }>({
        front: front || '',
        over: hover || ''
    });

    // Determine context (bg- or text-)
    const context = attr === 'bgcolor' ? 'bg-' : 'text-';

    // Update colors from CSS
    useEffect(() => {
        if (!css || css.length === 0) return;

        const classes = css.split(' ');

        // Find applicable color classes
        classes.forEach(cl => {
            colors.forEach(colorName => {
                if (cl.indexOf(colorName) > -1) {
                    if (cl.indexOf('hover:') > -1) {
                        setColor(prev => ({ ...prev, over: cl }));
                    } else {
                        setColor(prev => ({ ...prev, front: cl }));
                    }
                }
            });
        });

        // Set front and hover if provided
        if (front) setColor(prev => ({ ...prev, front }));
        if (hover) setColor(prev => ({ ...prev, over: hover }));

    }, [css, front, hover]);

    // Set color when selected from palette
    const setColorFromPalette = (colorName: string, tone?: string | number) => {
        let c = context;

        if (colorName) {
            if (tone) {
                c += `${colorName}-${tone}`;
            } else {
                c += colorName;
            }

            if (!isOver) {
                setColor(prev => ({ ...prev, front: c }));
            } else {
                setColor(prev => ({ ...prev, over: `hover:${c}` }));
            }
        } else {
            if (!isOver) {
                setColor(prev => ({ ...prev, front: '' }));
            } else {
                setColor(prev => ({ ...prev, over: '' }));
            }
        }

        // If we have an onChange, call it with the combined colors
        if (onChange) {
            const updatedColor = !isOver
                ? { ...color, front: c }
                : { ...color, over: `hover:${c}` };

            onChange(`${updatedColor.front} ${updatedColor.over}`.trim());
        }

        // Close palette
        setShowPalette(false);
    };

    return (
        <div className="flex flex-row">
            <div className="mr-2">
                <span>Color</span>
                <div
                    className={`mb-1 w-8 h-8 border-2 rounded-full ${color.front.replace('text', 'bg')}`}
                    onClick={() => {
                        setShowPalette(!showPalette);
                        setIsOver(false);
                    }}
                />
            </div>

            <div>
                <span>Over</span>
                <div
                    className={`mb-1 w-8 h-8 border-2 rounded-full ${color.over.replace('hover:text', 'bg').replace('hover:', '')}`}
                    onClick={() => {
                        setShowPalette(!showPalette);
                        setIsOver(true);
                    }}
                />
            </div>

            {showPalette && (
                <div className="fixed top-0 bg-gray-700 text-white p-2 w-full z-40 cursor-pointer right-0">
                    <div className="flex flex-row justify-start">
                        <div>
                            <div className="flex items-center mb-4">
                                <span>Current</span>
                                <div
                                    className={`h-8 w-8 rounded-full ml-2 ${isOver
                                        ? color.over.replace('hover:', '').replace('text-', 'bg-')
                                        : color.front.replace('text-', 'bg-')
                                    }`}
                                />
                            </div>

                            <div className="flex flex-row m-auto mb-2">
                                <button
                                    className="border border-black text-xl font-bold rounded-full h-6 w-6 mr-2 bg-transparent text-red-500 flex items-center justify-center"
                                    title="transparent"
                                    onClick={() => setColorFromPalette('', '')}
                                >
                                    x
                                </button>
                                <div
                                    className="border border-black rounded-full w-6 h-6 mr-2 bg-white"
                                    title="white"
                                    onClick={() => setColorFromPalette('white', '')}
                                />
                                <div
                                    className="border border-black rounded-full w-6 h-6 mr-2 bg-black"
                                    title="black"
                                    onClick={() => setColorFromPalette('black', '')}
                                />
                            </div>

                            <div className="m-auto">
                                {colors.map(colorName => (
                                    <div key={colorName} className="flex flex-row mb-2">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <div
                                                key={`${colorName}-${i === 0 ? 50 : i * 100}`}
                                                className={`bg-${colorName}-${i === 0 ? 50 : i * 100} rounded-full border border-black w-5 h-5 mr-1`}
                                                title={`${colorName}-${i === 0 ? 50 : i * 100}`}
                                                onClick={() => setColorFromPalette(colorName, i === 0 ? 50 : (i) * 100)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        className="mt-1 px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() => setShowPalette(false)}
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    );
}
