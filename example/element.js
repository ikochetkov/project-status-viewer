import '../src/table-component';
import {mockProjectsData} from './mockData';

const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `		
	<x-mobit-table-component></x-mobit-table-component>
`;

// ⚠️ COMMENTED OUT for production - uncomment for local development testing
// const component = el.querySelector('x-mobit-table-component');
// if (component) {
//   component.projectsData = mockProjectsData;
// }
