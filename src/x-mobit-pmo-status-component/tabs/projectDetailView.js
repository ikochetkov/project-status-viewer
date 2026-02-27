import {isActiveFlag, formatDateOnly} from '../helpers/formatters';
import {sortList} from '../helpers/sorting';
import {renderStatusWithTooltip} from '../helpers/renderHelpers';
import {renderDetailsTab} from './detailsTab';
import {renderMilestonesTab} from './milestonesTab';
import {renderIssuesTab} from './issuesTab';
import {renderRisksTab} from './risksTab';
import {renderHistoryTab} from './historyTab';

export const renderProjectDetailView = (project, expandedRows, expandedRowsHelpers, onClose) => {
	const projectNum = project.project_number;
	const activeTabKey = `${projectNum}-tab`;
	const activeTab = expandedRows[activeTabKey] || 'details';
	const activeFilterKey = `${projectNum}-activefilter`;
	const showActiveOnly = expandedRows[activeFilterKey] !== false;

	const milestonesCount = Array.isArray(project.milestones)
		? project.milestones.filter(m => !showActiveOnly || isActiveFlag(m.active)).length
		: 0;
	const issuesCount = Array.isArray(project.issues)
		? project.issues.filter(i => !showActiveOnly || isActiveFlag(i.active)).length
		: 0;
	const risksCount = Array.isArray(project.risks)
		? project.risks.filter(r => !showActiveOnly || isActiveFlag(r.active)).length
		: 0;
	const historyCount = Array.isArray(project.status_history) ? project.status_history.length : 0;

	const tabs = [
		{id: 'details', label: 'Details'},
		{id: 'milestones', label: `Milestones (${milestonesCount})`},
		{id: 'issues', label: `Issues (${issuesCount})`},
		{id: 'risks', label: `Risks (${risksCount})`},
		{id: 'history', label: `Status History (${historyCount})`}
	];

	const sortStateKey = (tabId) => `${projectNum}-${tabId}-sort`;

	const getSortState = (tabId) => {
		const current = expandedRows[sortStateKey(tabId)];
		if (current && current.key) return current;

		if (['milestones', 'issues', 'risks'].includes(tabId)) {
			return {key: 'number', dir: 'asc'};
		}

		if (tabId === 'history') {
			return {key: 'number', dir: 'desc'};
		}

		return {key: null, dir: null};
	};

	const renderSortIcon = (tabId, colKey) => {
		const s = getSortState(tabId);
		if (s.key !== colKey) return null;
		return s.dir === 'asc' ? ' ▲' : ' ▼';
	};

	const toggleSort = (tabId, colKey) => {
		const key = sortStateKey(tabId);
		const current = getSortState(tabId);
		let dir = 'asc';
		if (current.key === colKey) {
			dir = current.dir === 'asc' ? 'desc' : 'asc';
		}
		expandedRowsHelpers.updateExpanded({
			...expandedRows,
			[key]: {key: colKey, dir}
		});
	};

	const getSortedRows = (rows, tabId) => sortList(rows, getSortState(tabId));

	const renderSortableHeader = (tabId, colKey, label, extraClass) => (
		<th className={extraClass || ''}>
			<span className="th-sort" on={{click: () => toggleSort(tabId, colKey)}}>
				{label}{renderSortIcon(tabId, colKey)}
			</span>
		</th>
	);

	const renderActiveToggle = () => (
		<div className="toggle-filter">
			<span className="toggle-label">Only active</span>
			<now-toggle
				checked={showActiveOnly}
				size="sm"
				manage-checked
				configAria={{'aria-label': 'Only active'}}
				filterKey={activeFilterKey}
			></now-toggle>
		</div>
	);

	const getTabContent = (tabId) => {
		switch (tabId) {
			case 'details':
				return renderDetailsTab(project, expandedRowsHelpers);
			case 'milestones':
				return renderMilestonesTab(project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle);
			case 'issues':
				return renderIssuesTab(project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle);
			case 'risks':
				return renderRisksTab(project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle);
			case 'history':
				return renderHistoryTab(project, getSortedRows, renderSortableHeader);
			default:
				return null;
		}
	};

	return (
		<div className="project-detail-view">
			<div className="project-modal-header">
				<div className="project-modal-top-row">
					<button
						className="back-button"
						on={{click: () => onClose?.()}}
					>
						<now-icon icon="arrow-left-outline" size="sm"></now-icon>
						Back to List
					</button>
					<div className="kpi-baseline-banner" role="note">
						Any changes to the baseline KPIs require an approved CR
					</div>
				</div>
				<div className="project-modal-header-row">
					<div className="project-modal-info">
						<div className="project-modal-identity">
							<span className="project-id">{project.project_number}</span>
							{project.projectUrl && (
								<a
									href={project.projectUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="project-open-link"
									aria-label={`Open ${project.project_number} project`}
									title="Open project"
								>
									<now-icon icon="open-link-right-outline" size="sm"></now-icon>
								</a>
							)}
							{project.company && <span className="project-company">{project.company}</span>}
						</div>
						<div className="project-modal-title">{project.projectName}</div>
						<div className="project-modal-meta">
							{project.projectManagerName && (
								<div className="project-meta-item">
									<now-avatar
										aria-hidden="true"
										size="sm"
										user-name={project.projectManagerName}
										image-src={project.projectManagerImageSrc}
										interaction="none"
									></now-avatar>
									<span>{project.projectManagerName}</span>
								</div>
							)}
							{(project.startDate || project.endDate) && (
								<div className="project-meta-item tooltip-wrapper">
									<now-icon icon="calendar-outline" size="md" />
									<span>
										{project.startDate ? formatDateOnly(project.startDate) : '?'} – {project.endDate ? formatDateOnly(project.endDate) : '?'}
									</span>
									<div className="tooltip-content">Approved Start Date and Approved End Date from the Project</div>
								</div>
							)}
						</div>
					</div>
					<div className="project-modal-kpis">
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Status date</div>
							<div className="project-modal-kpi-value">
								{project.statusDate ? (
									<span className="status-date">{formatDateOnly(project.statusDate)}</span>
								) : (
									<span className="empty-state">—</span>
								)}
							</div>
						</div>
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Overall health</div>
							<div className="project-modal-kpi-value">
								{renderStatusWithTooltip(project.overallHealth, project.comments)}
							</div>
						</div>
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Cost</div>
							<div className="project-modal-kpi-value">
								{renderStatusWithTooltip(project.cost, project.cost_comments)}
							</div>
						</div>
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Scope</div>
							<div className="project-modal-kpi-value">
								{renderStatusWithTooltip(project.scope, project.scope_comments)}
							</div>
						</div>
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Schedule</div>
							<div className="project-modal-kpi-value">
								{renderStatusWithTooltip(project.schedule, project.schedule_comments)}
							</div>
						</div>
						<div className="project-modal-kpi-item">
							<div className="project-modal-kpi-label">Resources</div>
							<div className="project-modal-kpi-value">
								{renderStatusWithTooltip(project.resources, project.resource_comments)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="project-modal-body">
				<div className="tabs-header">
					{tabs.map(tab => (
						<button
							key={tab.id}
							className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
							on={{
								click: () => {
									expandedRowsHelpers.updateExpanded({
										...expandedRows,
										[activeTabKey]: tab.id
									});
								}
							}}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="tabs-body">
					{getTabContent(activeTab)}
				</div>
			</div>
		</div>
	);
};
