'use client';

import { useEffect, useRef } from 'react';
import { Element } from '@/types/element';
import { cleanCssClasses } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';

interface BlockIFrameProps {
    el: Element;
    mode?: 'edit' | 'preview';
    onSelect?: (element: Element) => void;
}

export default function BlockIFrame({ el, mode = 'edit', onSelect }: BlockIFrameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { dispatch } = useEditor();

    const getSource = () => {
        if (el.tag === 'youtube') {
            return `https://youtube.com/embed/${el.content}`;
        } else if (el.tag === 'vimeo') {
            return `https://player.vimeo.com/video/${el.content}`;
        }
        return el.src + el.content;
    };

    const handleClick = (e: React.MouseEvent) => {
        if (mode === 'edit') {
            e.stopPropagation();
            if (onSelect) {
                onSelect(el);
            } else if (dispatch) {
                dispatch({ type: 'SET_CURRENT', payload: el });
            }
        }
    };

    useEffect(() => {
        if (el.gsap.animation && el.gsap.duration) {
        }
    }, [el.gsap]);

    const autoplay = el.data.options?.autoplay ?? true;
    const controls = el.data.options?.controls ?? true;
    const loop = el.data.options?.loop ?? true;

    return (
        <iframe
            ref={iframeRef}
            id={el.id}
            src={getSource()}
            className={cleanCssClasses(el.css.css)}
            style={{ ...el.style }}
            autoPlay={autoplay ? "true" : undefined}
            controls={controls ? "true" : undefined}
            loop={loop ? "true" : undefined}
            onClick={handleClick}
            frameBorder="0"
            allowFullScreen
        />
    );
}
