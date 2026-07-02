import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiRefreshCw, FiDollarSign, FiPackage, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminReports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<any>({
    totalIncomes: 0,
    productSales: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders/report');
      setReportData(res.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch sales report data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchReportData();
  }, [user, navigate]);

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF() as any;

      // Add branding header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(139, 92, 246); // Violet Accent
      doc.text('PrintLabs LK', 14, 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('Premium 3D Models & Printing Solutions', 14, 26);
      doc.text('Yakkala, Sri Lanka | 072 287 6497', 14, 31);
      
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('MONTHLY BUSINESS PERFORMANCE REPORT', 14, 45);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report Period: Current Month`, 14, 51);
      doc.text(`Generated Date: ${new Date().toLocaleDateString('en-LK')}`, 14, 56);
      doc.line(14, 60, 196, 60);

      // Summary statistics
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Performance Summary', 14, 70);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const totalUnits = reportData.productSales.reduce((sum: number, p: any) => sum + p.quantity, 0);
      doc.text(`Total Gross Revenue: LKR ${reportData.totalIncomes.toLocaleString()}/=`, 14, 78);
      doc.text(`Total Units / STL Files Sold: ${totalUnits} units`, 14, 84);
      doc.text(`Average Basket Order Value: LKR ${(reportData.totalIncomes / (reportData.monthlyRevenue[0]?.salesCount || 1)).toFixed(0)}/=`, 14, 90);

      // Product sales details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Itemized Sales Breakdown', 14, 105);

      const tableRows = reportData.productSales.map((p: any) => [
        p.productId,
        p.name,
        p.type === 'STL' ? 'STL File (Digital)' : '3D Print (Physical)',
        p.quantity,
        `Rs. ${(p.revenue / p.quantity).toLocaleString()}`,
        `Rs. ${p.revenue.toLocaleString()}`
      ]);

      doc.autoTable({
        startY: 110,
        head: [['ID', 'Product Name', 'Category', 'Qty Sold', 'Unit Price', 'Total Sales']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] }, // Violet color header
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 3 }
      });

      // Footer notice
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text('This is an auto-generated business analytics document. For queries, contact support@printlabs.lk.', 14, finalY);

      // Save PDF
      doc.save(`PrintLabs_Monthly_Report_${new Date().toISOString().slice(0, 7)}.pdf`);
    } catch (err) {
      alert('Failed to generate PDF document.');
      console.error(err);
    }
  };

  const totalQuantity = reportData.productSales.reduce((sum: number, p: any) => sum + p.quantity, 0);

  return (
    <div style={{ padding: '3rem 0', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Aurora Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="section-container">
        {/* Back Button & Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            to="/admin"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem',
              marginBottom: '1.5rem', fontWeight: 500, transition: 'color 0.2s'
            }}
            className="hover:text-white"
          >
            <FiArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#06B6D4', marginBottom: '0.5rem' }}>
                Analytics & Reporting
              </p>
              <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                Monthly{' '}
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 400 }}>
                  Sales Report
                </span>
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={fetchReportData}
                className="up-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
              >
                <FiRefreshCw /> Refresh
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="btn-primary"
                disabled={reportData.productSales.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <span className="spinner" style={{ width: 45, height: 45 }} />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem' }}>
                <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Gross Revenue</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiDollarSign /> Rs. {reportData.totalIncomes.toLocaleString()}
                </h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem' }}>
                <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Items Sold Count</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPackage /> {totalQuantity} Units
                </h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem' }}>
                <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Months Logged</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiActivity /> {reportData.monthlyRevenue?.length || 1} Month(s)
                </h3>
              </div>
            </div>

            {/* Sales Chart */}
            {reportData.monthlyRevenue?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#FFFFFF', marginBottom: '1.5rem' }}>Revenue Trends</h2>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={reportData.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip contentStyle={{ background: '#111827', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue (Rs.)" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Table of products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#FFFFFF' }}>Product Sell Count & Contribution</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Product Name</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Quantity Sold</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>Total Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.productSales.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No sales logs found.</td>
                      </tr>
                    ) : (
                      reportData.productSales.map((p: any) => (
                        <tr key={p.productId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'white' }}>{p.name}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ color: p.type === 'STL' ? '#8B5CF6' : '#06B6D4' }}>{p.type}</span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.quantity} Units</td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#10B981' }}>Rs. {p.revenue.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
