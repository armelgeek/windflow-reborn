'use client';

type PackageDependency = {
  version: string;
  dependencies?: Record<string, PackageDependency>;
};

type PackageTreeProps = {
  root: Record<string, PackageDependency>;
  name: string;
  onSearch: (dependency: string, version: string, name: string) => void;
};

export default function PackageTree({ root, name, onSearch }: PackageTreeProps) {
  const requestPackage = (key: string) => {
    if (root[key].hasOwnProperty('version')) {
      onSearch(key, root[key].version, name);
    } else {
      // Handle case where version is directly a string
      onSearch(key, root[key] as unknown as string, name);
    }
  };

  return (
    <div>
      <ul>
        {Object.keys(root).map((key) => (
          <li 
            key={key}
            className="list-none my-2 cursor-pointer" 
            onClick={() => requestPackage(key)} 
            title="Click to get dependencies"
          >
            <span className="pr-2 bg-indigo-400 py-2 px-2 text-black rounded-tl rounded-bl">
              {key}
            </span>
            
            {!root[key].hasOwnProperty('dependencies') ? (
              <span className="bg-blue-200 px-2 py-2 text-black rounded-tr rounded-br">
                {typeof root[key] === 'string' ? root[key] : root[key].version}
              </span>
            ) : (
              <span className="bg-blue-200 px-2 py-2 text-black rounded-tr rounded-br">
                {root[key].version}
              </span>
            )}
            
            {root[key].hasOwnProperty('dependencies') && root[key].dependencies && (
              <PackageTree 
                root={root[key].dependencies!} 
                name={name} 
                onSearch={onSearch} 
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}