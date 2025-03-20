
'use client';

interface HelpDocsModalProps {
  options?: any;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function HelpDocsModal({ onClose }: HelpDocsModalProps) {
  const categories = {
    'Getting Started': [
      {
        id: 1,
        title: 'Introduction',
        content: `
          <h2>Welcome to Whoobe UI Builder</h2>
          <p>Whoobe is a powerful, flexible UI builder for creating modern web interfaces using Tailwind CSS.</p>
          <p>You can create templates, components, and entire pages with a visual editor, and export your work as clean HTML/CSS or React components.</p>
          <p>This guide will help you get started with the basic concepts and features of Whoobe.</p>
        `
      },
      {
        id: 2,
        title: 'Interface Overview',
        content: `
          <h2>Understanding the Whoobe Interface</h2>
          <p>The Whoobe interface consists of several key areas:</p>
          <ul>
            <li><strong>Dashboard</strong>: Your starting point, where you can access templates and UI kits.</li>
            <li><strong>Editor</strong>: The main workspace where you build and edit your designs.</li>
            <li><strong>Left Sidebar</strong>: Contains tools for navigation and creating new content.</li>
            <li><strong>Right Sidebar</strong>: Shows properties and customization options for selected elements.</li>
            <li><strong>Tabs</strong>: Allow you to work on multiple projects simultaneously.</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Creating Your First Template',
        content: `
          <h2>Creating Your First Template</h2>
          <ol>
            <li>From the Dashboard, click <strong>New Template</strong> or use the <strong>+</strong> button in the sidebar.</li>
            <li>Choose between an <strong>Empty Template</strong> or a <strong>Default Template</strong> with basic structure.</li>
            <li>Give your template a name and click <strong>Create</strong>.</li>
            <li>Use the editor to add elements from the Element Gallery.</li>
            <li>Customize your elements using the Properties panel in the right sidebar.</li>
            <li>Save your work using the Save button in the footer.</li>
          </ol>
        `
      }
    ],
    'Elements': [
      {
        id: 1,
        title: 'Block Types',
        content: `
          <h2>Understanding Block Types</h2>
          <p>Whoobe uses different types of blocks to build interfaces:</p>
          <ul>
            <li><strong>Container Blocks</strong>: Grid and Flexbox containers that hold other elements</li>
            <li><strong>Text Blocks</strong>: Headings, paragraphs, and inline text</li>
            <li><strong>Media Blocks</strong>: Images, videos, sliders</li>
            <li><strong>Form Blocks</strong>: Input fields, buttons, and other form elements</li>
            <li><strong>Special Blocks</strong>: Icons, iframes, and other special elements</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Element Properties',
        content: `
          <h2>Customizing Element Properties</h2>
          <p>Each element has properties that can be customized:</p>
          <ul>
            <li><strong>Content</strong>: Text, images, links</li>
            <li><strong>Style</strong>: Colors, typography, spacing</li>
            <li><strong>Layout</strong>: Position, dimensions, flex properties</li>
            <li><strong>Tailwind Classes</strong>: Apply Tailwind utility classes directly</li>
            <li><strong>Events</strong>: Animations and interactions</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Using the Element Gallery',
        content: `
          <h2>Working with the Element Gallery</h2>
          <p>The Element Gallery provides quick access to commonly used elements:</p>
          <ol>
            <li>Open the Element Gallery by clicking the <strong>+</strong> button in the editor.</li>
            <li>Browse elements by category or use the search function.</li>
            <li>Drag elements onto the canvas or click to add them to the selected container.</li>
            <li>Use the Properties panel to customize the element's appearance and behavior.</li>
          </ol>
        `
      }
    ],
    'UI Kits': [
      {
        id: 1,
        title: 'Using UI Kits',
        content: `
          <h2>Working with UI Kits</h2>
          <p>UI Kits are collections of pre-designed components that can be used in your projects:</p>
          <ul>
            <li>Access UI Kits from the Dashboard or sidebar</li>
            <li>Browse components by category</li>
            <li>Click a component to add it to your template</li>
            <li>Customize the component to match your design</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Creating UI Kits',
        content: `
          <h2>Creating Your Own UI Kits</h2>
          <p>You can create your own UI Kits to reuse components across projects:</p>
          <ol>
            <li>Click the UI Kit button in the sidebar</li>
            <li>Click "Create UI Kit" and provide a name and description</li>
            <li>Design components and add them to your UI Kit</li>
            <li>Export your UI Kit to share with others</li>
            <li>Import UI Kits from other designers</li>
          </ol>
        `
      },
      {
        id: 3,
        title: 'Managing UI Kits',
        content: `
          <h2>Managing Your UI Kits</h2>
          <p>Organize and manage your UI Kits effectively:</p>
          <ul>
            <li>Export UI Kits to share with others</li>
            <li>Import UI Kits created by other designers</li>
            <li>Organize components into categories</li>
            <li>Update existing components</li>
            <li>Create component variants</li>
          </ul>
        `
      }
    ],
    'Tailwind CSS': [
      {
        id: 1,
        title: 'Working with Tailwind',
        content: `
          <h2>Working with Tailwind CSS</h2>
          <p>Whoobe uses Tailwind CSS as its styling framework:</p>
          <ul>
            <li>Every element's style is controlled with Tailwind utility classes</li>
            <li>Use the Style panel to apply Tailwind classes visually</li>
            <li>Edit classes directly in the CSS panel</li>
            <li>Preview responsive designs with different screen size options</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Tailwind Controls',
        content: `
          <h2>Using Tailwind Controls</h2>
          <p>Whoobe provides visual controls for common Tailwind properties:</p>
          <ul>
            <li><strong>Typography</strong>: Font size, weight, spacing, alignment</li>
            <li><strong>Colors</strong>: Background, text, borders, gradients</li>
            <li><strong>Layout</strong>: Flexbox, Grid, positioning</li>
            <li><strong>Spacing</strong>: Padding, margin, gap</li>
            <li><strong>Effects</strong>: Shadows, rounded corners, opacity</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Responsive Design',
        content: `
          <h2>Creating Responsive Designs</h2>
          <p>Use Tailwind's responsive utilities to create designs that work on all screen sizes:</p>
          <ol>
            <li>Select an element to edit</li>
            <li>Choose a screen size breakpoint (sm, md, lg, xl, 2xl)</li>
            <li>Apply Tailwind classes specific to that breakpoint</li>
            <li>Preview your design at different screen sizes</li>
            <li>Test responsive behavior before exporting</li>
          </ol>
        `
      }
    ],
    'Exporting': [
      {
        id: 1,
        title: 'Export Options',
        content: `
          <h2>Export Options</h2>
          <p>Whoobe provides multiple ways to export your work:</p>
          <ul>
            <li><strong>HTML/CSS</strong>: Export clean, optimized HTML and CSS</li>
            <li><strong>React Components</strong>: Export as React components</li>
            <li><strong>Templates</strong>: Save as reusable templates</li>
            <li><strong>UI Kits</strong>: Export components as UI Kits</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Export Settings',
        content: `
          <h2>Export Settings</h2>
          <p>Customize your exports with these settings:</p>
          <ul>
            <li><strong>Optimization</strong>: PurgeCSS to remove unused styles</li>
            <li><strong>Assets</strong>: Include or exclude images and fonts</li>
            <li><strong>Animations</strong>: Include GSAP animations</li>
            <li><strong>Dependencies</strong>: Include necessary libraries</li>
            <li><strong>SEO</strong>: Add meta tags and descriptions</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Integration Options',
        content: `
          <h2>Integration Options</h2>
          <p>Integrate your exports with various frameworks and platforms:</p>
          <ul>
            <li><strong>Static Sites</strong>: Use with any static site generator</li>
            <li><strong>React/Next.js</strong>: Import components directly</li>
            <li><strong>WordPress</strong>: Use with WordPress themes</li>
            <li><strong>CMS Integration</strong>: Connect with headless CMS systems</li>
          </ul>
        `
      }
    ],
    'Keyboard Shortcuts': [
      {
        id: 1,
        title: 'Editor Shortcuts',
        content: `
          <h2>Editor Keyboard Shortcuts</h2>
          <table class="border-collapse w-full">
            <thead>
              <tr>
                <th class="border p-2 text-left">Shortcut</th>
                <th class="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border p-2">Alt+R</td><td class="border p-2">Remove selected block</td></tr>
              <tr><td class="border p-2">Alt+D</td><td class="border p-2">Duplicate selected block</td></tr>
              <tr><td class="border p-2">Alt+C</td><td class="border p-2">Copy selected block</td></tr>
              <tr><td class="border p-2">Alt+V</td><td class="border p-2">Paste block</td></tr>
              <tr><td class="border p-2">Alt+G</td><td class="border p-2">Copy block CSS</td></tr>
              <tr><td class="border p-2">Alt+H</td><td class="border p-2">Paste CSS</td></tr>
              <tr><td class="border p-2">Alt+Z</td><td class="border p-2">Customize block</td></tr>
              <tr><td class="border p-2">Alt+A</td><td class="border p-2">Animate block</td></tr>
              <tr><td class="border p-2">Alt++</td><td class="border p-2">Add block</td></tr>
              <tr><td class="border p-2">Alt+N</td><td class="border p-2">Preview</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 2,
        title: 'Navigation Shortcuts',
        content: `
          <h2>Navigation Keyboard Shortcuts</h2>
          <table class="border-collapse w-full">
            <thead>
              <tr>
                <th class="border p-2 text-left">Shortcut</th>
                <th class="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border p-2">Alt+1</td><td class="border p-2">Add Grid</td></tr>
              <tr><td class="border p-2">Alt+2</td><td class="border p-2">Add Flexbox</td></tr>
              <tr><td class="border p-2">Alt+3</td><td class="border p-2">Add Heading</td></tr>
              <tr><td class="border p-2">Alt+4</td><td class="border p-2">Add Paragraph</td></tr>
              <tr><td class="border p-2">Alt+5</td><td class="border p-2">Add Inline Text</td></tr>
              <tr><td class="border p-2">Alt+6</td><td class="border p-2">Add Image</td></tr>
              <tr><td class="border p-2">Alt+7</td><td class="border p-2">Add Button</td></tr>
              <tr><td class="border p-2">Alt+K</td><td class="border p-2">Show Keyboard Shortcuts</td></tr>
              <tr><td class="border p-2">Alt+L</td><td class="border p-2">Block Link Dialog</td></tr>
              <tr><td class="border p-2">Alt+<</td><td class="border p-2">CSS Block</td></tr>
            </tbody>
          </table>
        `
      }
    ]
  };

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <div className="w-full">
        {/**<Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-900/20 p-1">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-purple-700 shadow'
                      : 'text-purple-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                <div className="flex h-full">
                  <div className="w-1/4 border-r pr-4">
                    <ul className="space-y-2">
                      {posts.map((post) => (
                        <li
                          key={post.id}
                          className="cursor-pointer rounded-md p-2 hover:bg-purple-100"
                          onClick={() => {
                            const element = document.getElementById(`post-${post.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          {post.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-3/4 pl-4 space-y-8">
                    {posts.map((post) => (
                      <div key={post.id} id={`post-${post.id}`} className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
        **/}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}