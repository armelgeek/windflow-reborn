'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useNotification } from '@/context/NotificationContext';
import { useEditor } from '@/context/EditorContext';
import { notificationActions } from '@/context/NotificationContext';

interface BlockJSEditorProps {
  options?: {
    lang?: string;
    content?: string;
  };
  onClose?: () => void;
}

export default function BlockJSEditor({ options, onClose }: BlockJSEditorProps) {
  const { state: editorState, dispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [language, setLanguage] = useState<string>(options?.lang || 'javascript');
  const [code, setCode] = useState<string>('');
  const [beautified, setBeautified] = useState<boolean>(false);
  
  // Initialize editor with content
  useEffect(() => {
    if (options?.content) {
      setCode(options.content);
      return;
    }

    // If no content provided, check for content based on language
    if (language === 'javascript' && editorState.document?.data?.javascript) {
      setCode(editorState.document.data.javascript);
    } else if (language === 'css' && editorState.document?.data?.css) {
      setCode(editorState.document.data.css);
    } else if (language === 'html' && options?.content) {
      setCode(options.content);
    } else {
      setCode('');
    }
  }, [options, language, editorState.document]);

  // Function to update code in the editor state
  const updateCode = () => {
    try {
      if (language === 'javascript') {
        if (!editorState.document.data) {
          editorState.document.data = {};
        }
        editorState.document.data.javascript = code;
        
        if (dispatch) {
          dispatch({ type: 'SET_DOCUMENT', payload: editorState.document });
        }
        
        notificationActions.showNotification(
          notificationDispatch,
          'JavaScript updated successfully',
          'success'
        );
      } else if (language === 'css') {
        if (!editorState.document.data) {
          editorState.document.data = {};
        }
        editorState.document.data.css = code;
        
        if (dispatch) {
          dispatch({ type: 'SET_DOCUMENT', payload: editorState.document });
        }
        
        notificationActions.showNotification(
          notificationDispatch,
          'CSS updated successfully',
          'success'
        );
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      notificationActions.showNotification(
        notificationDispatch,
        'Error updating code: ' + (error as Error).message,
        'error'
      );
    }
  };

  // Function to beautify HTML
  const beautifyCode = () => {
    if (language === 'html') {
      try {
       // const formattedHtml = beautifyHTML(code);
       // setCode(formattedHtml);
        setBeautified(true);
      } catch (error) {
        notificationActions.showNotification(
          notificationDispatch,
          'Error beautifying HTML: ' + (error as Error).message,
          'error'
        );
      }
    }
  };

  // Handle editor language change
  const handleLanguageChange = (lang: string) => {
    setBeautified(false);
    setLanguage(lang);
  };

  // Handle editor theme based on system theme
  const getEditorTheme = () => {
    return 'vs-light';
  };

  /**return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>
          <Tabs 
            defaultValue={language} 
            onValueChange={handleLanguageChange}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="javascript" disabled={language === 'html' && !options?.lang}>
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="css" disabled={language === 'html' && !options?.lang}>
                CSS
              </TabsTrigger>
              <TabsTrigger value="html" disabled={language !== 'html' && !options?.lang}>
                HTML
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow p-0">
        <Editor
          height="70vh"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={getEditorTheme()}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            wordWrap: 'on'
          }}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 pb-2 px-4">
        {language === 'html' && (
          <Button
            variant="outline"
            onClick={beautifyCode}
            disabled={beautified}
          >
            {beautified ? 'Beautified' : 'Beautify'}
          </Button>
        )}
        
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="default"
            onClick={updateCode}
            disabled={language === 'html'}
          >
            Update
          </Button>
        </div>
      </CardFooter>
    </Card>
  );**/
  return (
    <>
     <p>Comming soon</p>
    </>
  )
}