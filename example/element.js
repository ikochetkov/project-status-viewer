import '../src/x-mobit-pmo-status-component';
import { mockProjectsData } from './mockData';


const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `		
	<x-mobit-pmo-status-component></x-mobit-pmo-status-component>
`;

// Mock data for local development — this file is NOT deployed to ServiceNow.
// On the instance, projectsData is provided via UI Builder data broker.
const component = el.querySelector('x-mobit-pmo-status-component');
if (component) {
  component.projectsData = mockProjectsData;
}
