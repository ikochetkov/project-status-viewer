import '../src/table-component';
import { mockProjectsData } from './mockData.js';

console.log('mockProjectsData loaded:', mockProjectsData);

const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `		
	<x-mobit-table-component></x-mobit-table-component>
`;

// Wait for component to be ready and set the projectsData property
const trySetData = () => {
	const component = document.querySelector('x-mobit-table-component');
	console.log('Looking for component:', component);
	if (component) {
		console.log('Setting projectsData on component');
		component.projectsData = mockProjectsData;
		console.log('Mock data loaded, component.projectsData:', component.projectsData);
	} else {
		console.warn('Component not found yet, retrying...');
		setTimeout(trySetData, 100);
	}
};

setTimeout(trySetData, 100);
