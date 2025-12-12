import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
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

const hasStatusReport = (statusDate) => {
	return statusDate && statusDate.trim() !== '';
};

const view = (state, {updateState}) => {
	let {data = []} = state;
	
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
							<th className="col-project">Project</th>
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
						{data.map((row, index) => (
						<tr key={index}>
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
													<now-icon icon="user-outline" size="md" />
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
										{hasStatusReport(row.statusDate) ? (
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
							{row.overallHealth ? (
								<span className={`health-status ${getHealthClass(row.overallHealth).toLowerCase()}`}>
									<span className="health-dot"></span>
									<span className="health-text">{row.overallHealth}</span>
								</span>
							) : (
								<now-icon icon="ban-outline" size="lg" />
							)}
						</td>
						<td className="col-metric center">
							{row.cost ? (
								<span className={`health-status ${getHealthClass(row.cost).toLowerCase()}`}>
									<span className="health-dot"></span>
									<span className="health-text">{row.cost}</span>
								</span>
							) : (
								<now-icon icon="ban-outline" size="lg" />
							)}
						</td>
						<td className="col-metric center">
							{row.scope ? (
								<span className={`health-status ${getHealthClass(row.scope).toLowerCase()}`}>
									<span className="health-dot"></span>
									<span className="health-text">{row.scope}</span>
								</span>
							) : (
								<now-icon icon="ban-outline" size="lg" />
							)}
						</td>
						<td className="col-metric center">
							{row.schedule ? (
								<span className={`health-status ${getHealthClass(row.schedule).toLowerCase()}`}>
									<span className="health-dot"></span>
									<span className="health-text">{row.schedule}</span>
								</span>
							) : (
								<now-icon icon="ban-outline" size="lg" />
							)}
						</td>
						<td className="col-metric center">
							{row.resources ? (
								<span className={`health-status ${getHealthClass(row.resources).toLowerCase()}`}>
									<span className="health-dot"></span>
									<span className="health-text">{row.resources}</span>
								</span>
							) : (
								<now-icon icon="ban-outline" size="lg" />
							)}
						</td>
						<td className="col-progress">
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
					<td className="col-effort">
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
						</tr>
					))}
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
		data: []
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
			
			if (projectsArray.length > 0) {
				updateState({data: projectsArray});
			}
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
				
				if (projectsArray.length > 0) {
					updateState({data: projectsArray});
				}
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
