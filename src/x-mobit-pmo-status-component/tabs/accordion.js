import {isActiveFlag} from '../helpers/formatters';
import {sortList} from '../helpers/sorting';
import {renderDetailsTab} from './detailsTab';
import {renderMilestonesTab} from './milestonesTab';
import {renderIssuesTab} from './issuesTab';
import {renderRisksTab} from './risksTab';
import {renderHistoryTab} from './historyTab';

export const renderAccordionTabs = (project, expandedRows, expandedRowsHelpers) => {
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
		<div className="accordion-content">
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
	);
};
