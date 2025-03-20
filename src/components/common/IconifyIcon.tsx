'use client';

import { useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { Icon } from '@iconify/react';
import { Element } from '@/types/element';

interface IconifyIconProps {
    block?: Element;
    icon?: string;
    mode?: string;
    className?: string;
    onClick?: () => void;
}

export default function IconifyIcon({
                                        block,
                                        icon,
                                        mode,
                                        className = '',
                                        onClick
                                    }: IconifyIconProps) {
    const { state, dispatch } = useEditor();
    const iconRef = useRef<HTMLSpanElement>(null);

    const iconName = block?.data?.icon || icon || 'mi:home';
    const id = block?.id || iconName;

    useEffect(() => {
        if (block && block.data.alpine && iconRef.current) {
            Object.keys(block.data.alpine).forEach(attr => {
                if (block.data.alpine[attr]) {
                    iconRef.current?.setAttribute(attr, block.data.alpine[attr]);
                }
            });
        }
    }, [block, iconRef]);

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick();
            return;
        }

        if (!mode && block) {
            e.stopPropagation();
            editorActions.setCurrent(dispatch, block);
            // Emit floating element event (this would need a different approach in React)
            // We'll handle this via the context or custom hooks
        }
    };

    const selectedClass = mode ? className :
        (state.current && state.current.id === block?.id)
            ? 'border border-dashed border-green-500'
            : block?.css.css.includes('border')
                ? 'hover:border-green-500'
                : 'border border-dashed border-transparent hover:border-green-500';

    return (
        <span
            ref={iconRef}
            id={id}
            onClick={handleClick}
            className={`z-highest w-auto h-auto ${selectedClass} ${className}`}
        >
      <Icon icon={iconName} />
    </span>
    );
}
