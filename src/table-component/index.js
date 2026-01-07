import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
import '@servicenow/now-avatar';
import '@servicenow/now-toggle';
import styles from './styles.scss';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED} = actionTypes;

const getHealthClass = (health) => {
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

const cleanHtml = (html) => {
	if (!html) return '';
	// Remove HTML tags and decode entities
	return html.replace(/<[^>]*>/g, '').trim();
};

const isActiveFlag = (value) => value === true || value === 'true' || value === 1 || value === '1';

const formatDateKpi = (value) => {
	if (!value) return '—';
	const parsed = parseDateLike(value);
	if (parsed) {
		return formatDateShortUS(parsed) || String(value);
	}
	return typeof value === 'string' ? value : String(value);
};

const formatDateShortUS = (date) => {
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

const parseDateLike = (value) => {
	if (!value) return null;
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value !== 'string') return null;

	// Accept both "YYYY-MM-DD HH:mm:ss" and ISO "YYYY-MM-DDTHH:mm:ssZ"
	const datePart = value.split('T')[0]?.split(' ')[0];
	if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
		const [y, m, d] = datePart.split('-').map((n) => parseInt(n, 10));
		const local = new Date(y, (m || 1) - 1, d || 1);
		return Number.isNaN(local.getTime()) ? null : local;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toUtcMidnightMs = (date) => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
	return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

const getPlannedEndDateValue = (project) =>
	project?.end_date ||
	project?.plannedEndDate ||
	project?.planned_end_date ||
	project?.u_planned_end_date ||
	project?.u_planned_end ||
	project?.plannedEnd ||
	project?.planned_end;

const getApprovedEndDateValue = (project) =>
	project?.endDate ||
	project?.approvedEndDate ||
	project?.approved_end_date ||
	project?.u_approved_end_date ||
	project?.u_approved_end ||
	project?.approvedEnd ||
	project?.approved_end;

const getDelayDays = (plannedEndValue, approvedEndValue) => {
	const planned = parseDateLike(plannedEndValue);
	const approved = parseDateLike(approvedEndValue);
	if (!planned || !approved) return null;
	const plannedMs = toUtcMidnightMs(planned);
	const approvedMs = toUtcMidnightMs(approved);
	if (plannedMs === null || approvedMs === null) return null;
	return Math.round((plannedMs - approvedMs) / 86400000);
};

const formatDateOnly = (value) => {
	if (!value) return '—';
	const parsed = parseDateLike(value);
	if (parsed) {
		return formatDateShortUS(parsed) || String(value);
	}
	return typeof value === 'string' ? value : String(value);
};

const parsePercentNumber = (value) => {
	if (value === null || value === undefined || value === '') return null;
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const cleaned = value.trim().replace('%', '');
		const num = parseFloat(cleaned);
		return Number.isFinite(num) ? num : null;
	}
	return null;
};

const formatPercentLabel = (value) => {
	if (value === null || value === undefined || value === '') return '—';
	if (typeof value === 'string') return value.includes('%') ? value : `${value}%`;
	if (typeof value === 'number') return `${value}%`;
	return String(value);
};

const toDisplayString = (value) => {
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

const renderHealthStatus = (value) => {
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

const hasStatusReport = (statusReportSysID) => {
	const result = statusReportSysID && statusReportSysID.trim() !== '';
	return result;
};

const renderAccordionTabs = (project, expandedRows, expandedRowsHelpers) => {
	const projectNum = project.project_number;
	const activeTabKey = `${projectNum}-tab`;
	const activeTab = expandedRows[activeTabKey] || 'details';
	const activeFilterKey = `${projectNum}-activefilter`;
	const showActiveOnly = expandedRows[activeFilterKey] !== false; // default true

	// Calculate counts based on filter
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

		const getTabContent = (tabId) => {
		console.log('Project data for Details tab:', {
			project_number: project.project_number,
			executive_summary: project.executive_summary,
			achievements_last_week: project.achievements_last_week,
			key_activities_next_week: project.key_activities_next_week,
			comments: project.comments
		});
		switch(tabId) {
			case 'details':
				return (
					<div className="tab-content details-content">
							<div className="details-layout">
								<div className="details-left">
									<div className="section">
										<div className="section-title">Executive Summary</div>
										<div className="section-body" innerHTML={project.executive_summary || '—'} />
									</div>
								
									<div className="section">
										<div className="section-title">Achievements</div>
										<div className="section-body" innerHTML={project.achievements_last_week || '—'} />
									</div>
								
									<div className="section">
										<div className="section-title">Key Planned Activities</div>
										<div className="section-body" innerHTML={project.key_activities_next_week || '—'} />
									</div>
								
									<div className="section">
										<div className="section-title">Comments</div>
										<div className="section-body" innerHTML={project.comments || '—'} />
									</div>
								</div>

								<div className="details-right">
									<div className="effort-card">
										<div className="effort-card-header">
											<div className="effort-card-title">Effort Tracking</div>
											{(project.statusReportUrl || project.statusReportSysID) && (
												<a
													href={
														project.statusReportUrl ||
														`/nav_to.do?uri=project_status.do?sys_id=${project.statusReportSysID}`
													}
													target="_blank"
													rel="noopener noreferrer"
													className="status-report-link"
												>
													<span>
														Open Status Report Record{project.statusReportNumber ? ` - ${project.statusReportNumber}` : ''}
													</span>
													<now-icon icon="open-link-right-outline" size="sm"></now-icon>
												</a>
											)}
										</div>

										<div className="effort-kpi-grid effort-kpi-grid-planned">
											<div className="effort-kpi">
												<div className="effort-kpi-label">Planned Effort (SOW)</div>
												<div className="effort-kpi-value effort-kpi-value-highlighted">{project.x_mobit_spm_enh_planned_effort_sow || '—'} h</div>
											</div>
										</div>

										<div className="effort-kpi-grid">
											<div className="effort-kpi">
												<div className="tooltip-wrapper">
													<div className="effort-kpi-label">Allocated Effort</div>
													<div className="tooltip-content">SUM of hours assigned to all project participants to date</div>
												</div>
												<div className="effort-kpi-value">{project.x_mobit_spm_enh_allocated_effort || '—'} h</div>
											</div>
											<div className="effort-kpi">
												<div className="tooltip-wrapper">
													<div className="effort-kpi-label">Actual Effort</div>
													<div className="tooltip-content">Hours which have been recorded and approved</div>
												</div>
												<div className="effort-kpi-value">{project.x_mobit_spm_enh_actual_effort || '—'} h</div>
											</div>
										<div className="effort-kpi">
											<div className="tooltip-wrapper">
												<div className="effort-kpi-label">Remaining Effort</div>
												<div className="tooltip-content">Allocated Effort - Actual Effort</div>
											</div>
											{(() => {
												const value = project.u_remaining_effort;
												const numValue = Number(value);
												const isNegative = Number.isFinite(numValue) && numValue < 0;
												return (
													<div className={`effort-kpi-value ${isNegative ? 'bad' : ''}`}>
														{value || '—'} h
													</div>
												);
											})()}
										</div>
											<div className="effort-kpi">
												<div className="effort-kpi-label">Unapproved Effort</div>
												{(() => {
													const hours = Number(project.time_cards_submitted_hours || 0);
													const cls = hours > 0 ? 'bad' : 'good';
													const label = `${Number.isFinite(hours) ? hours : 0} h`;
													return (
														<div className="effort-kpi-value-row">
															<div className={`effort-kpi-value ${cls}`}>{label}</div>
															{project.time_cards_submitted_link && (
																<a
																	href={project.time_cards_submitted_link}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="effort-kpi-icon-link"
																	aria-label="Open unapproved effort time cards"
																	title="Open time cards"
																>
																	<now-icon icon="open-link-right-outline" size="sm"></now-icon>
																</a>
															)}
														</div>
													);
												})()}
											</div>
										</div>

										<div className="effort-divider"></div>

										<div className="effort-kpi-single">
											<div className="effort-kpi-label">Planned End Date</div>
												{(() => {
													const plannedEndValue = getPlannedEndDateValue(project) || project.endDate;
													const delayDays = getDelayDays(plannedEndValue, getApprovedEndDateValue(project));
													return (
														<div className="effort-kpi-value planned-end-row">
															<span>{formatDateKpi(plannedEndValue)}</span>
															{typeof delayDays === 'number' && delayDays > 1 && (
																<span className="delay-text">({delayDays} days delayed)</span>
															)}
														</div>
													);
												})()}
										</div>

										<div className="effort-divider"></div>

										<div className="effort-bars">
											{(() => {
												const val = project.effortUtilized;
												const num = parsePercentNumber(val);
												if (num === null) {
													return null;
												}
												const isOver = num > 100;
												const width = Math.min(Math.max(num, 0), 100);
												return (
													<div className="effort-bar">
														<div className="effort-bar-head">
															<span className="tooltip-wrapper">
																<span className="effort-bar-label">Effort Utilized</span>
																<span className="tooltip-content">Effort Utilized = (Actual Effort / Allocated Effort) * 100</span>
															</span>
															<div className="effort-bar-value">{formatPercentLabel(val)}</div>
														</div>
														<div className="progress-container">
															<div
																className={`progress-fill ${isOver ? 'progress-red' : 'progress-blue'}`}
																style={{width: width + '%'}}
															></div>
														</div>
													</div>
												);
											})()}

											{(() => {
												const val = project.u_time_elapsed;
												const num = parsePercentNumber(val);
												if (num === null) {
													return null;
												}
												const width = Math.min(Math.max(num, 0), 100);
												return (
													<div className="effort-bar">
														<div className="effort-bar-head">
															<span className="tooltip-wrapper">
																<span className="effort-bar-label">Time Elapsed</span>
																<span className="tooltip-content">(Actual Duration in Workdays / Planned Duration in Workdays) * 100</span>
															</span>
															<div className="effort-bar-value">{formatPercentLabel(val)}</div>
														</div>
														<div className="progress-container">
															<div className="progress-fill progress-blue" style={{width: width + '%'}}></div>
														</div>
													</div>
												);
											})()}
										</div>
									</div>
								</div>
							</div>

					</div>
				);
			case 'milestones':
				return (
					<div className="tab-content">
						{project.milestones && project.milestones.length > 0 ? (
							<div>
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
								<div className="table-wrap">
									<table className="table-modern">
									<thead>
										<tr>
											<th>Number</th>
											<th>Short description</th>
											<th>State</th>
											<th>Due date</th>
											<th>Planned end</th>
												<th className="col-progress">Percent Complete</th>
											<th>Comments</th>
										</tr>
									</thead>
									<tbody>
										{project.milestones
											.filter(m => !showActiveOnly || isActiveFlag(m.active))
											.map((m, i) => (
											<tr key={i}>
												<td>
													{m.url ? (
														<a href={m.url} target="_blank" rel="noopener noreferrer">{m.number}</a>
													) : (
														m.number
													)}
												</td>
												<td>{toDisplayString(m.short_description)}</td>
												<td>{toDisplayString(m.state)}</td>
												<td>{formatDateOnly(m.due_date)}</td>
												<td>{formatDateOnly(m.end_date)}</td>
												<td className="col-progress">
													{(() => {
														const num = parsePercentNumber(m.percent_complete);
														if (num === null) return <span className="empty-state">—</span>;
														const isOver = num > 100;
														const width = Math.min(Math.max(num, 0), 100);
														return (
															<div className="progress-full-width">
																<div className="progress-text-label">{formatPercentLabel(m.percent_complete)}</div>
																<div className="progress-container">
																	<div
																		className={`progress-fill ${isOver ? 'progress-red' : 'progress-blue'}`}
																		style={{width: width + '%'}}
																	></div>
																</div>
															</div>
														);
													})()}
												</td>
												<td>{toDisplayString(m.comments)}</td>
											</tr>
										))}
									</tbody>
									</table>
								</div>
							</div>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No milestones found</p>}
					</div>
				);
			case 'issues':
				return (
					<div className="tab-content">
						{project.issues && project.issues.length > 0 ? (
							<div>
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
								<div className="table-wrap">
									<table className="table-modern">
									<thead>
										<tr>
											<th>Number</th>
											<th>Short description</th>
											<th>Impact</th>
											<th>Priority</th>
											<th>State</th>
											<th>Assigned to</th>
											<th>Created</th>
											<th>Due date</th>
										</tr>
									</thead>
									<tbody>
										{project.issues
											.filter(i => !showActiveOnly || isActiveFlag(i.active))
											.map((i, idx) => (
											<tr key={idx}>
												<td>
													{i.url ? (
														<a href={i.url} target="_blank" rel="noopener noreferrer">{i.number}</a>
													) : (
														i.number
													)}
												</td>
												<td>{toDisplayString(i.short_description)}</td>
												<td>{toDisplayString(i.impact)}</td>
												<td>{toDisplayString(i.priority)}</td>
												<td>{toDisplayString(i.state)}</td>
												<td>{toDisplayString(i.assigned_to)}</td>
												<td>{formatDateOnly(i.sys_created_on)}</td>
												<td>{toDisplayString(i.due_date)}</td>
											</tr>
										))}
									</tbody>
									</table>
								</div>
							</div>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No issues found</p>}
					</div>
				);
			case 'risks':
				return (
					<div className="tab-content">
						{project.risks && project.risks.length > 0 ? (
							<div>
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
								<div className="table-wrap">
									<table className="table-modern">
									<thead>
										<tr>
											<th>Number</th>
											<th>Short description</th>
											<th>Risk type</th>
											<th>Impact</th>
											<th>Mitigation plan</th>
											<th>Risk state</th>
											<th>Assigned to</th>
											<th>Created</th>
											<th>Due date</th>
										</tr>
									</thead>
									<tbody>
										{project.risks
											.filter(r => !showActiveOnly || isActiveFlag(r.active))
											.map((r, idx) => (
											<tr key={idx}>
												<td>
													{r.url ? (
														<a href={r.url} target="_blank" rel="noopener noreferrer">{r.number}</a>
													) : (
														r.number
													)}
												</td>
												<td>{toDisplayString(r.short_description)}</td>
												<td>{toDisplayString(r.u_risk_issue_type)}</td>
												<td>{toDisplayString(r.impact)}</td>
												<td>{toDisplayString(r.mitigation)}</td>
												<td>{toDisplayString(r.risk_state)}</td>
												<td>{toDisplayString(r.assigned_to)}</td>
												<td>{formatDateOnly(r.sys_created_on)}</td>
												<td>{toDisplayString(r.due_date)}</td>
											</tr>
										))}
									</tbody>
									</table>
								</div>
							</div>
						) : <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No risks found</p>}
					</div>
				);
			case 'history':
				return (
					<div className="tab-content">
						{project.status_history && project.status_history.length > 0 ? (
							<div className="table-wrap">
								<table className="table-modern">
								<thead>
									<tr>
										<th>Number</th>
										<th>Date</th>
										<th>Overall Health</th>
										<th>Schedule</th>
										<th>Cost</th>
											<th>Resources</th>
											<th className="col-progress">Percent Complete</th>
											<th className="col-progress">Effort Utilized</th>
									</tr>
								</thead>
								<tbody>
									{project.status_history.map((h, idx) => (
										<tr key={idx}>
											<td>
												{h.url ? (
													<a href={h.url} target="_blank" rel="noopener noreferrer">{h.number}</a>
												) : (
													h.number
												)}
											</td>
											<td>{h.as_on}</td>
											<td>{renderHealthStatus(h.overall_health)}</td>
											<td>{renderHealthStatus(h.schedule)}</td>
											<td>{renderHealthStatus(h.cost)}</td>
											<td>{renderHealthStatus(h.resources)}</td>
											<td className="col-progress">
												{(() => {
													const num = parsePercentNumber(h.percent_complete);
													if (num === null) return <span className="empty-state">—</span>;
													const width = Math.min(Math.max(num, 0), 100);
													return (
														<div className="progress-full-width">
															<div className="progress-text-label">{formatPercentLabel(h.percent_complete)}</div>
															<div className="progress-container">
																<div
																	className="progress-fill progress-green"
																	style={{width: width + '%'}}
																></div>
															</div>
														</div>
													);
												})()}
											</td>
											<td className="col-progress">
												{(() => {
													const num = parsePercentNumber(h.u_effort_utilized);
													if (num === null) return <span className="empty-state">—</span>;
													const isOver = num > 100;
													const width = Math.min(Math.max(num, 0), 100);
													return (
														<div className="progress-full-width">
															<div className="progress-text-label">{formatPercentLabel(h.u_effort_utilized)}</div>
															<div className="progress-container">
																<div
																	className={`progress-fill ${isOver ? 'progress-red' : 'progress-blue'}`}
																	style={{width: width + '%'}}
																></div>
															</div>
														</div>
													);
												})()}
											</td>
										</tr>
									))}
								</tbody>
								</table>
							</div>
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
	let {data = [], expandedRows = {}, createSrModal = {open: false, projectSysID: null}} = state;

	const getStatusReportCreationPath = (projectSysID) =>
		`/now/workspace/project/home/sub/status-report/pm_project/${encodeURIComponent(projectSysID)}/params/page-name/status-report`;

	const openCreateSrModal = (projectSysID) => {
		if (!projectSysID) return;
		updateState({createSrModal: {open: true, projectSysID}});
	};

	const closeCreateSrModal = () => {
		updateState({createSrModal: {open: false, projectSysID: null}});
	};

	const goToStatusReportsPage = () => {
		const projectSysID = createSrModal?.projectSysID;
		if (!projectSysID) return;
		const url = getStatusReportCreationPath(projectSysID);
		closeCreateSrModal();
		try {
			window?.open?.(url, '_blank', 'noopener');
		} catch (e) {
			// no-op
		}
	};
	
	const expandedRowsHelpers = {
		updateExpanded: (newExpandedRows) => {
			updateState({expandedRows: newExpandedRows});
		}
	};

	const toggleProjectExpanded = (projectNumber) => {
		if (!projectNumber) return;
		const newExpanded = {...expandedRows};
		const wasOpen = Boolean(newExpanded[projectNumber]);
		data.forEach((row) => {
			if (row?.project_number) newExpanded[row.project_number] = false;
		});
		newExpanded[projectNumber] = !wasOpen;
		expandedRowsHelpers.updateExpanded(newExpanded);
	};
	
	return (
		<div className="table-container">
			{createSrModal?.open && (
				<div
					className="modal-backdrop"
					on={{
						click: () => {
							closeCreateSrModal();
						}
					}}
				>
					<div
						className="modal"
						on={{
							click: (e) => {
								e?.stopPropagation?.();
							}
						}}
					>
						<div className="modal-header">
							<div className="modal-title">Create Status Report</div>
							<button
								className="modal-close"
								on={{
									click: () => closeCreateSrModal()
								}}
								aria-label="Close"
								title="Close"
							>
								<now-icon icon="close-outline" size="md"></now-icon>
							</button>
						</div>
						<div className="modal-body">
							<p>
								When you click the button below, you will be navigated to the Status Report creation page.
								 On that page, click <strong>Create Status Report</strong> and select <strong>Mobiz (MSP)</strong> domain.
							</p>
							<p>
								Before creating the Status Report, please make sure these items are up to date, as they will be captured into the status report during submission:
							</p>
							<ul>
								<li>Completion %</li>
								<li>RIDAC tab</li>
								<li>Milestones</li>
								<li>Issues, Risks, and key updates</li>
							</ul>
						</div>
						<div className="modal-actions">
							<button className="btn-secondary" on={{click: () => closeCreateSrModal()}}>
								Cancel
							</button>
							<button className="btn-primary" on={{click: () => goToStatusReportsPage()}}>
								Go to Status Reports page
								<now-icon icon="open-link-right-outline" size="sm"></now-icon>
							</button>
						</div>
					</div>
				</div>
			)}
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
							<tr
								key={`row-${index}`}
								className={`project-row ${hasStatusReport(row.statusReportSysID) ? 'expandable' : ''} ${expandedRows[row.project_number] ? 'expanded' : ''}`}
								on={{
									click: (evt) => {
										if (!hasStatusReport(row.statusReportSysID)) return;
										let path = [];
										try {
											path = typeof evt?.composedPath === 'function' ? evt.composedPath() : [];
										} catch (e) {
											path = [];
										}

										const clickedLink = path.some((el) => el?.tagName === 'A' || el?.nodeName === 'A');
										const clickedButton = path.some((el) => el?.tagName === 'BUTTON' || el?.nodeName === 'BUTTON');
										if (clickedLink || clickedButton) return;
										toggleProjectExpanded(row.project_number);
									}
								}}
							>
							<td className="col-expand center">
								{hasStatusReport(row.statusReportSysID) && (
									<button
										className="expand-btn"
										on={{
											click: (evt) => {
												evt?.stopPropagation?.();
												toggleProjectExpanded(row.project_number);
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
											{row.projectUrl && (
												<a
													href={row.projectUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="project-open-link"
													aria-label={`Open ${row.project_number} project`}
													title="Open project"
												>
													<now-icon icon="open-link-right-outline" size="sm"></now-icon>
												</a>
											)}
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
													<span>
														{row.startDate ? formatDateOnly(row.startDate) : '?'} – {row.endDate ? formatDateOnly(row.endDate) : '?'}
													</span>
												</div>
											)}
										</div>
									</div>
									<div className="project-action">
										{hasStatusReport(row.statusReportSysID) ? (
											null
										) : (
												<div className="status-pending">
													<span className="status-pending-label">
														<now-icon icon="eye-slash-outline" size="md" />
														<span className="status-pending-text">NO STATUS REPORT</span>
													</span>
															<now-icon
																className="status-create-icon"
																icon="plus-outline"
																size="md"
																role="button"
																tabindex="0"
																aria-label="Create status report"
																on={{
																	click: (evt) => {
																		evt?.stopPropagation?.();
																		openCreateSrModal(row.projectSysID);
																	},
																	keydown: (evt) => {
																		const key = evt?.key;
																		if (key === 'Enter' || key === ' ') {
																			evt?.preventDefault?.();
																			evt?.stopPropagation?.();
																			openCreateSrModal(row.projectSysID);
																		}
																}
															}}
															/>
												</div>
										)}
									</div>
								</div>
							</td>
							<td className="col-status-date center">
								{row.statusDate ? (
									<span className="status-date">{formatDateOnly(row.statusDate)}</span>
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
							{(() => {
								const val = row.percentComplete;
								const num = parsePercentNumber(val);
								if (num === null) return <span className="empty-state">—</span>;
								const width = Math.min(Math.max(num, 0), 100);
								const label = formatPercentLabel(val);
								return (
									<span className="tooltip-wrapper tooltip-anchor-right" aria-label={`Percent complete ${label}`}>
										<div
											className="progress-circle progress-circle--sm is-green"
											style={{'--p': width}}
											aria-hidden="true"
										>
											<div className="progress-circle-inner">
												<div className="progress-circle-value">{label}</div>
											</div>
										</div>
										<div className="tooltip-content">Percent Complete</div>
									</span>
								);
							})()}
						</td>
						<td className="col-effort center">
							{(() => {
								const val = row.effortUtilized;
								const num = parsePercentNumber(val);
								if (num === null) return <span className="empty-state">—</span>;
								const isOver = num > 100;
								const width = Math.min(Math.max(num, 0), 100);
								const label = formatPercentLabel(val);
								return (
									<span className="tooltip-wrapper tooltip-anchor-right" aria-label={`Effort utilized ${label}`}>
										<div
											className={`progress-circle progress-circle--sm ${isOver ? 'is-over' : ''}`}
											style={{'--p': width}}
											aria-hidden="true"
										>
											<div className="progress-circle-inner">
												<div className="progress-circle-value">{label}</div>
											</div>
										</div>
										<div className="tooltip-content">Effort Utilized = (Actual Effort / Allocated Effort) * 100</div>
									</span>
								);
							})()}
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

createCustomElement('x-mobit-project-status-viewer', {
	renderer: {type: snabbdom},
	view,
	styles,
	dependencies: ['@servicenow/now-icon', '@servicenow/now-toggle'],
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
		expandedRows: {},
		createSrModal: {open: false, projectSysID: null}
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
		'NOW_TOGGLE#CHECKED_SET': ({action, state, updateState}) => {
			const prefix = '[x-mobit-table-component][NOW_TOGGLE#CHECKED_SET]';
			try {
				console.groupCollapsed(`${prefix} fired`);
				console.log('action.type:', action?.type);
				console.log('action keys:', action ? Object.keys(action) : action);
				console.log('action.payload:', action?.payload);
				console.log('action.meta:', action?.meta);
				console.log('state.expandedRows keys:', Object.keys(state?.expandedRows || {}));
				console.groupEnd();
			} catch (e) {
				console.log(prefix, 'logging error:', e);
			}

			const payload = action?.payload || {};
			const metaEvent = action?.meta?.event;
			const payloadEvent = payload?.event;
			const evt = metaEvent || payloadEvent;

			try {
				console.groupCollapsed(`${prefix} event inspection`);
				console.log('meta.event present:', Boolean(metaEvent));
				console.log('payload.event present:', Boolean(payloadEvent));
				console.log('evt.type:', evt?.type);
				console.log('evt.detail:', evt?.detail);
				console.log('evt.target:', evt?.target);
				console.groupEnd();
			} catch (e) {
				console.log(prefix, 'event logging error:', e);
			}

			const checkedValue =
				typeof payload.value === 'boolean'
					? payload.value
					: evt?.detail?.value;

			let path = [];
			try {
				path = typeof evt?.composedPath === 'function' ? evt.composedPath() : [];
			} catch (e) {
				console.log(prefix, 'composedPath() threw:', e);
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
				console.log(prefix, 'path scan threw:', e);
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

			try {
				console.groupCollapsed(`${prefix} resolved inputs`);
				console.log('checkedValue:', checkedValue, 'typeof:', typeof checkedValue);
				console.log('filterKey:', filterKey);
				console.log('elWithKey:', elWithKey);
				if (path?.length) {
					console.log('composedPath length:', path.length);
					console.log(
						'composedPath filter-key elements:',
						path
							.filter((el) => typeof el?.getAttribute === 'function')
							.map((el) => ({
								tag: el?.tagName,
								filterKey: el?.getAttribute('filter-key'),
								id: el?.id,
								className: el?.className
							}))
					);
				}
				console.groupEnd();
			} catch (e) {
				console.log(prefix, 'resolved-inputs logging error:', e);
			}

			if (typeof checkedValue !== 'boolean' || !filterKey) {
				console.warn(prefix, 'bailing: missing checkedValue or filterKey', {
					checkedValue,
					filterKey,
					payload,
				});
				return;
			}

			const before = state?.expandedRows || {};
			const after = {
				...before,
				[filterKey]: checkedValue
			};

			console.log(prefix, 'updateState expandedRows diff', {
				filterKey,
				beforeValue: before[filterKey],
				afterValue: after[filterKey]
			});

			updateState({expandedRows: after});
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
