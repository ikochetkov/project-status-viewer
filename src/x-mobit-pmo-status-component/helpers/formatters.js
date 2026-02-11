export const getHealthClass = (health) => {
	const classes = {
		'Green': 'green',
		'Yellow': 'yellow',
		'Red': 'red',
		'Blue': 'blue'
	};
	if (health === null || health === undefined) return 'green';
	const key = String(health).trim();
	if (classes[key]) return classes[key];
	const lower = key.toLowerCase();
	if (lower.includes('green')) return 'green';
	if (lower.includes('yellow') || lower.includes('amber')) return 'yellow';
	if (lower.includes('red')) return 'red';
	if (lower.includes('blue')) return 'blue';
	return 'green';
};

export const cleanHtml = (html) => {
	if (!html) return '';
	return html.replace(/<[^>]*>/g, '').trim();
};

export const isActiveFlag = (value) => value === true || value === 'true' || value === 1 || value === '1';

export const formatDateShortUS = (date) => {
	try {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: '2-digit',
			year: 'numeric'
		})
			.format(date)
			.replace(',', '');
	} catch (e) {
		return null;
	}
};

export const parseDateLike = (value) => {
	if (!value) return null;
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value !== 'string') return null;

	const datePart = value.split('T')[0]?.split(' ')[0];
	if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
		const [y, m, d] = datePart.split('-').map((n) => parseInt(n, 10));
		const local = new Date(y, (m || 1) - 1, d || 1);
		return Number.isNaN(local.getTime()) ? null : local;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toUtcMidnightMs = (date) => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
	return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getPlannedEndDateValue = (project) =>
	project?.end_date ||
	project?.plannedEndDate ||
	project?.planned_end_date ||
	project?.u_planned_end_date ||
	project?.u_planned_end ||
	project?.plannedEnd ||
	project?.planned_end;

export const getApprovedEndDateValue = (project) =>
	project?.endDate ||
	project?.approvedEndDate ||
	project?.approved_end_date ||
	project?.u_approved_end_date ||
	project?.u_approved_end ||
	project?.approvedEnd ||
	project?.approved_end;

export const getDelayDays = (plannedEndValue, approvedEndValue) => {
	const planned = parseDateLike(plannedEndValue);
	const approved = parseDateLike(approvedEndValue);
	if (!planned || !approved) return null;
	const plannedMs = toUtcMidnightMs(planned);
	const approvedMs = toUtcMidnightMs(approved);
	if (plannedMs === null || approvedMs === null) return null;
	return Math.round((plannedMs - approvedMs) / 86400000);
};

export const formatDateOnly = (value) => {
	if (!value) return '—';
	const parsed = parseDateLike(value);
	if (parsed) {
		return formatDateShortUS(parsed) || String(value);
	}
	return typeof value === 'string' ? value : String(value);
};

export const formatDateKpi = (value) => {
	if (!value) return '—';
	const parsed = parseDateLike(value);
	if (parsed) {
		return formatDateShortUS(parsed) || String(value);
	}
	return typeof value === 'string' ? value : String(value);
};

export const parsePercentNumber = (value) => {
	if (value === null || value === undefined || value === '') return null;
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const cleaned = value.trim().replace('%', '');
		const num = parseFloat(cleaned);
		return Number.isFinite(num) ? num : null;
	}
	return null;
};

export const formatPercentLabel = (value) => {
	if (value === null || value === undefined || value === '') return '—';
	if (typeof value === 'string') return value.includes('%') ? value : `${value}%`;
	if (typeof value === 'number') return `${value}%`;
	return String(value);
};

export const toDisplayString = (value) => {
	if (value === null || value === undefined || value === '') return '—';
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	if (typeof value === 'object') {
		return (
			value.display_value ||
			value.displayValue ||
			value.name ||
			value.label ||
			value.value ||
			'—'
		);
	}
	return String(value);
};

export const hasStatusReport = (statusReportSysID) => {
	return statusReportSysID && statusReportSysID.trim() !== '';
};
