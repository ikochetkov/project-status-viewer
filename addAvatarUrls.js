const fs = require('fs');
const { mockProjectsData } = require('./example/mockData.js');

// Add projectManagerImageSrc to each entry
mockProjectsData.forEach(project => {
  if (!project.projectManagerImageSrc) {
    const name = project.projectManagerName.replace(/\s+/g, '+');
    project.projectManagerImageSrc = `https://ui-avatars.com/api/?name=${name}&background=random`;
  }
});

// Write back
const output = 'export const mockProjectsData = ' + JSON.stringify(mockProjectsData, null, 4) + ';';
fs.writeFileSync('./example/mockData.js', output);
console.log('Updated mockData.js with projectManagerImageSrc for all entries');
