import React, { useState } from "react";

export default function ProgramHeader({ searchQuery, setSearchQuery }) {
    const [intake, setIntake] = useState("");
    const [year, setYear] = useState("");
    const [nationality, setNationality] = useState("");
    const [state, setState] = useState("");

    const handleSearch = () => {
        // Handle search logic here
        console.log({ searchQuery, intake, year, nationality, state });
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="program-header">
            <div className="header-container">
                {/* Search Programs */}
                <div className="filter-group">
                    <label className="filter-label">Search Programs</label>
                    <div className="search-input-wrapper">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by program name, university..."
                        />
                        {searchQuery && (
                            <button className="clear-btn" onClick={handleClearSearch}>
                                <svg className="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Intake */}
                <div className="filter-group">
                    <label className="filter-label">Intake</label>
                    <div className="select-wrapper">
                        <svg className="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <select 
                            className="filter-select"
                            value={intake}
                            onChange={(e) => setIntake(e.target.value)}
                        >
                            <option value="">All Intakes</option>
                            <option value="jan">January</option>
                            <option value="feb">February</option>
                            <option value="mar">March</option>
                            <option value="apr">April</option>
                            <option value="may">May</option>
                            <option value="jun">June</option>
                            <option value="jul">July</option>
                            <option value="aug">August</option>
                            <option value="sep">September</option>
                            <option value="oct">October</option>
                            <option value="nov">November</option>
                            <option value="dec">December</option>
                        </select>
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Year */}
                <div className="filter-group">
                    <label className="filter-label">Year</label>
                    <div className="select-wrapper">
                        <svg className="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <select 
                            className="filter-select"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">All Years</option>
                            <option value="2026">2026</option>
                            <option value="2025">2027</option>
                            <option value="2024">2028</option>
                            <option value="2023">2029</option>
                        </select>
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Nationality */}
                <div className="filter-group">
                    <label className="filter-label">Nationality</label>
                    <div className="select-wrapper">
                        <svg className="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <select 
                            className="filter-select"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                        >
                            <option value="">All Nationalities</option>
                            <option value="in">India</option>
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="au">Australia</option>
                            <option value="de">Germany</option>
                            <option value="fr">France</option>
                        </select>
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* State */}
                <div className="filter-group">
                    <label className="filter-label">State</label>
                    <div className="select-wrapper">
                        <svg className="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <select 
                            className="filter-select"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        >
                            <option value="">All States</option>
                            <option value="al">Alabama</option>
                            <option value="ak">Alaska</option>
                            <option value="az">Arizona</option>
                            <option value="ar">Arkansas</option>
                            <option value="ca">California</option>
                            <option value="co">Colorado</option>
                            <option value="ct">Connecticut</option>
                            <option value="de">Delaware</option>
                            <option value="fl">Florida</option>
                            <option value="ga">Georgia</option>
                            <option value="hi">Hawaii</option>
                            <option value="id">Idaho</option>
                            <option value="il">Illinois</option>
                            <option value="in">Indiana</option>
                            <option value="ia">Iowa</option>
                        </select>
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Search Button */}
                <div className="button-group">
                    <button className="search-btn" onClick={handleSearch}>
                        <span>Search Programs</span>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .program-header {
                    padding: 20px;
                    background: #fff;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .header-container {
                    display: grid;
                    grid-template-columns: 2fr 1fr 0.8fr 1.2fr 1.2fr auto;
                    gap: 16px;
                    align-items: end;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Search Input Styles */
                .search-input-wrapper {
                    position: relative;
                    width: 100%;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 18px;
                    height: 18px;
                    color: #9ca3af;
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    padding: 10px 36px 10px 40px;
                    border: 1px solid #e5e7eb;
                    font-size: 14px;
                    color: #1f2937;
                    background: #fafbfc;
                    transition: all 0.2s ease;
                    outline: none;
                }

                .search-input:hover {
                    border-color: #f26d44;
                    background: #fff;
                }

                .search-input:focus {
                    border-color: #f26d44;
                    box-shadow: 0 0 0 3px rgba(242, 109, 68, 0.1);
                    background: #fff;
                }

                .clear-btn {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .clear-btn:hover {
                    background: #f3f4f6;
                }

                .clear-icon {
                    width: 16px;
                    height: 16px;
                    color: #9ca3af;
                }

                /* Select Styles */
                .select-wrapper {
                    position: relative;
                    width: 100%;
                }

                .select-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 18px;
                    height: 18px;
                    color: #f26d44;
                    pointer-events: none;
                    z-index: 1;
                }

                .dropdown-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: #9ca3af;
                    pointer-events: none;
                    transition: transform 0.2s ease;
                }

                .filter-select {
                    width: 100%;
                    padding: 10px 32px 10px 40px;
                    border: 1px solid #e5e7eb;
                    font-size: 14px;
                    color: #1f2937;
                    background: #fafbfc;
                    cursor: pointer;
                    appearance: none;
                    transition: all 0.2s ease;
                    outline: none;
                }

                .filter-select:hover {
                    border-color: #f26d44;
                    background: #fff;
                }

                .filter-select:focus {
                    border-color: #f26d44;
                    box-shadow: 0 0 0 3px rgba(242, 109, 68, 0.1);
                    background: #fff;
                }

                /* Button Styles */
                .button-group {
                    display: flex;
                    align-items: center;
                }

                .search-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: #f26d44;
                    color: white;
                    border: none;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }

                .search-btn:hover {
                    background: #e85c30;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(242, 109, 68, 0.2);
                }

                .search-btn:active {
                    transform: translateY(0);
                }

                .btn-icon {
                    width: 16px;
                    height: 16px;
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .header-container {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                    }

                    .button-group {
                        grid-column: span 1;
                    }
                }

                @media (max-width: 768px) {
                    .program-header {
                        padding: 16px;
                    }

                    .header-container {
                        grid-template-columns: 1fr;
                    }
                }

                /* Placeholder styling */
                .search-input::placeholder {
                    color: #9ca3af;
                    font-size: 13px;
                }

                /* Disabled option styling */
                .filter-select option:first-child {
                    color: #9ca3af;
                }

                /* Focus visible for accessibility */
                .search-btn:focus-visible,
                .filter-select:focus-visible,
                .search-input:focus-visible {
                    outline: 2px solid #f26d44;
                    outline-offset: 2px;
                }
            `}</style>
        </div>
    );
}