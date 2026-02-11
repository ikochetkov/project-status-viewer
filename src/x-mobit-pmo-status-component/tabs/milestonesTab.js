import {isActiveFlag, toDisplayString, formatDateOnly} from '../helpers/formatters';
import {renderRecordLink, renderProgressBarInline} from '../helpers/renderHelpers';

export const renderMilestonesTab = (project, showActiveOnly, getSortedRows, renderSortableHeader, renderActiveToggle) => {
	if (!project.milestones || project.milestones.length === 0) {
		return (
			<div className="tab-content">
				<p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No milestones found</p>
			</div>
		);
	}

	const filtered = (project.milestones || []).filter(m => !showActiveOnly || isActiveFlag(m.active));
	const rows = getSortedRows(filtered, 'milestones');

	return (
		<div className="tab-content">
			<div>
				{renderActiveToggle()}
				<div className="table-wrap">
					<table className="table-modern">
						<thead>
							<tr>
								{renderSortableHeader('milestones', 'number', 'Number')}
								{renderSortableHeader('milestones', 'short_description', 'Short description')}
								{renderSortableHeader('milestones', 'state', 'State')}
								{renderSortableHeader('milestones', 'due_date', 'Due date')}
								{renderSortableHeader('milestones', 'end_date', 'Planned end')}
								{renderSortableHeader('milestones', 'percent_complete', 'Percent Complete', 'col-progress')}
								{renderSortableHeader('milestones', 'comments', 'Comments')}
							</tr>
						</thead>
						<tbody>
							{rows.map((m, i) => (
								<tr key={i}>
									<td>{renderRecordLink(m)}</td>
									<td>{toDisplayString(m.short_description)}</td>
									<td>{toDisplayString(m.state)}</td>
									<td>{formatDateOnly(m.due_date)}</td>
									<td>{formatDateOnly(m.end_date)}</td>
									<td className="col-progress">
										{renderProgressBarInline(m.percent_complete)}
									</td>
									<td>{toDisplayString(m.comments)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
