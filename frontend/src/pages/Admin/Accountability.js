import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import AccountabilityPanel from './AccountabilityPanel';

export default function Accountability() {
  return (
    <AdminLayout title="Accountability" subtitle="Track teacher attendance, topic coverage and syllabus progress.">
      <AccountabilityPanel />
    </AdminLayout>
  );
}
