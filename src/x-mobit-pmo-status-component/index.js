import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
import '@servicenow/now-avatar';
import '@servicenow/now-toggle';
import styles from './styles.scss';
import {view} from './view';
import {actionHandlers} from './actionHandlers';

createCustomElement('x-mobit-pmo-status-component', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		projectsData: {
			default: [],
			schema: {type: 'array'}
		}
	},
	initialState: {
		data: [],
		expandedRows: {},
		createSrModal: {open: false, projectSysID: null}
	},
	actionHandlers
});
