import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ChatBot from './components/ChatBot';

import Home from './pages/Home';
import Pricing from './pages/Pricing';
import PracticeTests from './pages/PracticeTests';
import TestDetail from './pages/TestDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MentorWorkshop from './pages/MentorWorkshop';
import WomensProgram from './pages/WomensProgram';
import BecomeTutor from './pages/BecomeTutor';

import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPricing from './pages/Admin/AdminPricing';
import AdminTests from './pages/Admin/AdminTests';
import AdminLeads from './pages/Admin/AdminLeads';
import AdminPayments from './pages/Admin/AdminPayments';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminTestimonials from './pages/Admin/AdminTestimonials';
import AdminWorkshop from './pages/Admin/AdminWorkshop';
import AdminWomen from './pages/Admin/AdminWomen';
import AdminAssign from './pages/Admin/AdminAssign';
import AdminSchedule from './pages/Admin/AdminSchedule';
import AdminAnnouncements from './pages/Admin/AdminAnnouncements';

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  const { user } = useAuth();
  const isDashboard = window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin');
  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={!isDashboard ? 'page-offset' : ''}>{children}</main>
      {!isDashboard && <Footer />}
      <WhatsAppButton />
      {!isDashboard && <ChatBot />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/practice-tests" element={<PracticeTests />} />
            <Route path="/practice-tests/:id" element={<TestDetail />} />
            <Route path="/mentor-workshop" element={<MentorWorkshop />} />
            <Route path="/womens-program" element={<WomensProgram />} />
            <Route path="/become-tutor" element={<BecomeTutor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/student" element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
            <Route path="/dashboard/teacher" element={<RequireAuth role="teacher"><TeacherDashboard /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
            <Route path="/admin/pricing" element={<RequireAuth role="admin"><AdminPricing /></RequireAuth>} />
            <Route path="/admin/tests" element={<RequireAuth role="admin"><AdminTests /></RequireAuth>} />
            <Route path="/admin/leads" element={<RequireAuth role="admin"><AdminLeads /></RequireAuth>} />
            <Route path="/admin/payments" element={<RequireAuth role="admin"><AdminPayments /></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminSettings /></RequireAuth>} />
            <Route path="/admin/testimonials" element={<RequireAuth role="admin"><AdminTestimonials /></RequireAuth>} />
            <Route path="/admin/workshop" element={<RequireAuth role="admin"><AdminWorkshop /></RequireAuth>} />
            <Route path="/admin/women" element={<RequireAuth role="admin"><AdminWomen /></RequireAuth>} />
            <Route path="/admin/assign" element={<RequireAuth role="admin"><AdminAssign /></RequireAuth>} />
            <Route path="/admin/schedule" element={<RequireAuth role="admin"><AdminSchedule /></RequireAuth>} />
            <Route path="/admin/announcements" element={<RequireAuth role="admin"><AdminAnnouncements /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
