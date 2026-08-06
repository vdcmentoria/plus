const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `                <div className="flex items-center gap-3">
                  <button className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full"><ZoomOut className="w-3.5 h-3.5"/></button>
                  <input type="range" min="50" max="150" defaultValue="100" className="w-24 accent-[#D05634] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <button className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full"><ZoomIn className="w-3.5 h-3.5"/></button>
                  <span className="text-sm text-gray-500 font-medium w-10 text-right">100%</span>
                </div>`;

const rep1 = `                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEditorZoom(prev => Math.max(50, prev - 10))}
                    className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full border border-transparent focus:outline-none"
                  >
                    <ZoomOut className="w-3.5 h-3.5"/>
                  </button>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={editorZoom} 
                    onChange={e => setEditorZoom(Number(e.target.value))}
                    className="w-24 accent-[#D05634] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <button 
                    onClick={() => setEditorZoom(prev => Math.min(150, prev + 10))}
                    className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full border border-transparent focus:outline-none"
                  >
                    <ZoomIn className="w-3.5 h-3.5"/>
                  </button>
                  <span className="text-sm text-gray-500 font-medium w-10 text-right">{editorZoom}%</span>
                </div>`;

file = file.split(target1).join(rep1);

const target2 = `className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start min-h-[400px]"`;
const rep2 = `className="grid gap-[4px] content-start min-h-[400px]"
                style={{ gridTemplateColumns: \`repeat(auto-fill, minmax(\${200 * (100 / editorZoom)}px, 1fr))\` }}`;
                
file = file.split(target2).join(rep2);

fs.writeFileSync('src/App.tsx', file);
