import {getHealthClass, cleanHtml, toDisplayString, parsePercentNumber, formatPercentLabel} from './formatters';

export const renderStatusWithTooltip = (status, tooltipText) => {
	if (!status) return <now-icon icon="ban-outline" size="lg" />;

	const tooltipContent = tooltipText ? cleanHtml(tooltipText) : null;

	return (
		<div className="tooltip-wrapper">
			<span className={`health-status ${getHealthClass(status).toLowerCase()}`}>
				<span className="health-dot"></span>
				<span className="health-text">{status}</span>
			</span>
			{tooltipContent && (
				<div className="tooltip-content">
					{tooltipContent}
				</div>
			)}
		</div>
	);
};

export const renderHealthStatus = (value) => {
	const text = toDisplayString(value);
	if (!text || text === '—') return <span className="empty-state">—</span>;
	const cls = getHealthClass(text);
	return (
		<span className={`health-status ${cls}`}>
			<span className="health-dot"></span>
			<span className="health-text">{text}</span>
		</span>
	);
};

export const renderEffortValue = (value, extraClass) => {
	if (!value) return <div className="effort-kpi-value">—</div>;
	const numValue = Number(value);
	const isNegative = Number.isFinite(numValue) && numValue < 0;
	return (
		<div className={`effort-kpi-value ${isNegative ? 'bad' : ''} ${extraClass || ''}`}>
			{`${value}h`}
		</div>
	);
};

export const renderProgressBar = (value, label, tooltipText) => {
	const num = parsePercentNumber(value);
	if (num === null) return null;
	const isOver = num > 100;
	const width = Math.min(Math.max(num, 0), 100);
	return (
		<div className="effort-bar">
			<div className="effort-bar-head">
				<span className="tooltip-wrapper">
					<span className="effort-bar-label">{label}</span>
					<span className="tooltip-content">{tooltipText}</span>
				</span>
				<div className="effort-bar-value">{formatPercentLabel(value)}</div>
			</div>
			<div className="progress-container">
				<div
					className={`progress-fill ${isOver ? 'progress-red' : 'progress-blue'}`}
					style={{width: `${width}%`}}
				></div>
			</div>
		</div>
	);
};

export const renderProgressCircle = (value, tooltipText, colorClass) => {
	const num = parsePercentNumber(value);
	if (num === null) return <span className="empty-state">—</span>;
	const isOver = num > 100;
	const width = Math.min(Math.max(num, 0), 100);
	const label = formatPercentLabel(value);
	const circleClass = colorClass || (isOver ? 'is-over' : '');
	return (
		<span className="tooltip-wrapper tooltip-anchor-right" aria-label={`${tooltipText} ${label}`}>
			<div
				className={`progress-circle progress-circle--sm ${circleClass}`}
				style={{'--p': width}}
				aria-hidden="true"
			>
				<div className="progress-circle-inner">
					<div className="progress-circle-value">{label}</div>
				</div>
			</div>
			<div className="tooltip-content">{tooltipText}</div>
		</span>
	);
};

export const renderProgressBarInline = (value) => {
	const num = parsePercentNumber(value);
	if (num === null) return <span className="empty-state">—</span>;
	const isOver = num > 100;
	const width = Math.min(Math.max(num, 0), 100);
	return (
		<div className="progress-full-width">
			<div className="progress-text-label">{formatPercentLabel(value)}</div>
			<div className="progress-container">
				<div
					className={`progress-fill ${isOver ? 'progress-red' : 'progress-blue'}`}
					style={{width: `${width}%`}}
				></div>
			</div>
		</div>
	);
};

export const renderProgressBarInlineGreen = (value) => {
	const num = parsePercentNumber(value);
	if (num === null) return <span className="empty-state">—</span>;
	const width = Math.min(Math.max(num, 0), 100);
	return (
		<div className="progress-full-width">
			<div className="progress-text-label">{formatPercentLabel(value)}</div>
			<div className="progress-container">
				<div
					className="progress-fill progress-green"
					style={{width: `${width}%`}}
				></div>
			</div>
		</div>
	);
};

export const renderRecordLink = (item) => {
	if (item.url) {
		return <a href={item.url} target="_blank" rel="noopener noreferrer">{item.number}</a>;
	}
	return item.number;
};
