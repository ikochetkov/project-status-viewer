import {parseDateLike, parsePercentNumber} from './formatters';

const getValueForSort = (item, key) => {
	if (!item) return null;
	const v = item[key];
	if (v === null || v === undefined) return null;

	if (/date|due|created|as_on|start|end/i.test(key)) {
		const d = parseDateLike(v);
		return d ? d.getTime() : String(v).toLowerCase();
	}

	if (/percent|utilized|complete|effort/i.test(key)) {
		const n = parsePercentNumber(v);
		return n === null ? String(v).toLowerCase() : n;
	}

	if (typeof v === 'number') return v;

	return String(v).toLowerCase();
};

export const sortList = (list = [], sortState) => {
	if (!sortState?.key) return Array.isArray(list) ? list.slice() : [];

	const arr = Array.isArray(list) ? list.slice() : [];

	arr.sort((a, b) => {
		const va = getValueForSort(a, sortState.key);
		const vb = getValueForSort(b, sortState.key);

		if (va === vb) return 0;
		if (va === null || va === undefined) return 1;
		if (vb === null || vb === undefined) return -1;

		if (typeof va === 'number' && typeof vb === 'number') {
			return sortState.dir === 'asc' ? va - vb : vb - va;
		}

		return sortState.dir === 'asc'
			? va > vb ? 1 : -1
			: va > vb ? -1 : 1;
	});

	return arr;
};

export const extractProjectsArray = (projectsData) => {
	if (Array.isArray(projectsData)) return projectsData;
	if (projectsData?.data && Array.isArray(projectsData.data)) return projectsData.data;
	return [];
};
