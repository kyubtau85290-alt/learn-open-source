export default function RequestStatusBadge({ status }) {
  const statusConfig = {
    requested: { bg: 'bg-warning', text: 'text-warning', label: 'Requested' },
    approved: { bg: 'bg-primary', text: 'text-primary', label: 'Approved' },
    rejected: { bg: 'bg-danger', text: 'text-danger', label: 'Rejected' },
    picked_up: { bg: 'bg-blue-500', text: 'text-blue-500', label: 'Picked Up' },
    returned: { bg: 'bg-secondary', text: 'text-secondary', label: 'Returned' },
    overdue: { bg: 'bg-danger', text: 'text-danger', label: 'Overdue' },
  };

  const config = statusConfig[status] || statusConfig.requested;

  return (
    <span className={`${config.bg} bg-opacity-20 ${config.text} px-3 py-1 rounded-full text-sm font-semibold`}>
      {config.label}
    </span>
  );
}
