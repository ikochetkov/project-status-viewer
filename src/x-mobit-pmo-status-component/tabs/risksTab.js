import {isActiveFlag, toDisplayString, formatDateOnly} from '../helpers/formatters';
import {renderRecordLink} from '../helpers/renderHelpers';

export const renderRisksTab = (project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle) => {
	if (!project.risks || project.risks.length === 0) {
		return (
			<div className="tab-content">
				<p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No risks found</p>
			</div>
		);
	}

	const filtered = (project.risks || []).filter(r => !showActiveOnly || isActiveFlag(r.active));
	const rows = getSortedRows(filtered, 'risks');

	return (
		<div className="tab-content">
			<div>
				{renderActiveToggle()}
				<div className="table-wrap">
					<table className="table-modern">
						<thead>
							<tr>
								{renderSortableHeader('risks', 'number', 'Number')}
								{renderSortableHeader('risks', 'short_description', 'Short description')}
								{renderSortableHeader('risks', 'u_risk_issue_type', 'Risk type')}
								{renderSortableHeader('risks', 'impact', 'Impact')}
								{renderSortableHeader('risks', 'mitigation', 'Mitigation plan')}
								{renderSortableHeader('risks', 'risk_state', 'Risk state')}
								{renderSortableHeader('risks', 'assigned_to', 'Assigned to')}
								{renderSortableHeader('risks', 'sys_created_on', 'Created')}
								{renderSortableHeader('risks', 'due_date', 'Due date')}
							</tr>
						</thead>
						<tbody>
							{rows.map((r, idx) => (
								<tr key={idx}>
									<td>{renderRecordLink(r)}</td>
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
		</div>
	);
};
