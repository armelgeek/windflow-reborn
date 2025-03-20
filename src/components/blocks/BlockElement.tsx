'use client';

import {JSX, useEffect, useRef, useState} from 'react';
import { Element } from '@/types/element';
import { formatImageUrl, cleanCssClasses } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';
import { Icon } from '@iconify/react';

interface BlockElementProps {
    element: Element;
    mode?: 'edit' | 'preview';
    onSelect?: (element: Element) => void;
}

export default function BlockElement({
                                         element,
                                         mode = 'edit',
                                         onSelect
                                     }: BlockElementProps) {
    const [isVisible, setIsVisible] = useState(true);
    const elementRef = useRef<HTMLElement>(null);
    const { dispatch } = useEditor();

    const getElementComponent = (): string => {
        if (element.semantic) return element.semantic;

        if (element.hasOwnProperty('level')) {
            return `h${element.level}`;
        }

        return element.element;
    };

    const elementClasses = cleanCssClasses(`${element.css.css} ${!isVisible ? 'hidden' : ''}`);

    const elementStyle: React.CSSProperties = {};

    if (element.image && element.element !== 'img' && element.image.url) {
        elementStyle.backgroundImage = `url(${formatImageUrl(element.image)})`;
    }

    if (element.font) {
        elementStyle.fontFamily = element.font.replace('+', ' ');
    }

    if (element.style) {
        const styleObj = element.style.split(';')
            .filter(Boolean)
            .reduce((acc, style) => {
                const [property, value] = style.split(':');
                if (property && value) {
                    const camelProperty = property.trim().replace(/-([a-z])/g, (_, letter) =>
                        letter.toUpperCase()
                    );
                    acc[camelProperty as keyof React.CSSProperties] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>);

        Object.assign(elementStyle, styleObj);
    }

    const handleClick = (e: React.MouseEvent) => {
        if (mode === 'edit') {
            e.stopPropagation();
            if (onSelect) {
                onSelect(element);
            } else if (dispatch) {
                dispatch({ type: 'SET_CURRENT', payload: element });
            }
        }

        if (element.events.click) {
            console.log(`Event triggered: ${element.events.click}`);
        }
    };

    useEffect(() => {
        if (element.events.display) {
            setIsVisible(false);


            return () => {
            };
        }

        if (element.gsap.animation && element.gsap.duration) {
        }
    }, [element.events, element.gsap]);

    useEffect(() => {
        if (!elementRef.current) return;

        elementRef.current.removeAttribute('element');
        if (element.element !== 'img') elementRef.current.removeAttribute('src');
        if (element.element !== 'img') elementRef.current.removeAttribute('alt');
        if (element.element !== 'img' && !element.link) elementRef.current.removeAttribute('title');
        if (element.element !== 'input') elementRef.current.removeAttribute('type');

        if (element.data.attributes) {
            Object.entries(element.data.attributes).forEach(([attribute, value]) => {
                if (typeof value === 'string') {
                    elementRef.current?.setAttribute(attribute, value);
                } else if (typeof value === 'boolean' && value) {
                    elementRef.current?.setAttribute(attribute, '');
                }
            });
        }

        if (element.data.alpine) {
            Object.entries(element.data.alpine).forEach(([attr, value]) => {
                if (value) {
                    elementRef.current?.setAttribute(attr, value);
                }
            });
        }
    }, [element]);

    if (element.tag === 'iconify' && element.data.icon) {
        return (
            <span
                id={element.id}
                className={elementClasses}
                style={elementStyle}
                onClick={handleClick}
            >
        <Icon icon={element.data.icon} />
      </span>
        );
    }

    if (element.element === 'img') {
        return (
            <img
                ref={elementRef as React.RefObject<HTMLImageElement>}
                id={element.id}
                className={elementClasses}
                style={elementStyle}
                src={formatImageUrl(element.image)}
                alt={element.image?.alt || element.element}
                title={element.image?.caption || element.element}
                onClick={handleClick}
            />
        );
    }

    if (element.element === 'input') {
        return (
            <input
                ref={elementRef as React.RefObject<HTMLInputElement>}
                id={element.id}
                className={elementClasses}
                style={elementStyle}
                type={element.type as string}
                value={element.value}
                placeholder={element.placeholder}
                onClick={handleClick}
                readOnly={mode === 'edit'}
            />
        );
    }

    if (element.element === 'textarea') {
        return (
            <textarea
                ref={elementRef as React.RefObject<HTMLTextAreaElement>}
                id={element.id}
                className={elementClasses}
                style={elementStyle}
                placeholder={element.placeholder}
                onClick={handleClick}
                readOnly={mode === 'edit'}
            >
        {element.content}
      </textarea>
        );
    }

    if (element.element === 'select') {
        return (
            <select
                ref={elementRef as React.RefObject<HTMLSelectElement>}
                id={element.id}
                className={elementClasses}
                style={elementStyle}
                onClick={handleClick}
                disabled={mode === 'edit'}
            >
                {element.data.options && element.data.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        );
    }

    const ElementComponent = getElementComponent() as keyof JSX.IntrinsicElements;

    return (
        <ElementComponent
            ref={elementRef}
            id={element.id}
            className={elementClasses}
            style={elementStyle}
            onClick={handleClick}
            dangerouslySetInnerHTML={element.content ? { __html: element.content } : undefined}
        />
    );
}
