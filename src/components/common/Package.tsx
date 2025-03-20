'use client';

import { useState } from 'react';
import PackageTree from './PackageTree';
import { useNotification } from '@/context/NotificationContext';

type PackageData = {
  name: string;
  version: string;
  dependencies?: Record<string, { version: string; dependencies?: any }>;
};

export default function Package() {
  const { dispatch: notificationDispatch } = useNotification();
  const [npmPackage, setNpmPackage] = useState<{
    name: string;
    version: string;
    data: PackageData | null;
  }>({
    name: 'socket.io',
    version: '',
    data: null
  });
  const [loadData, setLoadData] = useState(false);
  const [error, setError] = useState('');
  const [viewPre, setViewPre] = useState(false);

  // Handle package info fetch
  const packageInfo = async () => {
    // Validate inputs
    if (npmPackage.name.length < 2 || npmPackage.version.length < 2) {
      setError('Package name / version not valid');
      return;
    }
    
    setError('');
    setNpmPackage(prev => ({ ...prev, data: {} }));
    setLoadData(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/npmregistry?name=${npmPackage.name}&version=${npmPackage.version}`
      );
      
      const data = await response.json();
      setNpmPackage(prev => ({ ...prev, data }));
    } catch (error) {
      console.error(error);
      setError('Failed to fetch package information');
    } finally {
      setLoadData(false);
    }
  };

  // Handle dependency info fetch
  const dependencyInfo = async (dependency: string, version: string, name: string) => {
    setLoadData(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/npmregistry?name=${dependency}&version=${version}`
      );
      
      const data = await response.json();
      
      // Update the dependency in the nested structure
      if (npmPackage.data && npmPackage.data.dependencies && npmPackage.data.dependencies[name]) {
        const updatedData = { ...npmPackage.data };
        if (!updatedData.dependencies![name].dependencies) {
          updatedData.dependencies![name].dependencies = {};
        }
        
        updatedData.dependencies![name].dependencies![dependency] = { 
          version, 
          dependencies: data.dependencies 
        };
        
        setNpmPackage(prev => ({ ...prev, data: updatedData }));
      }
    } catch (error) {
      console.error(error);
      notificationDispatch({ 
        type: 'SHOW_NOTIFICATION', 
        payload: { message: 'Failed to fetch dependency information', type: 'error' } 
      });
    } finally {
      setLoadData(false);
    }
  };

  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Package Dependencies</h2>
      
      <div className="flex flex-row items-center my-5">
        <label className="mr-2">Package</label>
        <input 
          className="dark text-base p-2 border rounded mr-2" 
          type="text" 
          value={npmPackage.name}
          onChange={(e) => setNpmPackage(prev => ({ ...prev, name: e.target.value }))}
          placeholder="socket.io, vue, nuxt, express"
        />
        
        <label className="mr-2">Version</label>
        <input 
          className="ml-2 dark text-base p-2 border rounded mr-2" 
          type="text" 
          value={npmPackage.version}
          onChange={(e) => setNpmPackage(prev => ({ ...prev, version: e.target.value }))}
          placeholder="version"
        />
        
        <button 
          className="lg success p-2 bg-green-500 text-white rounded"
          onClick={packageInfo}
        >
          {!loadData ? (
            <span>GO</span>
          ) : (
            <div className="w-4 h-4 animate-spin">|</div>
          )}
        </button>
        
        {npmPackage.data && (
          <button 
            className="lg p-2 bg-blue-500 text-white rounded ml-2"
            onClick={() => setViewPre(!viewPre)}
          >
            {!viewPre ? <span>View Data Object</span> : <span>View Tree</span>}
          </button>
        )}
      </div>
      
      {error && (
        <div className="w-full text-center m-4 text-base text-red-400">
          {error}
        </div>
      )}
      
      {npmPackage.data && npmPackage.data.dependencies && !viewPre && (
        <div className="flex flex-col border-b mt-4">
          <ul>
            {Object.keys(npmPackage.data.dependencies).map((key) => (
              <li className="list-none my-4" key={key}>
                <span className="px-2 pr-4 py-2 bg-black text-white text-base rounded-tl rounded-bl">
                  {key}
                </span>
                <span className="px-2 py-2 bg-gray-400 text-base text-black rounded-tr rounded-br">
                  {npmPackage.data!.dependencies![key].version}
                </span>
                
                {npmPackage.data.dependencies[key].dependencies && 
                Object.keys(npmPackage.data.dependencies[key].dependencies!).length > 0 && (
                  <div className="ml-4">
                    <PackageTree 
                      root={npmPackage.data.dependencies[key].dependencies!}
                      name={key}
                      onSearch={dependencyInfo}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {npmPackage.data && viewPre && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(npmPackage.data, null, 2)}
        </pre>
      )}
      
      {loadData && (
        <div className="fixed z-10 top-0 right-0 m-2 animate-spin text-3xl">|</div>
      )}
    </div>
  );
}