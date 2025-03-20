'use client';

import { useState, useEffect, useRef } from 'react';
import { Element } from '@/types/element';
import BlockElement from '@/components/blocks/BlockElement';
import IconifyIcon from '@/components/common/IconifyIcon';
import { useEditor } from '@/context/EditorContext';
import { cleanCssClasses } from '@/lib/utils';
import BlockSlider from './BlockSlider';
import BlockIFrame from './BlockIFrame';

interface BlockContainerProps {
    doc: Element;
    mode?: 'edit' | 'preview';
    onSelect?: (element: Element) => void;
    level?: number;
}

export default function BlockContainer({
                                           doc,
                                           mode = 'edit',
                                           onSelect,
                                           level = 0
                                       }: BlockContainerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLElement>(null);
    const { state, dispatch } = useEditor();

    // Determine the semantic tag for the container
    const Semantic = doc.semantic || 'div';

    // Combine CSS classes
    const containerClasses = cleanCssClasses(
        `${doc.css.css} ${doc.css.container} ${!isVisible ? 'hidden' : ''}`
    );

    // Generate inline styles
    const containerStyle: React.CSSProperties = {};

    // Add background image if present
    if (doc.image && doc.image.url) {
        containerStyle.backgroundImage = `url(${doc.image.url})`;
    }

    // Add font family if present
    if (doc.font) {
        containerStyle.fontFamily = doc.font.replace('+', ' ');
    }

    // Add any additional inline styles
    if (doc.style) {
        const styleObj = doc.style.split(';')
            .filter(Boolean)
            .reduce((acc, style) => {
                const [property, value] = style.split(':');
                if (property && value) {
                    // Convert kebab-case to camelCase
                    const camelProperty = property.trim().replace(/-([a-z])/g, (_, letter) =>
                        letter.toUpperCase()
                    );
                    acc[camelProperty as keyof React.CSSProperties] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>);

        Object.assign(containerStyle, styleObj);
    }

    // Handle click events (for editor mode)
    const handleClick = (e: React.MouseEvent) => {
        if (mode === 'edit') {
            e.stopPropagation();
            if (onSelect) {
                onSelect(doc);
            } else if (dispatch) {
                dispatch({ type: 'SET_CURRENT', payload: doc });
            }
        }

        // Execute custom click event if defined
        if (doc.events.click) {
            // This would be handled by a custom event system
            console.log(`Event triggered: ${doc.events.click}`);
        }
    };

    // Set up display events and animations
    useEffect(() => {
        // Handle display/hide events if defined
        if (doc.events.display) {
            setIsVisible(false);

            // This would be replaced with a custom event system
            const handleDisplay = () => setIsVisible(!isVisible);

            return () => {
                // Remove event listener
            };
        }

        // Handle GSAP animations if needed
        if (doc.gsap.animation && doc.gsap.duration) {
            // This would be implemented with GSAP
        }
    }, [doc.events, doc.gsap]);

    // Set up attributes and Alpine.js directives
    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.removeAttribute('doc');

        // Add custom attributes if defined
        if (doc.data.attributes) {
            Object.entries(doc.data.attributes).forEach(([attribute, value]) => {
                if (typeof value === 'string') {
                    containerRef.current?.setAttribute(attribute, value);
                } else if (typeof value === 'boolean' && value) {
                    containerRef.current?.setAttribute(attribute, '');
                }
            });
        }

        // Add Alpine.js directives if defined
        if (doc.data.alpine) {
            Object.entries(doc.data.alpine).forEach(([attr, value]) => {
                if (value) {
                    containerRef.current?.setAttribute(attr, value);
                }
            });
        }
    }, [doc.data]);

    if (!doc) return null;

    return (
        // @ts-ignore - Using dynamic tag name
        <Semantic
            ref={containerRef}
            id={doc.id}
            className={containerClasses}
            style={containerStyle}
            onClick={handleClick}
        >
            {doc.blocks && doc.blocks.map(block => {
                // Skip if no block
                if (!block) return null;

                // If block is a link, wrap in anchor tag
                if (block.link) {
                    return (
                        <a href={block.link} key={block.id}>
                            {block.type === 'container' ? (
                                <BlockContainer
                                    doc={block}
                                    mode={mode}
                                    onSelect={onSelect}
                                    level={level + 1}
                                />
                            ) : block.tag === 'iconify' ? (
                                <IconifyIcon
                                    block={block}
                                    mode={mode === 'edit' ? 'edit' : undefined}
                                />
                            ) : (
                                <BlockElement element={block} mode={mode} onSelect={onSelect} />
                            )}
                        </a>
                    );
                }

                // Render based on block type
                if (block.type === 'container') {
                    return (
                        <BlockContainer
                            key={block.id}
                            doc={block}
                            mode={mode}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    );
                }

                if (block.type === 'slider') {
                    return (
                        <BlockSlider
                            key={block.id}
                            slider={block}
                            mode={mode}
                            onSelect={onSelect}
                        />
                    );
                }

                if (block.tag === 'iconify') {
                    return (
                        <IconifyIcon
                            key={block.id}
                            block={block}
                            mode={mode === 'edit' ? 'edit' : undefined}
                        />
                    );
                }

                if (block.tag === 'youtube' || block.tag === 'vimeo') {
                    return (
                        <BlockIFrame
                            key={block.id}
                            el={block}
                            mode={mode}
                            onSelect={onSelect}
                        />
                    );
                }

                return (
                    <BlockElement
                        key={block.id}
                        element={block}
                        mode={mode}
                        onSelect={onSelect}
                    />
                );
            })}
        </Semantic>
    );
}
