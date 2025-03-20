'use client';

import { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';
import { formatImageUrl } from '@/lib/utils';
import { ElementImage } from '@/types/element';
import { Icon } from '@iconify/react';

interface ImagePlaceholderProps {
    image?: ElementImage | null;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    onNoImage?: () => void;
    onMedia?: () => void;
}

export default function ImagePlaceholder({
                                             image,
                                             size = 'md',
                                             onNoImage,
                                             onMedia
                                         }: ImagePlaceholderProps) {
    const { state: editorState } = useEditor();
    const { dispatch: modalDispatch } = useModal();
    const [imageURL, setImageURL] = useState(false);

    // Get size class based on prop
    const getSizeClass = () => {
        switch (size) {
            case 'xs':
                return 'h-12 w-20';
            case 'sm':
                return 'h-20 w-30';
            case 'md':
                return 'h-32';
            case 'lg':
                return 'h-48';
            default:
                return 'h-32';
        }
    };

    // Format the image URL correctly
    const getImageSrc = (img: ElementImage | string | null | undefined) => {
        if (!img) return null;

        if (typeof img === 'string') {
            return img.includes('http') ? img : formatImageUrl(img);
        }

        if (!img.url) return null;

        return img.url.includes('http') ? img.url : formatImageUrl(img);
    };

    // Calculate image size for display
    const getImageSize = (img: ElementImage) => {
        if (!img.size) return null;

        const sizeInKb = Math.round(parseFloat(img.size) / 1000 * 100) / 100;
        return sizeInKb;
    };

    // Open media dialog
    const handleOpenMedia = () => {
        modalDispatch({
            type: 'OPEN_MODAL',
            payload: {
                component: 'media',
                title: 'Media',
                width: 'w-full',
                options: {}
            }
        });

        if (onMedia) {
            onMedia();
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        if (editorState.current && editorState.current.image) {
            editorState.current.image.url = null;
        }

        if (onNoImage) {
            onNoImage();
        }
    };

    // Preview the image
    const handlePreviewImage = () => {
        if (editorState?.current?.image?.url) {
            localStorage.setItem('windflow-image-preview', JSON.stringify(editorState.current.image));

            modalDispatch({
                type: 'OPEN_MODAL',
                payload: {
                    component: 'imagePreview',
                    title: 'Image Preview',
                    width: 'w-3/4'
                }
            });
        }
    };

    // Toggle image URL editing
    const handleToggleImageURL = () => {
        setImageURL(!imageURL);
    };

    return (
        <div className="object-fit cursor-pointer flex flex-col justify-center items-center relative m-auto">
            {image && image.url ? (
                <img
                    src={getImageSrc(image)}
                    className={`m-auto mb-2 ${getSizeClass()}`}
                    onClick={handleOpenMedia}
                    alt={image.alt || 'Image'}
                    title={image.url}
                />
            ) : null}

            {/* Audio type icon */}
            {editorState?.current?.type === 'audio' && (
                <Icon icon="material-symbols:audiotrack" className="text-5xl" />
            )}

            {/* File type icon */}
            {editorState?.current?.type === 'file' &&
                editorState.current.link && (
                    <Icon icon="material-symbols:file-present" className="text-5xl" />
                )}

            {/* Image metadata */}
            {image && image.name && image.size && (
                <div className="w-full text-xs">
                    {image.width && image.height && (
                        <span>
              {image.width}x{image.height} - {getImageSize(image)} Kb
            </span>
                    )}
                </div>
            )}

            {/* Actions */}
            {!image || !image.url ? (
                <button
                    onClick={handleOpenMedia}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Select Media
                </button>
            ) : (
                <div className="flex flex-row">
                    <button
                        onClick={handleRemoveImage}
                        title="Remove image"
                        className="p-1 m-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        <Icon icon="material-symbols:delete" />
                    </button>

                    <button
                        onClick={handleToggleImageURL}
                        title="Edit image URL"
                        className="p-1 m-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Icon icon="material-symbols:edit" />
                    </button>

                    <button
                        onClick={handlePreviewImage}
                        className="p-1 m-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <Icon icon="material-symbols:link" title="Open preview" />
                    </button>
                </div>
            )}

            {/* Image URL editor */}
            {imageURL && (
                <div className="relative p-2 w-full">
          <textarea
              className="p-1 w-full h-32 border rounded"
              value={editorState?.current?.image?.url || ''}
              onChange={(e) => {
                  if (editorState.current && editorState.current.image) {
                      editorState.current.image.url = e.target.value;
                  }
              }}
          />
                </div>
            )}
        </div>
    );
}
