import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeadSheetReport.css'; // We'll create this CSS file

const LeadSheet_Report = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [count, setCount] = useState(0);
    const [conversionStats, setConversionStats] = useState({
        firstCall: { converted: 0, total: 0, rate: 0 },
        secondCall: { converted: 0, total: 0, rate: 0 },
        thirdCall: { converted: 0, total: 0, rate: 0 }
    });
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        converted: 'all',
        gender: 'all',
        inquiryFor: ''
    });
    const [targetRate] = useState(33); // 33% target
    const [notificationSent, setNotificationSent] = useState(false);
    const fetchLeads = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://backendapi.trakky.in/salons/import-leads/?page=${page}`);
            setLeads(response.data.results);
            setCount(response.data.count);
            setTotalPages(Math.ceil(response.data.count / (response.data.results.length || 1)));

            // Calculate conversion statistics
            calculateConversionStats(response.data.results);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const calculateConversionStats = (leadsData) => {
        let firstCallConverted = 0;
        let secondCallConverted = 0;
        let thirdCallConverted = 0;
        let totalLeads = leadsData.length;

        leadsData.forEach(lead => {
            if (lead.lead_converted_1) firstCallConverted++;
            if (lead.lead_converted_2) secondCallConverted++;
            if (lead.lead_converted_3) thirdCallConverted++;
        });

        const firstCallRate = totalLeads > 0 ? Math.round((firstCallConverted / totalLeads) * 100) : 0;
        const secondCallRate = totalLeads > 0 ? Math.round((secondCallConverted / totalLeads) * 100) : 0;
        const thirdCallRate = totalLeads > 0 ? Math.round((thirdCallConverted / totalLeads) * 100) : 0;

        setConversionStats({
            firstCall: { converted: firstCallConverted, total: totalLeads, rate: firstCallRate },
            secondCall: { converted: secondCallConverted, total: totalLeads, rate: secondCallRate },
            thirdCall: { converted: thirdCallConverted, total: totalLeads, rate: thirdCallRate }
        });

        // Check if first call conversion rate meets target and send notification if not
        if (firstCallRate < targetRate && !notificationSent) {
            sendWhatsAppNotification(firstCallRate);
        }
    };

    const sendWhatsAppNotification = (currentRate) => {
        const message = `Alert: First call conversion rate is ${currentRate}%, which is below the target of ${targetRate}%. Please take necessary actions.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=919328382710&text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        setNotificationSent(true);

        // Reset notification sent after some time (e.g., 1 hour) to allow new notifications
        setTimeout(() => setNotificationSent(false), 3600000);
    };

    useEffect(() => {
        fetchLeads(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        // In a real implementation, you would modify the API call to include these filters
        // For now, we'll just filter the existing data client-side
        fetchLeads(1);
    };

    const resetFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            converted: 'all',
            gender: 'all',
            inquiryFor: ''
        });
        fetchLeads(1);
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="lead-sheet-container">
            <h1 className="report-title">Lead Sheet Management Report</h1>

            {/* Conversion Stats Banner */}
            <div className="conversion-stats">
                <div className={`stat-card ${conversionStats.firstCall.rate < targetRate ? 'below-target' : ''}`}>
                    <h3>1st Call Conversion</h3>
                    <p>{conversionStats.firstCall.converted}/{conversionStats.firstCall.total}</p>
                    <p>{conversionStats.firstCall.rate}%
                        {conversionStats.firstCall.rate < targetRate &&
                            <span className="warning"> (Below Target)</span>}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>2nd Call Conversion</h3>
                    <p>{conversionStats.secondCall.converted}/{conversionStats.secondCall.total}</p>
                    <p>{conversionStats.secondCall.rate}%</p>
                </div>
                <div className="stat-card">
                    <h3>3rd Call Conversion</h3>
                    <p>{conversionStats.thirdCall.converted}/{conversionStats.thirdCall.total}</p>
                    <p>{conversionStats.thirdCall.rate}%</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <h3>Filters</h3>
                <div className="filter-grid">
                    <div className="filter-group">
                        <label>Date From:</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Date To:</label>
                        <input
                            type="date"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Conversion Status:</label>
                        <select
                            name="converted"
                            value={filters.converted}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="converted">Converted</option>
                            <option value="not_converted">Not Converted</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Gender:</label>
                        <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Inquiry For:</label>
                        <input
                            type="text"
                            name="inquiryFor"
                            value={filters.inquiryFor}
                            onChange={handleFilterChange}
                            placeholder="Service type"
                        />
                    </div>
                </div>
                <div className="filter-buttons">
                    <button onClick={applyFilters} className="apply-btn">Apply Filters</button>
                    <button onClick={resetFilters} className="reset-btn">Reset Filters</button>
                </div>
            </div>

            {/* Leads Table */}
            <div className="table-responsive">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Phone Number</th>
                            <th>Gender</th>
                            <th>Inquiry For</th>
                            <th>1st Call Converted</th>
                            <th>2nd Call Converted</th>
                            <th>3rd Call Converted</th>
                            <th>Last Conversation</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.date || 'N/A'}</td>
                                <td>{lead.number || 'N/A'}</td>
                                <td>{lead.gender || 'N/A'}</td>
                                <td>{lead.inquiry_for || 'N/A'}</td>
                                <td className={lead.lead_converted_1 ? 'converted' : 'not-converted'}>
                                    {lead.lead_converted_1 ? 'Yes' : 'No'}
                                </td>
                                <td className={lead.lead_converted_2 ? 'converted' : 'not-converted'}>
                                    {lead.lead_converted_2 ? 'Yes' : 'No'}
                                </td>
                                <td className={lead.lead_converted_3 ? 'converted' : 'not-converted'}>
                                    {lead.lead_converted_3 ? 'Yes' : 'No'}
                                </td>
                                <td>{lead.last_conversation_date || 'N/A'}</td>
                                <td>{new Date(lead.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="table-footer">
                <p className="report-info">Total Leads: {count} | Showing page {currentPage} of {totalPages}</p>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        First
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={currentPage === pageNum ? 'active' : ''}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadSheet_Report;