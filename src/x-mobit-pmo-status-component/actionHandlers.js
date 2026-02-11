import {actionTypes} from '@servicenow/ui-core';
import {extractProjectsArray} from './helpers/sorting';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED} = actionTypes;

export const actionHandlers = {
	[COMPONENT_BOOTSTRAPPED]: ({updateState, properties}) => {
		updateState({data: extractProjectsArray(properties?.projectsData)});
	},
	[COMPONENT_PROPERTY_CHANGED]: ({action, properties, updateState}) => {
		if (action.payload.name === 'projectsData') {
			updateState({data: extractProjectsArray(properties?.projectsData)});
		}
	},
	'NOW_TOGGLE#CHECKED_SET': ({action, state, updateState}) => {
		const payload = action?.payload || {};
		const metaEvent = action?.meta?.event;
		const payloadEvent = payload?.event;
		const evt = metaEvent || payloadEvent;

		const checkedValue =
			typeof payload.value === 'boolean'
				? payload.value
				: evt?.detail?.value;

		let path = [];
		try {
			path = typeof evt?.composedPath === 'function' ? evt.composedPath() : [];
		} catch (e) {
			// composedPath not available
		}

		let elWithKey = null;
		try {
			elWithKey =
				path.find(
					(el) =>
						(el?.tagName === 'NOW-TOGGLE' || el?.nodeName === 'NOW-TOGGLE') &&
						Boolean(el?.filterKey || el?.filterkey || el?.['filterKey'] || el?.['filter-key'] || el?.getAttribute?.('filter-key'))
				) || evt?.target;
		} catch (e) {
			// path scan failed
		}

		const filterKey =
			payload?.filterKey ||
			elWithKey?.filterKey ||
			elWithKey?.filterkey ||
			elWithKey?.['filterKey'] ||
			elWithKey?.['filter-key'] ||
			elWithKey?.getAttribute?.('filter-key') ||
			evt?.target?.filterKey ||
			evt?.target?.['filterKey'] ||
			evt?.target?.getAttribute?.('filter-key');

		if (typeof checkedValue !== 'boolean' || !filterKey) return;

		updateState({
			expandedRows: {
				...(state?.expandedRows || {}),
				[filterKey]: checkedValue
			}
		});
	}
};
