import {isActiveFlag, toDisplayString, formatDateOnly} from '../helpers/formatters';
import {renderRecordLink} from '../helpers/renderHelpers';

export const renderIssuesTab = (project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle) => {
	if (!project.issues || project.issues.length === 0) {
		return (
			<div className="tab-content">
				<p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No issues found</p>
			</div>
		);
	}

	const filtered = (project.issues || []).filter(i => !showActiveOnly || isActiveFlag(i.active));
	const rows = getSortedRows(filtered, 'issues');

	return (
		<div className="tab-content">
			<div>
				{renderActiveToggle()}
				<div className="table-wrap">
					<table className="table-modern">
						<thead>
							<tr>
								{renderSortableHeader('issues', 'number', 'Number')}
								{renderSortableHeader('issues', 'short_description', 'Short description')}
								{renderSortableHeader('issues', 'impact', 'Impact')}
								{renderSortableHeader('issues', 'priority', 'Priority')}
								{renderSortableHeader('issues', 'state', 'State')}
								{renderSortableHeader('issues', 'assigned_to', 'Assigned to')}
								{renderSortableHeader('issues', 'sys_created_on', 'Created')}
								{renderSortableHeader('issues', 'due_date', 'Due date')}
							</tr>
						</thead>
						<tbody>
							{rows.map((i, idx) => (
								<tr key={idx}>
									<td>{renderRecordLink(i)}</td>
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
		</div>
	);
};
