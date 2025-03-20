'use client';

import { useRef, useState, useEffect } from 'react';
import { Element } from '@/types/element';
import BlockContainer from './BlockContainer';
import { cleanCssClasses } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface BlockSliderProps {
    slider: Element;
    mode?: 'edit' | 'preview';
    onSelect?: (element: Element) => void;
}

export default function BlockSlider({
                                        slider,
                                        mode = 'edit',
                                        onSelect
                                    }: BlockSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const prevBtnRef = useRef<HTMLDivElement>(null);
    const nextBtnRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useEditor();

    const handleClick = (e: React.MouseEvent) => {
        if (mode === 'edit') {
            e.stopPropagation();
            if (onSelect) {
                onSelect(slider);
            } else if (dispatch) {
                dispatch({ type: 'SET_CURRENT', payload: slider });
            }
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev =>
            prev < (slider.blocks.length - 1) ? prev + 1 : 0
        );
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev =>
            prev > 0 ? prev - 1 : slider.blocks.length - 1
        );
    };

    // Navigation appearance based on settings
    const getNavigationClass = () => {
        if (!slider.data.slider?.navigation) {
            return 'flex justify-center m-auto w-full bottom-0 absolute z-10 items-center';
        }

        const position = slider.data.slider.navigation.position || 'bottom';

        switch (position) {
            case 'bottom':
                return 'flex justify-center m-auto w-full bottom-0 absolute z-10 items-center';
            case 'left':
                return 'flex flex-col h-full absolute top-0 left-0 justify-center items-center z-modal';
            case 'right':
                return 'flex flex-col h-full absolute top-0 right-0 justify-center items-center z-modal';
            case 'top':
                return 'flex justify-center m-auto w-full top-0 absolute z-10 items-center';
            default:
                return 'flex justify-center m-auto w-full bottom-0 absolute z-10 items-center';
        }
    };

    // Get navigation icons based on position
    const getNavigationIcons = () => {
        const position = slider.data.slider?.navigation?.position || 'bottom';

        if (position === 'left' || position === 'right') {
            return {
                prev: <ChevronUp size={36} />,
                next: <ChevronDown size={36} />
            };
        }

        return {
            prev: <ChevronLeft size={36} />,
            next: <ChevronRight size={36} />
        };
    };

    // Setup touch swipe events
    useEffect(() => {
        if (!sliderRef.current || mode !== 'preview') return;

        let startX: number;
        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left
                    setCurrentIndex(prev =>
                        prev < (slider.blocks.length - 1) ? prev + 1 : 0
                    );
                } else {
                    // Swipe right
                    setCurrentIndex(prev =>
                        prev > 0 ? prev - 1 : slider.blocks.length - 1
                    );
                }
            }
        };

        const element = sliderRef.current;
        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [slider.blocks.length, mode]);

    // Prepare navigation icons
    const icons = getNavigationIcons();

    return (
        <div
            className={cleanCssClasses(`relative ${slider.css.css}`)}
            onClick={handleClick}
        >
            <div
                ref={sliderRef}
                id={slider.id}
                className="snap overflow-x-hidden relative flex-no-wrap flex transition-all whoobe-slider"
                data-slides={slider.blocks.length}
            >
                {slider.blocks.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`w-full flex-shrink-0 overflow-hidden flex items-center justify-center transition-opacity duration-500 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
                        }`}
                        style={{ transform: index === currentIndex ? 'translateX(0)' : 'translateX(100%)' }}
                    >
                        <BlockContainer
                            doc={slide}
                            mode={mode}
                            onSelect={onSelect}
                        />
                    </div>
                ))}
            </div>

            {slider.blocks.length > 1 && slider.data.slider?.navigation?.enable !== false && (
                <div className={`opacity-0 md:opacity-100 slider-navigation cursor-pointer ${getNavigationClass()}`}>
                    <div ref={prevBtnRef} className="slider-prev flex items-center" onClick={handlePrev}>
                        {icons.prev}
                    </div>

                    {slider.data.slider?.navigation?.dots !== false && (
                        <div className="flex items-center">
                            {slider.blocks.map((_, index) => (
                                <span
                                    key={index}
                                    className={`h-3 w-3 rounded-full shadow mx-1 ${
                                        index === currentIndex
                                            ? 'bg-blue-500 animate-pulse'
                                            : 'bg-gray-700'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div ref={nextBtnRef} className="slider-next flex items-center" onClick={handleNext}>
                        {icons.next}
                    </div>
                </div>
            )}
        </div>
    );
}
