import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED} = actionTypes;
// Hardcoded sample data matching the screenshot
const SAMPLE_DATA = [
	{
		project_number: 'PRJ0010740',
		projectSysID: '509c330e99d0d050f877fa585e6c5b7c',
		company: '',
		companySysID: null,
		projectName: 'CP1',
		projectManagerName: '',
		projectManagerSysID: null,
		startDate: 'Oct 22, 2022',
		endDate: 'Oct 23, 2022',
		percentComplete: '0%',
		statusDate: '2025-12-09',
		statusReportNumber: 'PRJSTAT0010042',
		statusReportSysID: '4c1f8e5c2b71f610fc37ff056e91bfca',
		overallHealth: 'Green',
		cost: 'Green',
		scope: 'Green',
		schedule: 'Green',
		resources: 'Green',
		effortUtilized: ''
	},
	{
		project_number: 'PRJ0010714',
		projectSysID: '646b036f41676010f8773d777a40915f',
		company: 'ACME Americas',
		companySysID: '98c37b193790200044e0bfc8bcbe5dbe',
		projectName: 'Knowledge governance process',
		projectManagerName: 'Abel Tuter',
		projectManagerSysID: '62826bf03710200044e0bfc8bcbe5df1',
		startDate: 'Dec 19, 2022',
		endDate: 'Feb 6, 2023',
		percentComplete: '50%',
		statusDate: '2025-12-10',
		statusReportNumber: 'PRJSTAT0010046',
		statusReportSysID: 'c16447a02b35ba104c23fbd56e91bf1c',
		overallHealth: 'Green',
		cost: 'Green',
		scope: 'Green',
		schedule: 'Green',
		resources: 'Green',
		effortUtilized: ''
	},
	{
		project_number: 'PRJ0010702',
		projectSysID: '774f7c6590d41010f877a7f03743b6f2',
		company: '',
		companySysID: null,
		projectName: 'IAM Service Catalog Phase 1',
		projectManagerName: '',
		projectManagerSysID: null,
		startDate: 'May 16, 2023',
		endDate: 'Dec 28, 2023',
		percentComplete: '',
		statusDate: '',
		statusReportNumber: '',
		statusReportSysID: '',
		overallHealth: '',
		cost: '',
		scope: '',
		schedule: '',
		resources: '',
		effortUtilized: ''
	}
];

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
	
	const isPropertyData = data && data.length > 0;
	const dataSource = isPropertyData ? '🔴 LIVE DATA' : '⚪ EMPTY STATE';
	
	console.log('%c🔍 VIEW FUNCTION CALLED', 'color: #06b6d4; font-weight: bold; font-size: 12px;', {
		timestamp: new Date().toLocaleTimeString(),
		stateDataLength: data?.length || 0,
		dataSource: dataSource,
		firstItem: data?.[0]?.project_number || 'N/A'
	});

	return (
		<div className="table-container">
			{data.length === 0 ? (
				<div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
					<p style={{fontSize: '14px', margin: 0}}>📊 No projects loaded</p>
					<p style={{fontSize: '12px', margin: '8px 0 0 0', color: '#aaa'}}>Waiting for data...</p>
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
													<span className="icon">👨‍💼</span>
													<span>{row.projectManagerName}</span>
												</div>
											)}
										{(row.startDate || row.endDate) && (
											<div className="project-meta-item">
												<span className="icon">📋</span>
												<span>{row.startDate || '?'} – {row.endDate || '?'}</span>
											</div>
										)}
									</div>
									</div>
									<div className="project-action">
										{hasStatusReport(row.statusDate) ? (
											<a href={`https://mobizitincdemo10.service-now.com/nav_to.do?uri=project_status.do?sys_id=${row.statusReportSysID}`} target="_blank" rel="noopener noreferrer" className="view-report-link">
												<span>📑</span>
												<span>View Status Report - {row.statusReportNumber}</span>
											</a>
										) : (
											<span className="status-pending">
												<span>📑</span>
												<span>Status report pending</span>
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
									<span className="empty-state">—</span>
								)}
							</td>
							<td className="col-metric center">
								{row.cost ? (
									<span className={`health-status ${getHealthClass(row.cost).toLowerCase()}`}>
										<span className="health-dot"></span>
										<span className="health-text">{row.cost}</span>
									</span>
								) : (
									<span className="empty-state">—</span>
								)}
							</td>
							<td className="col-metric center">
								{row.scope ? (
									<span className={`health-status ${getHealthClass(row.scope).toLowerCase()}`}>
										<span className="health-dot"></span>
										<span className="health-text">{row.scope}</span>
									</span>
								) : (
									<span className="empty-state">—</span>
								)}
							</td>
							<td className="col-metric center">
								{row.schedule ? (
									<span className={`health-status ${getHealthClass(row.schedule).toLowerCase()}`}>
										<span className="health-dot"></span>
										<span className="health-text">{row.schedule}</span>
									</span>
								) : (
									<span className="empty-state">—</span>
								)}
							</td>
							<td className="col-metric center">
								{row.resources ? (
									<span className={`health-status ${getHealthClass(row.resources).toLowerCase()}`}>
										<span className="health-dot"></span>
										<span className="health-text">{row.resources}</span>
									</span>
								) : (
									<span className="empty-state">—</span>
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
								{row.effortUtilized ? (
									<div className="progress-full-width">
										<div className="progress-text-label">{row.effortUtilized}</div>
										<div className="progress-container">
											<div className="progress-fill progress-blue" style={{width: row.effortUtilized}}></div>
										</div>
									</div>
								) : (
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

createCustomElement('x-mobit-status-report-viewer', {
	renderer: {type: snabbdom},
	view,
	styles,
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
			
			console.log('%c═══════════════════════════════════════════════', 'color: #6750a4;');
			console.log('%c🎯 COMPONENT_BOOTSTRAPPED FIRED', 'color: #6750a4; font-weight: bold; font-size: 13px;');
			console.log('%c═══════════════════════════════════════════════', 'color: #6750a4;');
			
			// Extract array from initial property
			let projectsArray = [];
			if (Array.isArray(properties?.projectsData)) {
				projectsArray = properties.projectsData;
			} else if (properties?.projectsData?.data && Array.isArray(properties.projectsData.data)) {
				projectsArray = properties.projectsData.data;
			}
			
			console.log('%c📋 Initial property data:', 'color: #6750a4;', {
				length: projectsArray.length,
				firstItem: projectsArray[0]?.project_number || 'N/A'
			});
			
			if (projectsArray.length > 0) {
				console.log('%c✅ Found ' + projectsArray.length + ' items in initial property', 'color: #188038; font-weight: bold;');
				updateState({data: projectsArray});
			}
			
			console.log('%c═══════════════════════════════════════════════', 'color: #6750a4;');
		},
		// THIS IS THE KEY: Listen to property changes like now-textarea does
		[COMPONENT_PROPERTY_CHANGED]: ({action, properties, updateState}) => {
			const {name} = action.payload;
			
			// When projectsData property changes, extract and update state
			if (name === 'projectsData') {
				console.log('%c═══════════════════════════════════════════════', 'color: #16a34a;');
				console.log('%c✅ COMPONENT_PROPERTY_CHANGED FIRED for projectsData', 'color: #16a34a; font-weight: bold; font-size: 13px;');
				console.log('%c═══════════════════════════════════════════════', 'color: #16a34a;');
				
				// Extract array from updated property
				let projectsArray = [];
				if (Array.isArray(properties?.projectsData)) {
					projectsArray = properties.projectsData;
					console.log('%c🔀 Extraction: DIRECT ARRAY', 'color: #16a34a;', projectsArray.length + ' items');
				} else if (properties?.projectsData?.data && Array.isArray(properties.projectsData.data)) {
					projectsArray = properties.projectsData.data;
					console.log('%c🔀 Extraction: WRAPPED OBJECT {data: [...]}', 'color: #16a34a;', projectsArray.length + ' items');
				}
				
				if (projectsArray.length > 0) {
					console.log('%c🎯 Updating state with ' + projectsArray.length + ' projects', 'color: #16a34a; font-weight: bold; font-size: 12px;');
					updateState({data: projectsArray});
					console.log('%c✓ State updated - component will re-render', 'color: #16a34a; font-size: 10px;');
				}
				
				console.log('%c═══════════════════════════════════════════════', 'color: #16a34a;');
			}
		},
		'UPDATE_DATA': ({updateState}, projects) => {
			console.log('%c📥 UPDATE_DATA action received', 'color: #188038; font-size: 10px;');
			updateState({data: projects});
		}
	}
});

/**
 * Project Status Viewer Component
 * Displays a table of projects with their status, health metrics, and progress
 *
 * @seismicElement x-mobit-status-report-viewer
 * @summary Table component for viewing project status and health indicators
 * @uib.label Project Status Viewer
 * @uib.icon list
 * @uib.description Displays project data with status, health metrics, and progress tracking
 * @uib.category data
 * @uib.properties projectsData
 */
