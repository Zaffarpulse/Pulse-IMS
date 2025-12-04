import React from 'react';
import { Requisition, RequestStatus, Role } from '../types';
import { Check, X, FileText, Printer } from 'lucide-react';

interface Props {
  requisitions: Requisition[];
  role: Role;
  onAction: (id: string, action: 'approve' | 'reject' | 'issue' | 'print') => void;
}

export const RequisitionTable: React.FC<Props> = ({ requisitions, role, onAction }) => {
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED_ADMIN:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>;
      case RequestStatus.PENDING_ADMIN:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending Admin</span>;
      case RequestStatus.REJECTED:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Rejected</span>;
      case RequestStatus.ISSUED:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Issued / Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm no-print">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Req ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item / Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requisitions.length === 0 ? (
               <tr>
                 <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                   No requests found.
                 </td>
               </tr>
            ) : (
              requisitions.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{req.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{req.itemName}</div>
                    <div className="text-xs">{req.description || `Qty: ${req.quantity}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{req.requesterName}</div>
                    <div className="text-xs text-gray-400">{req.requesterStaffId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.departmentTarget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.dateRequested).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-3">
                      {/* Admin Actions */}
                      {role === Role.ADMIN && req.status === RequestStatus.PENDING_ADMIN && (
                        <>
                          <button onClick={() => onAction(req.id, 'approve')} className="text-green-600 hover:text-green-900" title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => onAction(req.id, 'reject')} className="text-red-600 hover:text-red-900" title="Reject">
                            <X size={18} />
                          </button>
                        </>
                      )}
                      
                      {/* Incharge Actions */}
                      {role !== Role.ADMIN && role !== Role.STAFF && req.status === RequestStatus.APPROVED_ADMIN && (
                        <button onClick={() => onAction(req.id, 'issue')} className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                          <span>Issue</span>
                          <FileText size={16} />
                        </button>
                      )}

                      {/* Print Report - Available for Completed/Issued Requests */}
                      {(req.status === RequestStatus.ISSUED) && (
                         <button onClick={() => onAction(req.id, 'print')} className="text-gray-600 hover:text-gray-900" title="Print Report">
                            <Printer size={18} />
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};