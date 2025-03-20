'use client';

import { useState, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { cleanCssClasses } from '@/lib/utils';
import twgroups from '@/lib/tw-groups';
import { RiArrowRightSLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';

// Dynamically import the controls to improve initial load time
const Options = dynamic(() => import('./TailwindOptions'));
const Checkbox = dynamic(() => import('./TailwindCheckbox'));
const Range = dynamic(() => import('./TailwindRange'));
const Color = dynamic(() => import('./TailwindColor'));
const Button = dynamic(() => import('./TailwindButton'));
const BgGradient = dynamic(() => import('./TailwindBgGradient'));
const BgGradientPresets = dynamic(() => import('./TailwindGradient'));
const Width = dynamic(() => import('./TailwindWidth'));
const Height = dynamic(() => import('./TailwindHeight'));
const BgPosition = dynamic(() => import('./TailwindBgPosition'));
const BorderColor = dynamic(() => import('./TailwindBorderColor'));
const TextFont = dynamic(() => import('./TailwindTextFont'));
const Position = dynamic(() => import('./TailwindPosition'));

interface TailwindComponentProps {
  name: string;
  attr: string;
  title?: string;
  icon?: string;
  css?: string;
  stile?: string;
  group?: boolean;
}

interface BlockTailwindProps {
  css?: string;
  cid?: string;
}

export default function BlockTailwind({ css = '', cid = '' }: BlockTailwindProps) {
  const { state, dispatch } = useEditor();
  const [activeGroup, setActiveGroup] = useState<string>('');
  const [controls, setControls] = useState<TailwindComponentProps[] | null>(null);
  const [allCss, setAllCss] = useState<string>(css);
  const [cssTw, setCssTw] = useState<Record<string, string>>({});

  // Initialize the component when it mounts or when the current element changes
  useEffect(() => {
    setControls(null);
    setCssTw({});
    setAllCss(css);
    
    // If there's a customizeTab in the state, set the controls based on it
    if (state.customizeTab) {
      setControl(state.customizeTab);
      setActiveGroup(state.customizeTab.label);
    }
  }, [css, state.customizeTab, cid]);

  // Watch for changes in cssTw and update the element's CSS
  useEffect(() => {
    if (state.current && cid === state.current.id && Object.keys(cssTw).length > 0) {
      let updatedCss = cleanCssClasses(allCss + ' ' + cleanCssClasses(Object.values(cssTw).join(' ')));
      updatedCss = [...new Set(updatedCss.split(' '))].join(' ');
      
      if (state.current.css.css !== updatedCss) {
        const newCurrent = {
          ...state.current,
          css: {
            ...state.current.css,
            css: updatedCss
          }
        };
        
        dispatch({
          type: 'SET_CURRENT',
          payload: newCurrent
        });
      }
    }
  }, [cssTw, cid, state.current]);

  // Watch for changes in cid (current element ID)
  useEffect(() => {
    if (cid !== state.current?.id) {
      setAllCss(css);
      setControls(null);
      setCssTw({});
    }
  }, [cid, state.current]);

  // Check if the group is enabled for the current element
  const isEnabled = (group: any) => {
    if (!state.current) return false;
    
    if (group.filter) {
      return group.filter.includes(state.current.tag);
    }
    
    return true;
  };

  // Set the active control group
  const setControl = (group: any) => {
    setActiveGroup(group.label);
    
    // Dispatch the customizeTab action
    dispatch({
      type: 'CUSTOMIZE_TAB',
      payload: group
    });
    
    setControls(group.components);
    setAllCss(state.current?.css?.css || '');
  };

  // Handle style changes
  const handleStile = (stile: string) => {
    if (state.current) {
      const newCurrent = {
        ...state.current,
        style: stile
      };
      
      dispatch({
        type: 'SET_CURRENT',
        payload: newCurrent
      });
    }
  };

  // Handle CSS class updates
  const updateCss = (classe: string) => {
    setAllCss(cleanCssClasses(allCss.replace(cleanCssClasses(classe), ' ')));
  };

  // Handle control value changes
  const handleControlChange = (attr: string, value: string) => {
    setCssTw(prev => ({
      ...prev,
      [attr]: value
    }));
  };

  // If there's no current element, don't render anything
  if (!state.current) return null;

  // Find which component to render based on the name
  const getComponent = (component: TailwindComponentProps) => {
    switch (component.name) {
      case 'Options':
        return <Options 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Checkbox':
        return <Checkbox 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Range':
        return <Range 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 negative={component.negative}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Color':
        return <Color 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Button':
        return <Button 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 icon={component.icon}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'BgGradient':
        return <BgGradient 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'BgGradientPresets':
        return <BgGradientPresets 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Width':
        return <Width 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Height':
        return <Height 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 title={component.title}
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'BgPosition':
        return <BgPosition 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'BorderColor':
        return <BorderColor 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'TextFont':
        return <TextFont 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
               />;
      case 'Position':
        return <Position 
                 key={`${component.attr}_${state.current.id}`}
                 attr={component.attr} 
                 css={cleanCssClasses(css)}
                 value={cssTw[component.attr] || ''}
                 onChange={(value) => handleControlChange(component.attr, value)}
                 onStile={handleStile}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="relative z-highest h-full">
      {state.current && (
        <div className="border-r border-b">
          {twgroups.map((group) => (
            isEnabled(group) && (
              <div 
                key={group.label}
                className={`flex items-center capitalize cursor-pointer p-2 text-gray-700 text-base ${
                  activeGroup === group.label ? 'bg-bluegray-300 text-gray-200' : ''
                }`}
                onClick={() => setControl(group)}
              >
                {group.label}
                <RiArrowRightSLine className="absolute right-0 m-1" />
              </div>
            )
          ))}
        </div>
      )}

      {controls && (
        <div className="whoobe-editor-tw-controls bg-bluegray-100 text-gray-500 border-b border-gray-900 top-0 absolute w-full z-2xtop left-0 right-0 bottom-0">
          <div 
            className="bg-indigo-500 text-white flex flex-row p-1 items-center capitalize cursor-pointer text-white"
            onClick={() => {
              setControls(null);
              dispatch({ type: 'CUSTOMIZE_TAB', payload: null });
            }}
          >
            <span>{activeGroup}</span>
            <span className="absolute right-0">✕</span>
          </div>
          
          <div className="p-2">
            {controls.map((control) => (
              <div 
                key={control.attr}
                className={`capitalize ${
                  control.group ? 'float-left my-4 mx-1' : 'p-2 flex flex-col clear-both'
                }`}
              >
                {getComponent(control)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}