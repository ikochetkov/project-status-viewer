import {getPlannedEndDateValue, getApprovedEndDateValue, getDelayDays, formatDateKpi} from '../helpers/formatters';
import {renderEffortValue, renderProgressBar} from '../helpers/renderHelpers';

export const renderDetailsTab = (project) => {
	const plannedEndValue = getPlannedEndDateValue(project) || project.endDate;
	const delayDays = getDelayDays(plannedEndValue, getApprovedEndDateValue(project));
	const unapprovedHours = Number(project.time_cards_submitted_hours || 0);
	const unapprovedCls = unapprovedHours > 0 ? 'bad' : 'good';
	const unapprovedLabel = `${Number.isFinite(unapprovedHours) ? unapprovedHours : 0} h`;
	const estimatedAtCompletion = parseInt(project.x_mobit_spm_enh_effort_estimated_to_complete || 0) + parseInt(project.x_mobit_spm_enh_actual_effort || 0);

	return (
		<div className="tab-content details-content">
			<div className="kpi-baseline-banner" role="note" aria-live="polite">
				Any changes to the baseline KPIs require an approved CR
			</div>
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

						<div className="effort-kpi-grid effort-kpi-grid-3col">
							<div className="effort-kpi-grid effort-kpi-grid-planned">
								<div className="effort-kpi">
									<div className="effort-kpi-label">Planned Effort (SOW)</div>
									{renderEffortValue(project.x_mobit_spm_enh_planned_effort_sow, 'effort-kpi-value-highlighted')}
								</div>
							</div>

							<div className="effort-kpi">
								<div className="tooltip-wrapper">
									<div className="effort-kpi-label">Actual Effort</div>
									<div className="tooltip-content">Hours which have been recorded and approved</div>
								</div>
								{renderEffortValue(project.x_mobit_spm_enh_actual_effort)}
							</div>

							<div className="effort-kpi">
								<div className="tooltip-wrapper">
									<div className="effort-kpi-label">Remaining Effort</div>
									<div className="tooltip-content">Planned Effort(SOW) - Actual Hours</div>
								</div>
								{renderEffortValue(project.u_remaining_effort)}
							</div>
						</div>

						<div className="effort-divider"></div>

						<div className="effort-kpi-grid effort-kpi-grid-3col">
							<div className="effort-kpi">
								<div className="tooltip-wrapper">
									<div className="effort-kpi-label">Effort Estimated to Complete</div>
									<div className="tooltip-content">Entered by PM on Status Report page</div>
								</div>
								<div className="effort-kpi-value">
									{project.x_mobit_spm_enh_effort_estimated_to_complete
										? `${project.x_mobit_spm_enh_effort_estimated_to_complete} h`
										: '—'}
								</div>
							</div>

							<div className="effort-kpi">
								<div className="tooltip-wrapper">
									<div className="effort-kpi-label">Estimated At Completion</div>
									<div className="tooltip-content">Actual Effort + Effort Estimated to Complete</div>
								</div>
								<div className="effort-kpi-value">
									{estimatedAtCompletion ? `${estimatedAtCompletion}h` : '—'}
								</div>
							</div>
						</div>

						<div className="effort-divider"></div>

						<div className="effort-kpi-grid effort-kpi-grid-3col">
							<div className="effort-kpi">
								<div className="effort-kpi-label">Unapproved Effort</div>
								<div className="effort-kpi-value-row">
									<div className={`effort-kpi-value ${unapprovedCls}`}>{unapprovedLabel}</div>
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
							</div>

							<div className="tooltip-wrapper">
								<div className="effort-kpi">
									<div className="effort-kpi-label">Date Estimated At Completion</div>
									<div className="effort-kpi-value planned-end-row">
										<span>{formatDateKpi(plannedEndValue)}</span>
										{typeof delayDays === 'number' && delayDays > 1 && (
											<span className="delay-text">({delayDays} days delayed)</span>
										)}
									</div>
								</div>
								<div className="tooltip-content">Planned End Date from WBS level (adjusted by PM to reflect real duration)</div>
							</div>
						</div>

						<div className="effort-divider"></div>

						<div className="effort-bars">
							{renderProgressBar(
								project.effortUtilized,
								'Effort Utilized',
								'Effort Utilized = (Actual Effort / Allocated Effort) * 100'
							)}
							{renderProgressBar(
								project.u_time_elapsed,
								'Time Elapsed',
								'(Actual Duration in Workdays / Planned Duration in Workdays) * 100'
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
