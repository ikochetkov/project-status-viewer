import {renderHealthStatus, renderProgressBarInline, renderProgressBarInlineGreen, renderRecordLink} from '../helpers/renderHelpers';

export const renderHistoryTab = (project, getSortedRows, renderSortableHeader) => {
	if (!project.status_history || project.status_history.length === 0) {
		return (
			<div className="tab-content">
				<p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No status history found</p>
			</div>
		);
	}

	const rows = getSortedRows(project.status_history, 'history');

	return (
		<div className="tab-content">
			<div className="table-wrap">
				<table className="table-modern">
					<thead>
						<tr>
							{renderSortableHeader('history', 'number', 'Number')}
							{renderSortableHeader('history', 'as_on', 'Date')}
							<th>Overall Health</th>
							<th>Schedule</th>
							<th>Cost</th>
							<th>Resources</th>
							<th className="col-progress">Percent Complete</th>
							<th className="col-progress">Effort Utilized</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((h, idx) => (
							<tr key={idx}>
								<td>{renderRecordLink(h)}</td>
								<td>{h.as_on}</td>
								<td>{renderHealthStatus(h.overall_health)}</td>
								<td>{renderHealthStatus(h.schedule)}</td>
								<td>{renderHealthStatus(h.cost)}</td>
								<td>{renderHealthStatus(h.resources)}</td>
								<td className="col-progress">
									{renderProgressBarInlineGreen(h.percent_complete)}
								</td>
								<td className="col-progress">
									{renderProgressBarInline(h.u_effort_utilized)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
