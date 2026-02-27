import {formatDateOnly, hasStatusReport} from './helpers/formatters';
import {renderStatusWithTooltip, renderProgressCircle} from './helpers/renderHelpers';
import {renderProjectDetailView} from './tabs/projectDetailView';

export const view = (state, {updateState}) => {
	const {data = [], expandedRows = {}, createSrModal = {open: false, projectSysID: null}} = state;

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

	const toggleProjectExpanded = (projectNumber, scrollTop) => {
		if (!projectNumber) return;
		const newExpanded = {...expandedRows};
		const wasOpen = Boolean(newExpanded[projectNumber]);
		data.forEach((row) => {
			if (row?.project_number) newExpanded[row.project_number] = false;
		});
		newExpanded[projectNumber] = !wasOpen;
		if (typeof scrollTop === 'number') {
			newExpanded._savedScrollTop = scrollTop;
		}
		expandedRowsHelpers.updateExpanded(newExpanded);
		if (!wasOpen) {
			setTimeout(() => { window.scrollTo(0, 0); }, 100);
		}
	};

	const openProject = data.find(row => row?.project_number && expandedRows[row.project_number]);
	const savedScrollTop = expandedRows._savedScrollTop;

	const closeProjectModal = () => {
		if (!openProject) return;
		const newExpanded = {...expandedRows};
		newExpanded[openProject.project_number] = false;
		expandedRowsHelpers.updateExpanded(newExpanded);
	};

	return (
		<div className="table-container">
			{createSrModal?.open && (
				<div
					className="modal-backdrop"
					on={{click: () => closeCreateSrModal()}}
				>
					<div
						className="modal"
						on={{click: (e) => e?.stopPropagation?.()}}
					>
						<div className="modal-header">
							<div className="modal-title">Create Status Report</div>
							<button
								className="modal-close"
								on={{click: () => closeCreateSrModal()}}
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

			{openProject && renderProjectDetailView(openProject, expandedRows, expandedRowsHelpers, closeProjectModal)}

			<div
				className="dashboard-list"
				style={{display: openProject ? 'none' : ''}}
				hook={{
					postpatch: (oldVnode, vnode) => {
						const oldDisplay = oldVnode?.data?.style?.display;
						const newDisplay = vnode?.data?.style?.display;
						if (oldDisplay === 'none' && newDisplay !== 'none' && typeof savedScrollTop === 'number' && savedScrollTop > 0) {
							const container = vnode.elm?.parentElement;
							if (container) {
								requestAnimationFrame(() => {
									container.scrollTop = savedScrollTop;
								});
							}
						}
					}
				}}
			>
				{data.length === 0 ? (
					<div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
						<now-icon icon="cloud-slash-outline" size="xl" />
						<p style={{fontSize: '14px', margin: 0}}>No projects found using selected filters</p>
						<p style={{fontSize: '12px', margin: '8px 0 0 0', color: '#aaa'}}>Double check the data correctness ...</p>
					</div>
				) : (
					<table className="project-table">
						<thead className="project-table-header">
							<tr>
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
							{data.map((row, index) => (
								<tr
									key={`row-${index}`}
									className={`project-row ${hasStatusReport(row.statusReportSysID) ? 'expandable' : ''}`}
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
											const container = path.find(el => el?.classList?.contains?.('table-container'));
											const scrollTop = container ? container.scrollTop : 0;
											toggleProjectExpanded(row.project_number, scrollTop);
										}
									}}
								>
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
														<div className="project-meta-item tooltip-wrapper">
															<now-icon icon="calendar-outline" size="md" />
															<span>
																{row.startDate ? formatDateOnly(row.startDate) : '?'} – {row.endDate ? formatDateOnly(row.endDate) : '?'}
															</span>
															<div className="tooltip-content">Approved Start Date and Approved End Date from the Project</div>
														</div>
													)}
												</div>
											</div>
											<div className="project-action">
												{!hasStatusReport(row.statusReportSysID) && (
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
										{renderStatusWithTooltip(row.overallHealth, row.comments)}
									</td>
									<td className="col-metric center">
										{renderStatusWithTooltip(row.cost, row.cost_comments)}
									</td>
									<td className="col-metric center">
										{renderStatusWithTooltip(row.scope, row.scope_comments)}
									</td>
									<td className="col-metric center">
										{renderStatusWithTooltip(row.schedule, row.schedule_comments)}
									</td>
									<td className="col-metric center">
										{renderStatusWithTooltip(row.resources, row.resource_comments)}
									</td>
									<td className="col-progress center">
										{renderProgressCircle(row.percentComplete, 'Percent Complete', 'is-green')}
									</td>
									<td className="col-effort center">
										{renderProgressCircle(row.effortUtilized, 'Effort Utilized = (Actual Effort / Allocated Effort) * 100', '', 'tooltip-below')}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};
