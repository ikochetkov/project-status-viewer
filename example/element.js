import '../src/table-component';

const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `		
	<x-mobit-table-component></x-mobit-table-component>
`;

const component = el.querySelector('x-mobit-table-component');
if (component) {
	// Intentionally not wiring mock data by default.
	// Provide `projectsData` from your real integration layer when needed.
}
