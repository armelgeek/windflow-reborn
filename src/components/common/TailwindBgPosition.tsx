'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import ImagePlaceholder from '@/components/common/ImagePlaceholder';
import { cleanCssClasses } from '@/lib/utils';

interface TailwindBgPositionProps {
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindBgPosition({ css = '', onChange }: TailwindBgPositionProps) {
  const { state } = useEditor();
  const [bgposition, setBgPosition] = useState({
    size: '',
    position: '',
    repeat: '',
    attachment: '',
    clip: '',
    origin: ''
  });

  // Predefined options
  const bgsizes = [
    'bg-auto',
    'bg-cover',
    'bg-contain'
  ];
  
  const bgpositions = [
    'bg-center',
    'bg-top',
    'bg-bottom',
    'bg-left',
    'bg-left-top',
    'bg-left-bottom',
    'bg-right',
    'bg-right-top',
    'bg-right-bottom'
  ];
  
  const bgrepeats = [
    'bg-no-repeat',
    'bg-repeat',
    'bg-repeat-x',
    'bg-repeat-y',
    'bg-repeat-round',
    'bg-repeat-space'
  ];
  
  const bgattachments = [
    'bg-fixed',
    'bg-local',
    'bg-scroll'
  ];
  
  const bgclips = [
    'bg-clip-border',
    'bg-clip-padding',
    'bg-clip-content',
    'bg-clip-text'
  ];
  
  const bgorigin = [
    'bg-origin-border',
    'bg-origin-padding',
    'bg-origin-content'
  ];

  // Update background position from CSS
  useEffect(() => {
    if (!css || !css.length) return;
    
    const classes = css.split(' ');
    const newBgPosition = { ...bgposition };
    let updated = false;
    
    // Check for bg size
    bgsizes.forEach(size => {
      if (classes.includes(size)) {
        newBgPosition.size = size;
        updated = true;
      }
    });
    
    // Check for bg position
    bgpositions.forEach(pos => {
      if (classes.includes(pos)) {
        newBgPosition.position = pos;
        updated = true;
      }
    });
    
    // Check for bg repeat
    bgrepeats.forEach(rep => {
      if (classes.includes(rep)) {
        newBgPosition.repeat = rep;
        updated = true;
      }
    });
    
    // Check for bg attachment
    bgattachments.forEach(att => {
      if (classes.includes(att)) {
        newBgPosition.attachment = att;
        updated = true;
      }
    });
    
    // Check for bg clip
    bgclips.forEach(clip => {
      if (classes.includes(clip)) {
        newBgPosition.clip = clip;
        updated = true;
      }
    });
    
    // Check for bg origin
    bgorigin.forEach(origin => {
      if (classes.includes(origin)) {
        newBgPosition.origin = origin;
        updated = true;
      }
    });
    
    if (updated) {
      setBgPosition(newBgPosition);
    }
  }, [css]);

  // Update CSS when background settings change
  const updateCSS = () => {
    const cssClasses = cleanCssClasses(Object.values(bgposition).join(' '));
    if (onChange) {
      onChange(cssClasses);
    }
  };

  // Handle change in background size
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, size: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  // Handle change in background position
  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, position: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  // Handle change in background repeat
  const handleRepeatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, repeat: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  // Handle change in background attachment
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, attachment: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  // Handle change in background clip
  const handleClipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, clip: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  // Handle change in background origin
  const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBgPosition = { ...bgposition, origin: e.target.value };
    setBgPosition(newBgPosition);
    setTimeout(updateCSS, 0);
  };

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full flex flex-col">
        <span>Media</span>
        <ImagePlaceholder 
          image={state.current?.image} 
          onNoImage={() => state.current && (state.current.image = null)} 
          onMedia={() => {}} 
        />
      </div>
      
      {state.current?.image && (
        <div className="w-full grid grid-cols-2 gap-3 mt-4">
          <div className="w-1/2">
            <div>Size</div>
            <select 
              value={bgposition.size} 
              onChange={handleSizeChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose size</option>
              {bgsizes.map(size => (
                <option key={size} value={size}>
                  {size.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-1/2 ml-1">
            <div>Position</div>
            <select 
              value={bgposition.position} 
              onChange={handlePositionChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose position</option>
              {bgpositions.map(pos => (
                <option key={pos} value={pos}>
                  {pos.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <div>Repeat</div>
            <select 
              value={bgposition.repeat} 
              onChange={handleRepeatChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose repeat</option>
              {bgrepeats.map(rep => (
                <option key={rep} value={rep}>
                  {rep.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <div>Attachment</div>
            <select 
              value={bgposition.attachment} 
              onChange={handleAttachmentChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose attachment</option>
              {bgattachments.map(att => (
                <option key={att} value={att}>
                  {att.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <div>Clip</div>
            <select 
              value={bgposition.clip} 
              onChange={handleClipChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose clip</option>
              {bgclips.map(clip => (
                <option key={clip} value={clip}>
                  {clip.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <div>Origin</div>
            <select 
              value={bgposition.origin} 
              onChange={handleOriginChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose origin</option>
              {bgorigin.map(origin => (
                <option key={origin} value={origin}>
                  {origin.replace('bg-', '')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}