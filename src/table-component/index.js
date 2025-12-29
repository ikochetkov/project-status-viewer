import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
import '@servicenow/now-avatar';
import styles from './styles.scss';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED} = actionTypes;

const getHealthClass = (health) => {
	const classes = {
		'Green': 'green',
		'Yellow': 'yellow',
		'Red': 'red',
		'Blue': 'blue'
	};
	return classes[health] || 'green'
};

const cleanHtml = (html) => {
	if (!html) return '';
	// Remove HTML tags and decode entities
	return html.replace(/<[^>]*>/g, '').trim();
};

const renderStatusWithTooltip = (status, tooltipText, statusType) => {
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

const hasStatusReport = (statusReportSysID) => {
	const result = statusReportSysID && statusReportSysID.trim() !== '';
	if (result) console.log('Has status report:', statusReportSysID);
	return result;
};

const renderAccordionTabs = (project, expandedRows, expandedRowsHelpers) => {
	const projectNum = project.project_number;
	const activeTabKey = `${projectNum}-tab`;
	const activeTab = expandedRows[activeTabKey] || 'details';

	const tabs = [
		{id: 'details', label: 'Details'},
		{id: 'milestones', label: 'Milestones'},
		{id: 'issues', label: 'Issues'},
		{id: 'risks', label: 'Risks'},
		{id: 'history', label: 'Status History'}
	];

	const getTabContent = (tabId) => {
		switch(tabId) {
			case 'details':
				return (
					<div className="tab-content details-content">
						{project.executive_summary && <p>{project.executive_summary}</p>}
						{project.achievements_last_week && <p>{project.achievements_last_week}</p>}
						{project.key_activities_next_week && <p>{project.key_activities_next_week}</p>}
						{project.comments && <p>{project.comments}</p>}
					</div>
				);
			case 'milestones':
				return (
					<div className="tab-content">
						{project.milestones && project.milestones.length > 0 ? (
							<table className="detail-table">
								<thead>
									<tr><th>Number</th><th>Description</th><th>Start Date</th><th>State</th></tr>
								</thead>
								<tbody>
									{project.milestones.map((m, i) => (
										<tr key={i}><td>{m.number}</td><td>{m.short_description}</td><td>{m.start_date}</td><td>{m.state}</td></tr>
									))}
								</tbody>
							</table>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No milestones found</p>}
					</div>
				);
			case 'issues':
				return (
					<div className="tab-content">
						{project.issues && project.issues.length > 0 ? (
							<table className="detail-table">
								<thead>
									<tr><th>Number</th><th>Description</th><th>Priority</th><th>State</th></tr>
								</thead>
								<tbody>
									{project.issues.map((i, idx) => (
										<tr key={idx}><td>{i.number}</td><td>{i.short_description}</td><td>{i.priority}</td><td>{i.state}</td></tr>
									))}
								</tbody>
							</table>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No issues found</p>}
					</div>
				);
			case 'risks':
				return (
					<div className="tab-content">
						{project.risks && project.risks.length > 0 ? (
							<table className="detail-table">
								<thead>
									<tr><th>Number</th><th>Description</th><th>Probability</th><th>State</th></tr>
								</thead>
								<tbody>
									{project.risks.map((r, idx) => (
										<tr key={idx}><td>{r.number}</td><td>{r.short_description}</td><td>{r.probability}</td><td>{r.state}</td></tr>
									))}
								</tbody>
							</table>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No risks found</p>}
					</div>
				);
			case 'history':
				return (
					<div className="tab-content">
						{project.status_history && project.status_history.length > 0 ? (
							<table className="detail-table">
								<thead>
									<tr><th>Number</th><th>Date</th><th>Overall Health</th><th>Schedule</th><th>Cost</th></tr>
								</thead>
								<tbody>
									{project.status_history.map((h, idx) => (
										<tr key={idx}><td>{h.number}</td><td>{h.as_on}</td><td>{h.overall_health}</td><td>{h.schedule}</td><td>{h.cost}</td></tr>
									))}
								</tbody>
							</table>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No status history found</p>}
					</div>
				);
			default: return null;
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
								const newExpanded = {...expandedRows};
								newExpanded[activeTabKey] = tab.id;
								expandedRowsHelpers.updateExpanded(newExpanded);
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

const view = (state, {updateState}) => {
	let {data = [], expandedRows = {}} = state;
	
	const expandedRowsHelpers = {
		updateExpanded: (newExpandedRows) => {
			updateState({expandedRows: newExpandedRows});
		}
	};
	
	return (
		<div className="table-container">
			{data.length === 0 ? (
				<div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
					<now-icon icon="cloud-slash-outline" size="xl" />
					<p style={{fontSize: '14px', margin: 0}}>No projects found using selected filters</p>
					<p style={{fontSize: '12px', margin: '8px 0 0 0', color: '#aaa'}}>Double check the data correctness ...</p>
				</div>
			) : (
				<table className="project-table">
					<thead>
						<tr>
							<th className="col-expand"></th>
							<th className="col-project">Projects ({data.length})</th>
							<th className="col-status-date">Status date</th>
							<th className="col-health center">Overall health</th>
							<th className="col-metric center">Cost</th>
							<th className="col-metric center">Scope</th>
							<th className="col-metric center">Schedule</th>
							<th className="col-metric center">Resources</th>
							<th className="col-progress center">Percent complete</th>
							<th className="col-effort center">Effort utilized</th>
						</tr>
					</thead>
					<tbody>
						{data.flatMap((row, index) => [
							<tr key={`row-${index}`}>
							<td className="col-expand center">
								{hasStatusReport(row.statusReportSysID) && (
									<button
										className="expand-btn"
										on={{
											click: () => {
												console.log('Expand button clicked for', row.project_number);
												const newExpanded = {...expandedRows};
												newExpanded[row.project_number] = !newExpanded[row.project_number];
												console.log('New expandedRows:', newExpanded);
												expandedRowsHelpers.updateExpanded(newExpanded);
											}
										}}
										style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0'}}
									>
										<now-icon icon={expandedRows[row.project_number] ? "chevron-down-outline" : "chevron-right-outline"} size="md"></now-icon>
									</button>
								)}
							</td>
							<td className="col-project">
								<div className="project-info">
									<div className="project-details">
										<div className="project-header">
											<span className="project-id">{row.project_number}</span>
											{row.company && <span className="project-company">{row.company}</span>}
										</div>
										<div className="project-name">{row.projectName}</div>
									<div className="project-meta">
										{row.projectManagerName && (
											<div className="project-meta-item">
												<now-avatar 
													aria-hidden="true" 
													size="sm" 
													user-name={row.projectManagerName} 
													image-src={row.projectManagerImageSrc}
													interaction="none"
												></now-avatar>
												<span>{row.projectManagerName}</span>
											</div>
										)}
										{(row.startDate || row.endDate) && (
											<div className="project-meta-item">
												<now-icon icon="calendar-outline" size="md" />
												<span>{row.startDate || '?'} – {row.endDate || '?'}</span>
											</div>
										)}
									</div>
									</div>
									<div className="project-action">
										{hasStatusReport(row.statusReportSysID) ? (
											<a href={`/nav_to.do?uri=project_status.do?sys_id=${row.statusReportSysID}`} target="_blank" rel="noopener noreferrer" className="view-report-link">
												<now-icon icon="document-outline" size="md" />
												<span>View Status Report - {row.statusReportNumber}</span>
											</a>
										) : (
											<span className="status-pending">
												<now-icon icon="eye-slash-outline" size="md" />
												<span style={{color: "red", fontWeight: "bold"}}>NO STATUS REPORT</span>
											</span>
										)}
									</div>
								</div>
							</td>
							<td className="col-status-date center">
								{row.statusDate ? (
									<span className="status-date">{row.statusDate}</span>
								) : (
									<span className="empty-state">—</span>
								)}
							</td>
						<td className="col-health center">
							{renderStatusWithTooltip(row.overallHealth, row.comments, 'overall')}
						</td>
						<td className="col-metric center">
							{renderStatusWithTooltip(row.cost, row.cost_comments, 'cost')}
						</td>
						<td className="col-metric center">
							{renderStatusWithTooltip(row.scope, row.scope_comments, 'scope')}
						</td>
						<td className="col-metric center">
							{renderStatusWithTooltip(row.schedule, row.schedule_comments, 'schedule')}
						</td>
						<td className="col-metric center">
							{renderStatusWithTooltip(row.resources, row.resource_comments, 'resources')}
						</td>
						<td className="col-progress center">
							{row.percentComplete ? (
								<div className="progress-full-width">
									<div className="progress-text-label">{row.percentComplete}</div>
									<div className="progress-container">
										<div className="progress-fill progress-green" style={{width: row.percentComplete}}></div>
									</div>
								</div>
							) : (
								<span className="empty-state">—</span>
							)}
						</td>
					<td className="col-effort center">
						{row.effortUtilized ? (() => {
							const effortValue = parseFloat(row.effortUtilized);
							const isOverUtilized = effortValue > 100;
							return (
								<div className="progress-full-width">
									<div className="progress-text-label">{row.effortUtilized}</div>
									<div className="progress-container">
										<div className={`progress-fill ${isOverUtilized ? 'progress-red' : 'progress-blue'}`} style={{width: Math.min(effortValue, 100) + '%'}}></div>
									</div>
								</div>
							);
						})() : (
							<span className="empty-state">—</span>
						)}
					</td>
						</tr>,
						...(hasStatusReport(row.statusReportSysID) && expandedRows[row.project_number] ? [
							<tr key={`expand-${index}`} className="accordion-row">
								<td colSpan="10">
									{renderAccordionTabs(row, expandedRows, expandedRowsHelpers)}
								</td>
							</tr>
						] : [])
					])}
				</tbody>
				</table>
			)}
		</div>
	);
};

createCustomElement('x-mobit-table-component', {
	renderer: {type: snabbdom},
	view,
	styles,
	dependencies: ['@servicenow/now-icon'],
	properties: {
		/**
		 * @uib.label Projects Data
		 * @uib.description Array of project data from data broker
		 */
		projectsData: {
			default: []
		}
	},
	initialState: {
		data: [],
		expandedRows: {}
	},
	handlers: {},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {updateState, properties} = coeffects;
			
			// Extract array from initial property
			let projectsArray = [];
			if (Array.isArray(properties?.projectsData)) {
				projectsArray = properties.projectsData;
			} else if (properties?.projectsData?.data && Array.isArray(properties.projectsData.data)) {
				projectsArray = properties.projectsData.data;
			}
			
			// Always update state
			updateState({data: projectsArray});
		},
		// THIS IS THE KEY: Listen to property changes like now-textarea does
		[COMPONENT_PROPERTY_CHANGED]: ({action, properties, updateState}) => {
			const {name} = action.payload;
			
			// When projectsData property changes, extract and update state
			if (name === 'projectsData') {
				// Extract array from updated property
				let projectsArray = [];
				if (Array.isArray(properties?.projectsData)) {
					projectsArray = properties.projectsData;
				} else if (properties?.projectsData?.data && Array.isArray(properties.projectsData.data)) {
					projectsArray = properties.projectsData.data;
				}
				
				// Always update state to ensure rendering
				updateState({data: projectsArray});
			}
		},
		'UPDATE_DATA': ({updateState}, projects) => {
			updateState({data: projects});
		}
	}
});

/**
 * Project Status Viewer Component
 * Displays a table of projects with their status, health metrics, and progress
 *
 * @seismicElement x-mobit-table-component
 * @summary Table component for viewing project status and health indicators
 * @uib.label Project Status Viewer
 * @uib.icon list
 * @uib.description Displays project data with status, health metrics, and progress tracking
 * @uib.category data
 * @uib.properties projectsData
 */
