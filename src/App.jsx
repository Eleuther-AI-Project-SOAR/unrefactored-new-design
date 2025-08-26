import React, { useState, useMemo, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';

// Helper component for SVG icons
const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// --- Icon components for clarity ---
const StarIcon = ({ className = 'w-5 h-5 text-yellow-400' }) => <Icon path="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" className={className} />;
const DiscordIcon = ({ className = 'w-5 h-5' }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-1.25 0-2.45-.54-3.34-1.42L6.25 16c.4.41.87.75 1.39 1.02.4.21.83.38 1.28.5.05.15.1.3.15.45.3.91.68 1.55 1.12 2.03.11.12.23.24.36.35.24.24.5.46.77.65.2.14.4.27.6.39.58.35 1.2.62 1.85.8.06.01.12.02.18.03-1.45-.61-2.64-1.7-3.4-3.15-.1-.2-.19-.4-.28-.6-.32-.7-.56-1.47-.7-2.25zM15.5 11c-.83 0-1.5-.89-1.5-2s.67-2 1.5-2 1.5.89 1.5 2-.67 2-1.5 2zm-5 0c-.83 0-1.5-.89-1.5-2s.67-2 1.5-2 1.5.89 1.5 2-.67 2-1.5 2z" className={className} />;
const LanguageIcon = ({ className = 'w-5 h-5' }) => <Icon path="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" className={className} />;
const ReadingGroupIcon = ({ className = 'w-4 h-4' }) => <Icon path="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" className={className} />;
const PaperChannelIcon = ({ className = 'w-4 h-4' }) => <Icon path="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" className={className} />;
const VCEventsIcon = ({ className = 'w-4 h-4' }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className={className} />;
const JobsBoardIcon = ({ className = 'w-4 h-4' }) => <Icon path="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z" className={className} />;
const ExternalLinkIcon = ({ className = 'w-5 h-5' }) => <Icon path="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" className={className} />;
const MinusIcon = ({ className = 'w-5 h-5' }) => <Icon path="M5 11h14v2H5z" className={className} />;
const PlusIcon = ({ className = 'w-5 h-5' }) => <Icon path="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" className={className} />;
const CloseIcon = ({ className = 'w-6 h-6' }) => <Icon path="M6.28 6.28a.75.75 0 00-1.06 1.06L10.94 12l-5.72 5.72a.75.75 0 101.06 1.06L12 13.06l5.72 5.72a.75.75 0 101.06-1.06L13.06 12l5.72-5.72a.75.75 0 00-1.06-1.06L12 10.94 6.28 6.28z" className={className} />;
const GridIcon = ({ className = 'w-5 h-5' }) => <Icon path="M2 2h9v9H2V2zm11 0h9v9h-9V2zM2 13h9v9H2v-9zm11 0h9v9h-9v-9z" className={className} />;
const ListIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" className={className} />;
const ChevronDownIcon = ({ className = 'w-4 h-4' }) => <Icon path="M12 15.25a1 1 0 01-.7-.29l-4-4a1 1 0 111.4-1.42L12 12.84l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-.7.29z" className={className} />;
const ChevronRightIcon = ({ className = 'w-5 h-5' }) => <Icon path="M10.75 16.4a.99.99 0 01-.7-.29.99.99 0 010-1.41L13.16 12l-3.1-3.1a.99.99 0 010-1.41 1 1 0 011.41 0l3.8 3.8a.99.99 0 010 1.41l-3.8 3.8a1 1 0 01-.71.29z" className={className} />;
const ChevronLeftIcon = ({ className = 'w-5 h-5' }) => <Icon path="M13.25 16.4a1 1 0 01-.71-.29l-3.8-3.8a.99.99 0 010-1.41l3.8-3.8a1 1 0 011.41 1.41L10.84 12l3.1 3.1a.99.99 0 010 1.41 1 1 0 01-.7.29z" className={className} />;
const SendIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" className={className} />;
const MoreIcon = ({ className = 'w-5 h-5' }) => <Icon path="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" className={className} />;
const FolderIcon = ({ className = 'w-5 h-5' }) => <Icon path="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" className={className} />;
const FileIcon = ({ className = 'w-5 h-5' }) => <Icon path="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" className={className} />;
const InfoIcon = ({ className = 'w-6 h-6' }) => <Icon path="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" className={className} />;

// Header component for the top navigation bar
const Header = ({ setActiveTab }) => (
  <header className="bg-gray-100 text-gray-800">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">AI Discord Directory</h1>
        </div>
        <nav className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <button onClick={() => setActiveTab('Server Explorer')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</button>
            <button onClick={() => setActiveTab('About')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">About</button>
            <button onClick={() => alert('Funding page coming soon!')} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Funding</button>
          </div>
        </nav>
      </div>
    </div>
  </header>
);

// Tab component for view switching
const Tab = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out
      ${isActive
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
  >
    {label}
  </button>
);

// --- Filter Component ---
const filterData = [
    { title: 'Server Type', key: 'tag', tags: ['Research', 'Hackathons', 'Alignment', 'GPU', 'General', 'Education', 'Tool', 'Casual', 'LLM', 'Prompting', 'Bug bounties', 'Conference', 'Crypto', 'Entrepreneurship', 'Company', 'Robotics', 'Puzzle', 'Generation'] },
    { title: 'Activity Level', key: 'activityLevel', tags: ['Very Active', 'Active', 'Semi-active', 'Mostly Inactive', 'Inactive'] },
    { title: 'Language', key: 'language', tags: ['English', 'Korean'] },
    { title: 'Location', key: 'location', tags: ['Discord', 'Slack', 'Irl'] },
    { title: 'Others', key: 'features', tags: ['Reading Group', 'Paper Channel', 'VC events/Office Hours', 'Jobs Board'] }
];

const FilterTag = ({ tag, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-2.5 py-1 border rounded-full text-xs transition-colors duration-200
            ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
        `}
    >
        {tag}
    </button>
);

const Filters = ({ searchQuery, setSearchQuery, minScore, setMinScore, selectedTags, setSelectedTags, resultsCount, totalCount }) => {
    const [collapsedCategories, setCollapsedCategories] = useState({});

    const handleTagClick = (category, tag) => {
        setSelectedTags(prev => {
            const currentCategoryTags = prev[category] || [];
            const newCategoryTags = currentCategoryTags.includes(tag)
                ? currentCategoryTags.filter(t => t !== tag)
                : [...currentCategoryTags, tag];
            return { ...prev, [category]: newCategoryTags };
        });
    };
    
    const handleClearAll = () => {
        setSelectedTags({});
        setMinScore(0);
        setSearchQuery('');
    };

    const toggleCategory = (title) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        // MODIFICATION: Adopted a fixed sidebar strategy
        <div className="w-full lg:w-80 xl:w-96 lg:flex-shrink-0 lg:sticky lg:top-6">
            <div className="p-4 bg-white rounded-lg shadow-md lg:max-h-[calc(100vh-3rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button 
                        onClick={handleClearAll}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Clear All
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label htmlFor="search" className="sr-only">Search servers</label>
                        <input type="text" id="search" placeholder="Search servers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="min-score" className="block text-sm font-medium text-gray-700 mb-1">Min Score: {minScore.toFixed(1)}</label>
                        <input
                            type="range"
                            id="min-score"
                            min="0"
                            max="10"
                            step="0.1"
                            value={minScore}
                            onChange={(e) => setMinScore(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                        Showing <b>{resultsCount}</b> of <b>{totalCount}</b> servers
                    </p>

                    <div className="space-y-6 border-t pt-6">
                        {filterData.map(({ title, tags }) => {
                            const isCollapsed = collapsedCategories[title];
                            return (
                                <div key={title}>
                                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">{title}</h3>
                                        <button onClick={() => toggleCategory(title)} className="text-gray-500 hover:text-gray-800">
                                            {isCollapsed ? <PlusIcon /> : <MinusIcon />}
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <FilterTag
                                                    key={tag}
                                                    tag={tag}
                                                    isSelected={(selectedTags[title] || []).includes(tag)}
                                                    onClick={() => handleTagClick(title, tag)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mappings for tag styles
const featureTagStyles = {
    'Reading Group': { icon: <ReadingGroupIcon />, color: 'bg-purple-100 text-purple-800' },
    'Paper Channel': { icon: <PaperChannelIcon />, color: 'bg-blue-100 text-blue-800' },
    'VC events/Office Hours': { icon: <VCEventsIcon />, color: 'bg-green-100 text-green-800' },
    'Jobs Board': { icon: <JobsBoardIcon />, color: 'bg-orange-100 text-orange-800' },
};

const activityLevelStyles = {
    'Very Active': 'bg-green-500 text-white',
    'Active': 'bg-green-200 text-green-800',
    'Semi-active': 'bg-yellow-200 text-yellow-800',
    'Mostly Inactive': 'bg-gray-300 text-gray-800',
    'Inactive': 'bg-gray-200 text-gray-600',
};


// Server card component
const ServerCard = ({ server, onViewClick }) => {
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800';

    return (
        <div 
            onClick={() => onViewClick(server)}
            className="bg-white rounded-lg shadow-md p-8 flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
        >
            {/* MODIFICATION: Removed flex-grow from this container to fix spacing */}
            <div className="flex flex-col">
                {/* Top section of the card */}
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900 pr-2">{server.name}</h3>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                alert(`Joining ${server.name}...`);
                            }}
                            className="text-indigo-500 hover:text-indigo-700 transition-colors flex-shrink-0"
                        >
                            <ExternalLinkIcon />
                        </button>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm text-gray-500 mt-1">
                        {server.rating >= 7.5 && <StarIcon />}
                        <span className="font-semibold text-gray-800 text-base">{server.rating}</span>
                        <div className="flex items-center gap-x-3 flex-shrink-0">
                            <span className="px-2 py-1 border border-gray-400 rounded-full text-xs font-semibold whitespace-nowrap">{server.tag}</span>
                            <span className={`px-2 py-1 ${activityClass} rounded-full text-xs font-semibold whitespace-nowrap`}>
                                {server.activityLevel}
                            </span>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                        <DiscordIcon className="w-4 h-4 text-gray-500" />
                        <span>discord</span>
                        <span>•</span>
                        <LanguageIcon className="w-4 h-4 text-gray-500" />
                        <span>english</span>
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">{server.description}</p>
                </div>

                {/* MODIFICATION: Using a standard margin instead of mt-auto */}
                <div className="mt-5">
                    <div className="flex flex-wrap gap-2">
                        {server.features.map(feature => {
                            const style = featureTagStyles[feature];
                            if (!style) return null;
                            return (
                                <span key={feature} className={`inline-flex items-center gap-1.5 px-2 py-1 ${style.color} rounded-md text-xs font-medium`}>
                                    {style.icon}
                                    {feature}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Modal Component ---
const ServerModal = ({ server, onClose }) => {
    if (!server) return null;
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800';
    
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div onClick={handleOutsideClick} className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{server.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center flex-wrap gap-x-3 text-sm">
                        {server.rating >= 7.5 && <StarIcon />}
                        <span className="font-semibold text-gray-800 text-lg">{server.rating}</span>
                        <span className="px-3 py-1 border border-gray-400 rounded-full text-sm font-semibold">{server.tag}</span>
                        <span className={`px-3 py-1 ${activityClass} rounded-full text-sm font-semibold`}>
                            {server.activityLevel}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600 text-sm">{server.description} {server.description} {server.description}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Features</h4>
                        <div className="flex flex-wrap gap-2">
                            {server.features.length > 0 ? server.features.map(feature => {
                                const style = featureTagStyles[feature];
                                if (!style) return null;
                                return (
                                    <span key={feature} className={`inline-flex items-center gap-1.5 px-2 py-1 ${style.color} rounded-md text-xs font-medium`}>
                                        {style.icon}
                                        {feature}
                                    </span>
                                );
                            }) : <p className="text-sm text-gray-500">No specific features listed.</p>}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors">
                        Join Server
                        <ExternalLinkIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- View Components ---
const GridView = ({ servers, onViewClick }) => (
    // MODIFICATION: Use CSS Grid's auto-fill and minmax for a robust, responsive layout
    <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-6 items-stretch">
        {servers.map(server => <ServerCard key={server.name} server={server} onViewClick={onViewClick} />)}
    </div>
);

const TableView = ({ servers, onViewClick }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
        {/* MODIFICATION: Added table-auto for better column spacing */}
        <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
                <tr>
                    {['Name', 'Score', 'Type', 'Activity', 'Location', 'Features', 'Link'].map(header => (
                        <th key={header} scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${header === 'Link' ? 'text-right' : 'text-left'}`}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {servers.map(server => (
                    <tr key={server.name} onClick={() => onViewClick(server)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{server.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full border border-gray-400">
                                {server.tag}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activityLevelStyles[server.activityLevel]}`}>
                                {server.activityLevel}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.location} • {server.language}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                                {server.features.map(feature => {
                                    const style = featureTagStyles[feature];
                                    return style ? <span key={feature} className={`inline-flex items-center p-1 ${style.color} rounded-md`}>{style.icon}</span> : null;
                                })}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" onClick={(e) => e.stopPropagation()} className="text-indigo-600 hover:text-indigo-900">link</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ViewSwitcher = ({ view, setView }) => (
    <div className="flex items-center p-1 bg-gray-200 rounded-lg">
        <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-300'}`}>
            <GridIcon />
        </button>
        <button onClick={() => setView('table')} className={`p-2 rounded-md ${view === 'table' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-300'}`}>
            <ListIcon />
        </button>
    </div>
);

const MultiSortControl = ({ sortLevels, setSortLevels, sortOptions }) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [showAddLevelMenu, setShowAddLevelMenu] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenDropdown(false);
                setActiveSubmenu(null);
                setShowAddLevelMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);


    const handleLevelChange = (index, key, value) => {
        const newLevels = [...sortLevels];
        newLevels[index][key] = value;
        if (key === 'key') {
            const selectedOption = sortOptions.find(opt => opt.value === value);
            if (selectedOption.type === 'value') {
                newLevels[index].specificTag = 'none';
                newLevels[index].direction = 'ascending';
            } else {
                newLevels[index].direction = 'none';
                if (selectedOption.tags && selectedOption.tags.length > 0) {
                    newLevels[index].specificTag = selectedOption.tags[0];
                } else {
                    newLevels[index].specificTag = 'none';
                }
            }
        }
        setSortLevels(newLevels);
        setActiveSubmenu(null);
    };

    const addLevel = (sortOption) => {
        const newLevel = {
            key: sortOption.value,
            direction: sortOption.type === 'value' ? 'ascending' : 'none',
            specificTag: sortOption.type === 'tag' && sortOption.tags && sortOption.tags.length > 0 ? sortOption.tags[0] : 'none'
        };
        setSortLevels([...sortLevels, newLevel]);
        setShowAddLevelMenu(false);
    };

    const removeLevel = (index) => {
        setSortLevels(sortLevels.filter((_, i) => i !== index));
    };
    
    const availableSortOptions = sortOptions.filter(option => {
        if (option.type === 'value') {
            return !sortLevels.some(level => level.key === option.value);
        }
        return true;
    });

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setOpenDropdown(!openDropdown)} className="flex items-center space-x-2 p-2 border rounded-md bg-white text-sm">
                <span>Sort Priority</span>
                <ChevronDownIcon />
            </button>
            {openDropdown && (
                <div className="absolute top-full mt-1 w-72 bg-white border rounded-md shadow-lg z-50 p-2 space-y-2">
                    {sortLevels.map((level, index) => {
                        const selectedOption = sortOptions.find(opt => opt.value === level.key);
                        return (
                            <div key={index} className="flex items-center justify-between group">
                                <button onClick={() => removeLevel(index)} className="p-2 text-gray-400 hover:text-red-600">
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                                <div 
                                    className="relative flex-grow" 
                                    onMouseEnter={() => setActiveSubmenu(index)} 
                                    onMouseLeave={() => setActiveSubmenu(null)}
                                >
                                    <button 
                                        className="w-full text-left p-2 hover:bg-gray-100 rounded-md flex justify-between items-center"
                                    >
                                        <span>{selectedOption.label}: {selectedOption.type === 'tag' ? level.specificTag : level.direction}</span>
                                        <ChevronRightIcon />
                                    </button>
                                    {activeSubmenu === index && (
                                        <div className="absolute left-full -top-px w-48 bg-white border rounded-md shadow-lg">
                                            {selectedOption.type === 'value' ? (
                                                <>
                                                    <button onClick={() => handleLevelChange(index, 'direction', 'ascending')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Ascending</button>
                                                    <button onClick={() => handleLevelChange(index, 'direction', 'descending')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Descending</button>
                                                </>
                                            ) : (
                                                <div className="max-h-60 overflow-y-auto">
                                                    {selectedOption.tags.map(tag => (
                                                        <button key={tag} onClick={() => handleLevelChange(index, 'specificTag', tag)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{tag}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div className="border-t pt-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowAddLevelMenu(!showAddLevelMenu)}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 w-full text-left p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                                disabled={availableSortOptions.length === 0}
                            >
                                + Add Sort Level
                            </button>
                            {showAddLevelMenu && (
                                <div className="absolute top-full mt-1 w-48 bg-white border rounded-md shadow-lg z-20">
                                    {availableSortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => addLevel(option)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// List view component
const ListView = () => {
    const [selectedServer, setSelectedServer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [minScore, setMinScore] = useState(0);
    const [selectedTags, setSelectedTags] = useState({});
    const [viewMode, setViewMode] = useState('grid');
    const [sortLevels, setSortLevels] = useState([{ key: 'rating', direction: 'descending', specificTag: 'none' }]);
    
    const sortOptions = [
        { value: 'name', label: 'Name', type: 'value' },
        { value: 'rating', label: 'Score', type: 'value' },
        { value: 'activityLevelOrder', label: 'Activity', type: 'value' },
        ...filterData.map(f => ({ value: f.key, label: f.title, type: 'tag', tags: f.tags }))
    ];
    
    const handleViewClick = (server) => {
        setSelectedServer(server);
    };

    const handleCloseModal = () => {
        setSelectedServer(null);
    };

    const servers = [
        { name: 'EleutherAI', rating: 8.1, tag: 'Research', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Lots of resources; community projects to do and very active community.', features: ['Reading Group', 'Paper Channel', 'VC events/Office Hours', 'Jobs Board'] },
        { name: 'Cohere for AI', rating: 8.1, tag: 'Research', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Pretty good. Lots of stuff to do for various skill levels.', features: ['Reading Group', 'Paper Channel', 'VC events/Office Hours'] },
        { name: 'AI Safety Camp', rating: 7.8, tag: 'Alignment', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Focused on AI safety research and education with regular workshops.', features: ['Reading Group', 'Paper Channel', 'VC events/Office Hours', 'Jobs Board'] },
        { name: 'GPU Collective', rating: 7.2, tag: 'GPU', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Community for sharing GPU resources and optimization techniques.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'Seoul AI Hub', rating: 6.9, tag: 'General', activityLevel: 'Active', language: 'Korean', location: 'Discord', description: 'Korean-speaking AI community with regular paper discussions.', features: ['Reading Group', 'Paper Channel', 'Jobs Board'] },
        { name: 'Prompt Engineering Masters', rating: 7.5, tag: 'Prompting', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Advanced techniques and strategies for prompt engineering.', features: ['VC events/Office Hours'] },
        { name: 'Robotics Research Group', rating: 7.4, tag: 'Robotics', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Connect with AI entrepreneurs and find co-founders.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'Neural AI 9', rating: 7.0, tag: 'Research', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'A place for all things related to neural networks.', features: ['Paper Channel'] },
        { name: 'Deep AI 10', rating: 8.7, tag: 'Hackathons', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Weekly hackathons and coding challenges.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'AI Startup Incubator', rating: 8.0, tag: 'Entrepreneurship', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Connect with AI entrepreneurs and find co-founders.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'Casual Coders', rating: 6.5, tag: 'Casual', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A friendly place to chat about code and projects.', features: ['Reading Group'] },
        { name: 'LLM Builders', rating: 9.1, tag: 'LLM', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'For developers and researchers working on Large Language Models.', features: ['Paper Channel', 'Jobs Board'] },
        { name: 'Bug Bounty Hunters', rating: 7.9, tag: 'Bug bounties', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Find and report vulnerabilities in AI systems.', features: [] },
        { name: 'AI Conference Hub', rating: 8.3, tag: 'Conference', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Discuss upcoming AI conferences and share insights.', features: ['VC events/Office Hours'] },
        { name: 'Crypto & AI', rating: 6.8, tag: 'Crypto', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Exploring the intersection of cryptocurrency and artificial intelligence.', features: [] },
        { name: 'Puzzle Solvers AI', rating: 7.1, tag: 'Puzzle', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Using AI to solve complex puzzles and games.', features: ['Reading Group'] },
        { name: 'Generative Art Gallery', rating: 8.5, tag: 'Generation', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Showcase and discuss AI-generated art.', features: ['Paper Channel'] },
        { name: 'AI for Education', rating: 7.7, tag: 'Education', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Developing and using AI tools for learning.', features: ['Reading Group', 'Jobs Board'] },
        { name: 'Open Source AI Tools', rating: 8.4, tag: 'Tool', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Contribute to and discuss open-source AI projects.', features: ['Jobs Board'] },
        { name: 'Korean AI Tech', rating: 7.3, tag: 'General', activityLevel: 'Active', language: 'Korean', location: 'Discord', description: 'A Korean-speaking community for all AI topics.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'Slack AI Innovators', rating: 7.0, tag: 'Tool', activityLevel: 'Semi-active', language: 'English', location: 'Slack', description: 'A Slack community for AI developers.', features: [] },
        { name: 'IRL AI Meetup Group', rating: 8.8, tag: 'Conference', activityLevel: 'Active', language: 'English', location: 'Irl', description: 'Organizing in-person AI meetups and events.', features: ['VC events/Office Hours'] },
        { name: 'The Alignment Problem', rating: 9.2, tag: 'Alignment', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Dedicated to solving the AI alignment problem.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'Hackathon Heroes', rating: 8.6, tag: 'Hackathons', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Team up for AI hackathons and competitions.', features: ['Jobs Board'] },
        { name: 'GPU Traders', rating: 6.7, tag: 'GPU', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'A community for buying, selling, and trading GPUs.', features: [] },
        { name: 'AI Ethics Discussion', rating: 8.2, tag: 'Alignment', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Debating the ethical implications of AI.', features: ['Reading Group'] },
        { name: 'Machine Learning Cafe', rating: 7.4, tag: 'Casual', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A relaxed space for ML enthusiasts.', features: ['Reading Group'] },
        { name: 'Prompt Perfect', rating: 7.9, tag: 'Prompting', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Master the art of prompt engineering.', features: ['Paper Channel'] },
        { name: 'Code Generation Guild', rating: 8.1, tag: 'Generation', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Exploring AI-powered code generation.', features: ['Jobs Board'] },
        { name: 'Robotics & Automation', rating: 8.5, tag: 'Robotics', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Building and programming intelligent robots.', features: ['Jobs Board'] },
        { name: 'AI Company Connect', rating: 8.9, tag: 'Company', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A network for professionals at AI companies.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'The Puzzle Box', rating: 7.6, tag: 'Puzzle', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A community for AI-based puzzle solving.', features: ['Reading Group'] },
        { name: 'LLM Fine-Tuning', rating: 8.8, tag: 'LLM', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Techniques and best practices for fine-tuning LLMs.', features: ['Paper Channel'] },
        { name: 'AI in Finance', rating: 7.8, tag: 'Crypto', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Applying AI to financial markets and cryptocurrency.', features: ['Jobs Board'] },
        { name: 'EdTech AI', rating: 7.5, tag: 'Education', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Innovating in education with AI.', features: ['Reading Group'] },
        { name: 'The Turing Test', rating: 7.2, tag: 'Casual', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Casual chats about AI and consciousness.', features: [] },
        { name: 'AI Hardware Hub', rating: 8.0, tag: 'GPU', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Discussions on hardware for AI, including GPUs and TPUs.', features: ['Jobs Board'] },
        { name: 'Startup Founders AI', rating: 8.7, tag: 'Entrepreneurship', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'A community for founders of AI startups.', features: ['VC events/Office Hours'] },
        { name: 'AI Art Prompters', rating: 8.3, tag: 'Prompting', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Sharing prompts and creations for AI art generation.', features: [] },
        { name: 'Research Paper Club', rating: 8.6, tag: 'Research', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Weekly discussions of new AI research papers.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'Autonomous Agents', rating: 9.0, tag: 'Robotics', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Developing autonomous AI agents.', features: ['Jobs Board'] },
        { name: 'AI for Good', rating: 8.9, tag: 'Alignment', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Using AI to solve social and environmental problems.', features: ['VC events/Office Hours'] },
        { name: 'The Generative Lounge', rating: 7.9, tag: 'Generation', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A place to share and discuss generative models.', features: ['Paper Channel'] },
        { name: 'AI Toolmakers', rating: 8.2, tag: 'Tool', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Building the next generation of AI tools.', features: ['Jobs Board'] },
        { name: 'Global AI Conference', rating: 8.5, tag: 'Conference', activityLevel: 'Active', language: 'English', location: 'Irl', description: 'The official server for the Global AI Conference.', features: ['VC events/Office Hours'] },
        { name: 'Data Science Dojo', rating: 7.7, tag: 'Education', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Learn and practice data science with a supportive community.', features: ['Reading Group', 'Jobs Board'] },
        { name: 'The Logic Puzzle', rating: 7.3, tag: 'Puzzle', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Solving logic puzzles with and without AI.', features: [] },
        { name: 'Corporate AI Solutions', rating: 8.4, tag: 'Company', activityLevel: 'Active', language: 'English', location: 'Slack', description: 'Discussing the implementation of AI in large companies.', features: ['Jobs Board'] },
        { name: 'Web3 & AI Nexus', rating: 7.1, tag: 'Crypto', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Exploring the synergy between Web3 and AI.', features: [] },
    ];

    const processedServers = useMemo(() => {
        let filtered = servers.filter(server => {
            const searchMatch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                server.description.toLowerCase().includes(searchQuery.toLowerCase());
            const scoreMatch = server.rating >= minScore;
            const tagMatch = Object.entries(selectedTags).every(([category, tags]) => {
                if (tags.length === 0) return true;
                const serverPropKey = filterData.find(f => f.title === category)?.key;
                if (!serverPropKey) return true;
                const serverValue = server[serverPropKey];
                if (Array.isArray(serverValue)) {
                    return tags.every(tag => serverValue.includes(tag));
                }
                return tags.includes(serverValue);
            });
            return searchMatch && scoreMatch && tagMatch;
        });

        const activityOrder = { 'Very Active': 1, 'Active': 2, 'Semi-active': 3, 'Mostly Inactive': 4, 'Inactive': 5 };
        
        const sorted = [...filtered].sort((a, b) => {
            for (const level of sortLevels) {
                const { key, direction, specificTag } = level;
                const sortOption = sortOptions.find(opt => opt.value === key);
                
                if (sortOption.type === 'tag' && specificTag !== 'none') {
                    const aHasTag = Array.isArray(a[key]) ? a[key].includes(specificTag) : a[key] === specificTag;
                    const bHasTag = Array.isArray(b[key]) ? b[key].includes(specificTag) : b[key] === specificTag;
                    if (aHasTag && !bHasTag) return -1;
                    if (!aHasTag && bHasTag) return 1;
                } else if (sortOption.type === 'value') {
                    let aValue, bValue;
                    if (key === 'featureCount') {
                        aValue = a.features.length;
                        bValue = b.features.length;
                    } else if (key === 'activityLevelOrder') {
                        aValue = activityOrder[a.activityLevel];
                        bValue = activityOrder[b.activityLevel];
                    } else {
                        aValue = a[key];
                        bValue = b[key];
                    }
                    
                    if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
                }
            }
            return 0;
        });

        return sorted;
    }, [servers, searchQuery, minScore, selectedTags, sortLevels]);

    return (
        <>
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                    <Filters 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        minScore={minScore}
                        setMinScore={setMinScore}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        resultsCount={processedServers.length}
                        totalCount={servers.length}
                    />
                    {/* MODIFICATION: Added min-w-0 to allow the flex item to shrink */}
                    <div className="w-full flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                            <MultiSortControl sortLevels={sortLevels} setSortLevels={setSortLevels} sortOptions={sortOptions} />
                            <ViewSwitcher view={viewMode} setView={setViewMode} />
                        </div>
                        {viewMode === 'grid' ? (
                            <GridView servers={processedServers} onViewClick={handleViewClick} />
                        ) : (
                            <TableView servers={processedServers} onViewClick={handleViewClick} />
                        )}
                    </div>
                </div>
            </div>
            <ServerModal server={selectedServer} onClose={handleCloseModal} />
        </>
    );
};

// --- About Page View ---
const AboutView = () => (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About the AI Discord Directory</h2>
        <div className="space-y-4 text-gray-600">
            <p>
                Welcome to the AI Discord Directory, your central hub for discovering and exploring communities focused on Artificial Intelligence. In the rapidly expanding world of AI, finding the right community to learn, collaborate, and stay up-to-date can be a challenge. Our mission is to simplify that process.
            </p>
            <p>
                This directory is a curated collection of Discord servers and other online groups dedicated to a wide range of AI topics—fr cutng-edge research and large lanage models (LLMs) to AI safety, robotics, and casual coding discussions. Whether you're a seasoned researcher, a studentust starting your journey, or a hobbyist passiona about AI, you'll find a community that fits your interests.
            </p>
            <h3 className="text-2xfont-semibold text-gray-700 pt-4">Our Goal</h3>
            <p>
              Our primary goal is to foster a more connected and accessible AI ecosystem. We believe that collaboration and knowledge sharing are key to driving innovation. By providing a comprehensive and easy-to-navigate directory, we hope to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Help individuals find relevant communities to enhance their learning and career growth.</li>
                <li>Enable collaboration between different groups and individuals on exciting projects.</li>
                <li>Provide a platform for server owners to reach a wider audience of AI enthusiasts.</li>
                <li>Offer powerful filtering and visualization tools to help you understand the landscape of AI communities.</li>
            </ul>
            <h3 className="text-2xl font-semibold text-gray-700 pt-4">How It Works</h3>
            <p>
                We gather information on various AI-focused communities and organize it in a structured way. Each server is evaluated based on several factors, including activity level, primary focus, and available resources like paper channels or job boards. Our unique scoring system helps you quickly identify high-quality and active communities.
            </p>
            <p>
                You can use our advanced filtering, sorting, and visualization tools—like the Folder Dendogram d t-SNE Cluster views—to explore the relationships between diffe communities and find the perfect one for you.
            </p>
    </div>
    </div>
);


// --- Placeholder Views for New Tabs ---
const PlaceholderView = ({ title }) => (
    <div clame="flex flex items-center ify-center h-96 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-500">{title}</h2>
        <p clame="text-gray-400 mt-2">This is where the {title.toLowee()} visualizationill go.</p>
    </div>
);

// --- Assistant View Component ---
const AssistantView = ({ chats, setChats, activeChatId, setActiveChatId }) => {
    const [input, setInput] = useState('');
    const [editingChatId, setEditingChatId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [menuOpen, setMenuOpen] = useState(null);
    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chats, activeChatId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);
    
    const handleNewChat = () => {
        const newChatId = `chat-${Date.now()}`;
        setChats(prev => ({
            ...prev,
            [newChatId]: {
                title: 'New Chat',
                messages: []
            }
        }));
        setActiveChatId(newChatId);
    };

    const handleSendMessage = () => {
        if (input.trim() === '' || !activeChatId) return;

        const updatedChats = { ...chats };
        const activeChat = updatedChats[activeChatId];

        activeChat.messages.push({ sender: 'user', text: input });

        if (activeChat.messages.length === 1) { // First user message
            activeChat.title = input.substring(0, 25) + (input.length > 25 ? '...' : '');
        }

        setInput('');
        setChats(updatedChats);

        // Mock RAG response
        setTimeout(() => {
            const response = `Based on your interest in "${input}", I recommend checking out the "EleutherAI" and "Cohere for AI" servers. They are both very active research communities.`;
            const finalChats = { ...updatedChats };
            finalChats[activeChatId].messages.push({ sender: 'assistant', text: response });
            setChats(finalChats);
        }, 1000);
    };

    const handleDeleteChat = (chatIdToDelete) => {
        const updatedChats = { ...chats };
        delete updatedChats[chatIdToDelete];
        setChats(updatedChats);

        if (activeChatId === chatIdToDelete) {
            const remainingChatIds = Object.keys(updatedChats);
            setActiveChatId(remainingChatIds.length > 0 ? remainingChatIds[0] : null);
        }
        
        setMenuOpen(null);
    };

    const handleRename = (chatId, newTitle) => {
        if (newTitle.trim() === '') return;
        const updatedChats = { ...chats };
        updatedChats[chatId].title = newTitle;
        setChats(updatedChats);
        setEditingChatId(null);
    };

    const activeChat = activeChatId ? chats[activeChatId] : null;

    return (
        <div className="flex h-[calc(100vh-12rem)]">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 border-r rounded-l-lg flex flex-col">
                <div className="p-2">
                    <button 
                        onClick={handleNewChat}
                        className="w-full px-3 py-2 bg-white text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors border"
                    >
                        + New Chat
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-1">
                    {Object.keys(chats).reverse().map(chatId => (
                        <div key={chatId} className="relative group">
                            <button 
                                onClick={() => setActiveChatId(chatId)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm truncate ${activeChatId === chatId ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-200'}`}
                            >
                                {editingChatId === chatId ? (
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        onBlur={() => handleRename(chatId, editingTitle)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleRename(chatId, editingTitle)}
                                        className="bg-transparent w-full focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    chats[chatId].title
                                )}
                            </button>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setMenuOpen(menuOpen === chatId ? null : chatId)}>
                                    <MoreIcon className="w-5 h-5 text-gray-500"/>
                                </button>
                                {menuOpen === chatId && (
                                    <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border">
                                        <button 
                                            onClick={() => { setEditingChatId(chatId); setEditingTitle(chats[chatId].title); setMenuOpen(null); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Rename
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteChat(chatId)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-3/4 bg-white rounded-r-lg flex flex-col relative">
                 {activeChat && activeChat.messages.length > 0 ? (
                    <>
                        <div className="flex-grow overflow-y-auto p-6">
                            <div className="max-w-4xl mx-auto">
                                {activeChat.messages.map((msg, index) => (
                                    <div key={index} className={`flex items-start gap-4 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-transparent text-gray-800 select-text'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white">
                             <div className="max-w-4xl mx-auto flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="e.g., 'Find me a server for AI safety research'"
                                    className="flex-grow px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                />
                                <button onClick={handleSendMessage} className="px-4 py-3 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition-colors shadow-sm">
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold text-gray-500 mb-4">Tell me what you are looking for?</h2>
                        <div className="w-full max-w-xl flex">
                             <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="e.g., 'Find me a server for AI safety research'"
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                            />
                            <button onClick={handleSendMessage} className="px-4 py-3 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition-colors shadow-sm">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};


// --- Dendogram View Component ---
const DendogramView = () => {
    // State for the interactive dendogram
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [expandedServer, setExpandedServer] = useState(null);
    const [dendogramData, setDendogramData] = useState(null);

    // State for clustering options
    const [clusterFeatures, setClusterFeatures] = useState({
        'Server Type': true,
        'Activity Level': false,
        'Language': false,
        'Location': false,
        'Others': false,
    });
    const [includeScore, setIncludeScore] = useState(false);
    
    // State for applied clustering options
    const [appliedClusterFeatures, setAppliedClusterFeatures] = useState(clusterFeatures);
    const [appliedIncludeScore, setAppliedIncludeScore] = useState(includeScore);


    // Expanded dummy data for more interesting clusters
    const servers = useMemo(() => [
        { name: 'EleutherAI', rating: 8.1, tag: 'Research', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Community for large-scale AI research.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'Cohere for AI', rating: 8.1, tag: 'Research', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Non-profit research lab from Cohere.', features: ['Paper Channel', 'Jobs Board'] },
        { name: 'AI Safety Camp', rating: 7.8, tag: 'Alignment', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'AI safety research and workshops.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'The Alignment Problem', rating: 9.2, tag: 'Alignment', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Dedicated to solving the AI alignment problem.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'GPU Collective', rating: 7.2, tag: 'GPU', activityLevel: 'Semi-active', language: 'English', location: 'Discord', description: 'Sharing GPU resources.', features: ['Jobs Board'] },
        { name: 'LLM Builders', rating: 9.1, tag: 'LLM', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'For developers working on Large Language Models.', features: ['Paper Channel', 'Jobs Board'] },
        { name: 'LLM Fine-Tuning', rating: 8.8, tag: 'LLM', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Techniques for fine-tuning LLMs.', features: ['Paper Channel'] },
        { name: 'Seoul AI Hub', rating: 6.9, tag: 'General', activityLevel: 'Active', language: 'Korean', location: 'Discord', description: 'Korean-speaking AI community.', features: ['Reading Group', 'Jobs Board'] },
        { name: 'Korean AI Tech', rating: 7.3, tag: 'General', activityLevel: 'Active', language: 'Korean', location: 'Discord', description: 'A Korean-speaking community for all AI topics.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'Hackathon Heroes', rating: 8.6, tag: 'Hackathons', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Team up for AI hackathons.', features: ['Jobs Board'] },
        { name: 'Deep AI 10', rating: 8.7, tag: 'Hackathons', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Weekly hackathons and coding challenges.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'Robotics & Automation', rating: 8.5, tag: 'Robotics', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Building and programming intelligent robots.', features: ['Jobs Board'] },
        { name: 'Autonomous Agents', rating: 9.0, tag: 'Robotics', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'Developing autonomous AI agents.', features: ['Jobs Board'] },
        { name: 'AI Startup Incubator', rating: 8.0, tag: 'Entrepreneurship', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Connect with AI entrepreneurs.', features: ['VC events/Office Hours', 'Jobs Board'] },
        { name: 'Startup Founders AI', rating: 8.7, tag: 'Entrepreneurship', activityLevel: 'Very Active', language: 'English', location: 'Discord', description: 'A community for founders of AI startups.', features: ['VC events/Office Hours'] },
        { name: 'Casual Coders', rating: 6.5, tag: 'Casual', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A friendly place to chat about code.', features: ['Reading Group'] },
        { name: 'Machine Learning Cafe', rating: 7.4, tag: 'Casual', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'A relaxed space for ML enthusiasts.', features: ['Reading Group'] },
        { name: 'Research Paper Club', rating: 8.6, tag: 'Research', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Weekly discussions of new AI research papers.', features: ['Reading Group', 'Paper Channel'] },
        { name: 'AI Ethics Discussion', rating: 8.2, tag: 'Alignment', activityLevel: 'Active', language: 'English', location: 'Discord', description: 'Debating the ethical implications of AI.', features: ['Reading Group'] },
        { name: 'IRL AI Meetup Group', rating: 8.8, tag: 'Conference', activityLevel: 'Active', language: 'English', location: 'Irl', description: 'Organizing in-person AI meetups.', features: ['VC events/Office Hours'] },
        { name: 'Corporate AI Solutions', rating: 8.4, tag: 'Company', activityLevel: 'Active', language: 'English', location: 'Slack', description: 'AI implementation in large companies.', features: ['Jobs Board'] },
    ], []);

    // This function simulates hierarchical clustering by recursively grouping servers.
    const generateDendogram = useCallback((serversToCluster, featureOptions, sortByScore) => {
        // Recursive helper function to group servers
        const groupServers = (servers, keys, parentId = 'root') => {
            if (keys.length === 0 || servers.length === 0) {
                // Base case: If no more keys, or no servers, create leaf nodes
                let finalServers = [...servers];
                if (sortByScore) {
                    finalServers.sort((a, b) => b.rating - a.rating);
                }
                return finalServers.map((server, i) => ({
                    id: `${parentId}-${server.name.replace(/\s+/g, '')}-${i}`, // Ensure unique ID for leaves
                    name: server.name,
                    isLeaf: true,
                    server: server,
                    servers: [server]
                }));
            }

            const [currentKey, ...restKeys] = keys;
            
            // Group servers by the current feature key
            const grouped = servers.reduce((acc, server) => {
                const value = server[currentKey] || 'N/A';
                if (!acc[value]) {
                    acc[value] = [];
                }
                acc[value].push(server);
                return acc;
            }, {});

            // Recursively process each group
            return Object.entries(grouped).map(([groupName, serversInGroup]) => {
                const nodeId = `${parentId}-${currentKey}-${groupName.replace(/\s+/g, '')}`;
                const children = groupServers(serversInGroup, restKeys, nodeId);
                return {
                    id: nodeId,
                    name: `${groupName}`,
                    servers: serversInGroup,
                    children: children,
                };
            });
        };
        
        const featureMap = {
            'Server Type': 'tag',
            'Activity Level': 'activityLevel',
            'Language': 'language',
            'Location': 'location',
        };

        const activeFeatureKeys = Object.entries(featureOptions)
            .filter(([, isActive]) => isActive)
            .map(([name]) => featureMap[name])
            .filter(Boolean);
        
        if (activeFeatureKeys.length === 0) {
             return {
                id: 'root',
                name: 'All Servers',
                servers: serversToCluster,
                children: serversToCluster.map((s, i) => ({ id: `${s.name}-${i}`, name: s.name, isLeaf: true, server: s, servers: [s] }))
            };
        }

        const rootChildren = groupServers(serversToCluster, activeFeatureKeys, 'root');

        return {
            id: 'root',
            name: 'All Servers',
            servers: serversToCluster,
            children: rootChildren,
        };
    }, []);

    // Generate dendogram when component mounts or when options change
    useEffect(() => {
        const data = generateDendogram(servers, appliedClusterFeatures, appliedIncludeScore);
        setDendogramData(data);
        setSelectedNode(data);
        setExpandedFolders({root: true}); // Auto-expand the root
    }, [servers, generateDendogram, appliedClusterFeatures, appliedIncludeScore]);

    const handleUpdateClusters = () => {
        setAppliedClusterFeatures(clusterFeatures);
        setAppliedIncludeScore(includeScore);
    };
    
    const getAllDescendantIds = (node) => {
        let ids = [];
        if (node.children && !node.isLeaf) {
            node.children.forEach(child => {
                if (!child.isLeaf) {
                    ids.push(child.id);
                    ids = ids.concat(getAllDescendantIds(child));
                }
            });
        }
        return ids;
    };

    const toggleFolder = (node) => {
        const isFirstLevel = dendogramData && dendogramData.children.some(child => child.id === node.id);

        setExpandedFolders(prev => {
            const newExpanded = {...prev};
            const isCurrentlyExpanded = !!newExpanded[node.id];
            
            const descendantIds = getAllDescendantIds(node);

            if (isCurrentlyExpanded) {
                delete newExpanded[node.id];
                if (isFirstLevel) {
                    descendantIds.forEach(id => delete newExpanded[id]);
                }
            } else {
                newExpanded[node.id] = true;
                if (isFirstLevel) {
                    descendantIds.forEach(id => {
                        newExpanded[id] = true;
                    });
                }
            }
            return newExpanded;
        });
    };
    
    const handleFeatureChange = (featureName) => {
        setClusterFeatures(prev => ({
            ...prev,
            [featureName]: !prev[featureName]
        }));
    };

    // Recursive component to render the folder tree
    const Folder = ({ node, depth = 0 }) => (
        <div>
            <div className={`flex items-center space-x-2 py-1 rounded-md transition-colors ${selectedNode?.id === node.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}>
                <div style={{ paddingLeft: `${depth * 1.5}rem` }} className="flex items-center space-x-2 flex-grow">
                    <button onClick={() => !node.isLeaf && toggleFolder(node)} className="w-5 h-5 flex items-center justify-center text-gray-500">
                        {!node.isLeaf && (
                            expandedFolders[node.id] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />
                        )}
                    </button>
                    <button onClick={() => setSelectedNode(node)} className="flex items-center space-x-2 text-left">
                        {node.isLeaf ? <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                        <span className="text-sm font-medium">{node.name} {!node.isLeaf && `(${node.servers.length})`}</span>
                    </button>
                </div>
            </div>
            {expandedFolders[node.id] && !node.isLeaf && (
                <div>
                    {node.children.map(child => <Folder key={child.id} node={child} depth={depth + 1} />)}
                </div>
            )}
        </div>
    );
    
    const serversToShow = useMemo(() => {
        const serverList = selectedNode?.isLeaf ? [selectedNode.server] : selectedNode?.servers;
        if (!serverList) return [];

        if (appliedIncludeScore) {
            return [...serverList].sort((a, b) => b.rating - a.rating);
        }
        return serverList;
    }, [selectedNode, appliedIncludeScore]);


    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Server Similarity Dendogram</h2>
                <p className="text-gray-600">Hierarchical clustering based on your selected attributes</p>
            </div>

            {/* Clustering Options Panel */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 border">
                    <h3 className="text-lg font-semibold mb-3">Clustering Options</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="font-medium">Cluster By:</div>
                        {Object.keys(clusterFeatures).map(feature => (
                            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={clusterFeatures[feature]}
                                    onChange={() => handleFeatureChange(feature)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm">{feature}</span>
                            </label>
                        ))}
                        <div className="border-l pl-6 flex items-center gap-x-6">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeScore}
                                    onChange={() => setIncludeScore(prev => !prev)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium">Sort by Score</span>
                            </label>
                            <button 
                                onClick={handleUpdateClusters}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Update Clusters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <div>
                        <p className="text-sm text-gray-500">Click {'>'} to expand clusters.</p>
                        <p className="text-sm text-gray-500 mb-2">Click a folder or file name to view details on the right.</p>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 mt-2">Server Clusters</h3>
                    <div className="border rounded-lg p-2 bg-white shadow-sm overflow-auto">
                        {dendogramData && <Folder node={dendogramData} depth={0} />}
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2 mt-10">Servers in: <span className="font-normal text-indigo-600">{selectedNode?.name}</span></h3>
                    <div className="space-y-2">
                        <div className="p-2 flex items-center border-b font-bold text-sm text-gray-600 bg-gray-50 rounded-t-lg">
                            <div className="w-1/6">Score</div>
                            <div className="w-2/6">Name</div>
                            <div className="w-2/6">Type</div>
                            <div className="w-1/6">Link</div>
                            <div className="w-10"></div>
                        </div>
                        {serversToShow?.map(server => (
                            <div key={server.name} className="border rounded-md bg-white">
                                <div className="p-2 flex items-center">
                                    <div className="w-1/6 font-medium text-sm">{server.rating}</div>
                                    <div className="w-2/6 font-medium text-sm">{server.name}</div>
                                    <div className="w-2/6 text-sm">{server.tag}</div>
                                    <div className="w-1/6 text-sm"><a href="#" className="text-indigo-600 hover:underline">link</a></div>
                                    <div className="w-10 flex justify-center">
                                        <button onClick={() => setExpandedServer(expandedServer === server.name ? null : server.name)}>
                                            {expandedServer === server.name ? <MinusIcon className="w-5 h-5 text-gray-500" /> : <PlusIcon className="w-5 h-5 text-gray-500" />}
                                        </button>
                                    </div>
                                </div>
                                {expandedServer === server.name && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="flex">
                                            <p className="w-24 flex-shrink-0 text-sm font-semibold text-gray-600">Description:</p>
                                            <p className="text-sm text-gray-600">{server.description}</p>
                                        </div>
                                        <div className="flex">
                                            <p className="w-24 flex-shrink-0 text-sm font-semibold text-gray-600">Features:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {server.features.map(tag => <FilterTag key={tag} tag={tag} isSelected={false} onClick={() => {}} />)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- New Component for the Floating Card ---
const PinnedServerCard = ({ data, onClose, chartRef }) => {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({ opacity: 0, pointerEvents: 'none' });

    useLayoutEffect(() => {
        if (data && cardRef.current && chartRef.current) {
            const { x, y } = data;
            const chartRect = chartRef.current.getBoundingClientRect();
            const cardWidth = cardRef.current.offsetWidth;
            const cardHeight = cardRef.current.offsetHeight;

            // Horizontal positioning: Check if the card would overflow the right boundary
            let finalX = x + 20; // Default position: to the right of the node
            if (finalX + cardWidth > chartRect.width - 10) { // 10px buffer
                finalX = x - cardWidth - 20; // Flip to the left
            }

            // Vertical positioning: Clamp the card to stay within the vertical boundaries
            let finalY = y;
            if (y - cardHeight / 2 < 10) { // 10px buffer from top
                finalY = cardHeight / 2 + 10;
            } else if (y + cardHeight / 2 > chartRect.height - 10) { // 10px buffer from bottom
                finalY = chartRect.height - cardHeight / 2 - 10;
            }

            setStyle({
                position: 'absolute',
                top: `${finalY}px`,
                left: `${finalX}px`,
                transform: 'translateY(-50%)',
                zIndex: 50,
                opacity: 1,
                transition: 'opacity 0.2s ease-in-out',
            });
        }
    }, [data, chartRef]);

    if (!data) return null;
    
    const { server } = data;
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800';

    return (
        <div 
            ref={cardRef}
            style={style} 
            className="w-72 bg-white rounded-xl shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{server.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center flex-wrap gap-x-3 text-xs mb-3">
                    <span className="flex items-center font-bold"><StarIcon className="w-4 h-4 mr-1" />{server.rating}</span>
                    <span className="px-2 py-0.5 border border-gray-300 rounded-full font-semibold">{server.tag}</span>
                    <span className={`px-2 py-0.5 ${activityClass} rounded-full font-semibold`}>
                        {server.activityLevel}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{server.description}</p>
                <div className="flex flex-wrap gap-2">
                    {server.features.map(feature => {
                        const style = featureTagStyles[feature];
                        if (!style) return null;
                        return (
                            <span key={feature} className={`inline-flex items-center gap-1.5 px-2 py-1 ${style.color} rounded-md text-xs font-medium`}>
                                {style.icon}
                                {feature}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-b-xl">
                 <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Join Server
                    <ExternalLinkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// --- FIX: Moved clusterData outside the component ---
// This data is now a constant and won't be recreated on every render.
const clusterData = {
  "servers": [
    {"name": "EleutherAI", "rating": 8.1, "tag": "Research", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Lots of resources; community projects to do and very active community.", "features": ["Reading Group", "Paper Channel", "VC events/Office Hours", "Jobs Board"], "x": 10.370316505432129, "y": 5.420857906341553, "cluster_id": 3},
    {"name": "Cohere for AI", "rating": 8.1, "tag": "Research", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Pretty good. Lots of stuff to do for various skill levels.", "features": ["Reading Group", "Paper Channel", "VC events/Office Hours"], "x": 10.428757667541504, "y": 5.405788421630859, "cluster_id": 3},
    {"name": "AI Safety Camp", "rating": 7.8, "tag": "Alignment", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Focused on AI safety research and education with regular workshops.", "features": ["Reading Group", "Paper Channel", "VC events/Office Hours", "Jobs Board"], "x": 10.398018836975098, "y": 5.419445037841797, "cluster_id": 3},
    {"name": "GPU Collective", "rating": 7.2, "tag": "GPU", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Community for sharing GPU resources and optimization techniques.", "features": ["VC events/Office Hours", "Jobs Board"], "x": 8.4111328125, "y": 7.152174949645996, "cluster_id": 0},
    {"name": "Seoul AI Hub", "rating": 6.9, "tag": "General", "activityLevel": "Active", "language": "Korean", "location": "Discord", "description": "Korean-speaking AI community with regular paper discussions.", "features": ["Reading Group", "Paper Channel", "Jobs Board"], "x": 11.238466262817383, "y": 4.1088666915893555, "cluster_id": -1},
    {"name": "Prompt Engineering Masters", "rating": 7.5, "tag": "Prompting", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Advanced techniques and strategies for prompt engineering.", "features": ["VC events/Office Hours"], "x": 7.411604881286621, "y": 7.350849151611328, "cluster_id": 0},
    {"name": "Robotics Research Group", "rating": 7.4, "tag": "Robotics", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Connect with AI entrepreneurs and find co-founders.", "features": ["VC events/Office Hours", "Jobs Board"], "x": 8.16782283782959, "y": 6.136894226074219, "cluster_id": 0},
    {"name": "Neural AI 9", "rating": 7.0, "tag": "Research", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "A place for all things related to neural networks.", "features": ["Paper Channel"], "x": 10.428731918334961, "y": 5.253073215484619, "cluster_id": 3},
    {"name": "Deep AI 10", "rating": 8.7, "tag": "Hackathons", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Weekly hackathons and coding challenges.", "features": ["VC events/Office Hours", "Jobs Board"], "x": 8.441052436828613, "y": 7.151704788208008, "cluster_id": 0},
    {"name": "AI Startup Incubator", "rating": 8.0, "tag": "Entrepreneurship", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Connect with AI entrepreneurs and find co-founders.", "features": ["VC events/Office Hours", "Jobs Board"], "x": 8.42398452758789, "y": 7.147983551025391, "cluster_id": 0},
    {"name": "Casual Coders", "rating": 6.5, "tag": "Casual", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "A friendly place to chat about code and projects.", "features": ["Reading Group"], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "LLM Builders", "rating": 9.1, "tag": "LLM", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "For developers and researchers working on Large Language Models.", "features": ["Paper Channel", "Jobs Board"], "x": 9.182415962219238, "y": 5.093539237976074, "cluster_id": 2},
    {"name": "Bug Bounty Hunters", "rating": 7.9, "tag": "Bug bounties", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Find and report vulnerabilities in AI systems.", "features": [], "x": 7.730303764343262, "y": 8.428784370422363, "cluster_id": -1},
    {"name": "AI Conference Hub", "rating": 8.3, "tag": "Conference", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Discuss upcoming AI conferences and share insights.", "features": ["VC events/Office Hours"], "x": 7.411604881286621, "y": 7.350849151611328, "cluster_id": 0},
    {"name": "Crypto & AI", "rating": 6.8, "tag": "Crypto", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Exploring the intersection of cryptocurrency and artificial intelligence.", "features": [], "x": 6.702220439910889, "y": 8.169151306152344, "cluster_id": -1},
    {"name": "Puzzle Solvers AI", "rating": 7.1, "tag": "Puzzle", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Using AI to solve complex puzzles and games.", "features": ["Reading Group"], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "Generative Art Gallery", "rating": 8.5, "tag": "Generation", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Showcase and discuss AI-generated art.", "features": ["Paper Channel"], "x": 9.123537063598633, "y": 4.96541690826416, "cluster_id": 2},
    {"name": "AI for Education", "rating": 7.7, "tag": "Education", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Developing and using AI tools for learning.", "features": ["Reading Group", "Jobs Board"], "x": 9.432653427124023, "y": 3.8617305755615234, "cluster_id": 1},
    {"name": "Open Source AI Tools", "rating": 8.4, "tag": "Tool", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Contribute to and discuss open-source AI projects.", "features": ["Jobs Board"], "x": 8.243552207946777, "y": 5.923832893371582, "cluster_id": 0},
    {"name": "Korean AI Tech", "rating": 7.3, "tag": "General", "activityLevel": "Active", "language": "Korean", "location": "Discord", "description": "A Korean-speaking community for all AI topics.", "features": ["Reading Group", "Paper Channel"], "x": 11.238466262817383, "y": 4.1088666915893555, "cluster_id": -1},
    {"name": "Slack AI Innovators", "rating": 7.0, "tag": "Tool", "activityLevel": "Semi-active", "language": "English", "location": "Slack", "description": "A Slack community for AI developers.", "features": [], "x": 8.16782283782959, "y": 6.136894226074219, "cluster_id": 0},
    {"name": "IRL AI Meetup Group", "rating": 8.8, "tag": "Conference", "activityLevel": "Active", "language": "English", "location": "Irl", "description": "Organizing in-person AI meetups and events.", "features": ["VC events/Office Hours"], "x": 7.411604881286621, "y": 7.350849151611328, "cluster_id": 0},
    {"name": "The Alignment Problem", "rating": 9.2, "tag": "Alignment", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Dedicated to solving the AI alignment problem.", "features": ["Reading Group", "Paper Channel"], "x": 10.398018836975098, "y": 5.419445037841797, "cluster_id": 3},
    {"name": "Hackathon Heroes", "rating": 8.6, "tag": "Hackathons", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Team up for AI hackathons and competitions.", "features": ["Jobs Board"], "x": 8.441052436828613, "y": 7.151704788208008, "cluster_id": 0},
    {"name": "GPU Traders", "rating": 6.7, "tag": "GPU", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "A community for buying, selling, and trading GPUs.", "features": [], "x": 6.702220439910889, "y": 8.169151306152344, "cluster_id": -1},
    {"name": "AI Ethics Discussion", "rating": 8.2, "tag": "Alignment", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Debating the ethical implications of AI.", "features": ["Reading Group"], "x": 10.428731918334961, "y": 5.253073215484619, "cluster_id": 3},
    {"name": "Machine Learning Cafe", "rating": 7.4, "tag": "Casual", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "A relaxed space for ML enthusiasts.", "features": ["Reading Group"], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "Prompt Perfect", "rating": 7.9, "tag": "Prompting", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Master the art of prompt engineering.", "features": ["Paper Channel"], "x": 9.123537063598633, "y": 4.96541690826416, "cluster_id": 2},
    {"name": "Code Generation Guild", "rating": 8.1, "tag": "Generation", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Exploring AI-powered code generation.", "features": ["Jobs Board"], "x": 9.182415962219238, "y": 5.093539237976074, "cluster_id": 2},
    {"name": "Robotics & Automation", "rating": 8.5, "tag": "Robotics", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Building and programming intelligent robots.", "features": ["Jobs Board"], "x": 8.243552207946777, "y": 5.923832893371582, "cluster_id": 0},
    {"name": "AI Company Connect", "rating": 8.9, "tag": "Company", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "A network for professionals at AI companies.", "features": ["VC events/Office Hours", "Jobs Board"], "x": 8.42398452758789, "y": 7.147983551025391, "cluster_id": 0},
    {"name": "The Puzzle Box", "rating": 7.6, "tag": "Puzzle", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "A community for AI-based puzzle solving.", "features": ["Reading Group"], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "LLM Fine-Tuning", "rating": 8.8, "tag": "LLM", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Techniques and best practices for fine-tuning LLMs.", "features": ["Paper Channel"], "x": 9.123537063598633, "y": 4.96541690826416, "cluster_id": 2},
    {"name": "AI in Finance", "rating": 7.8, "tag": "Crypto", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Applying AI to financial markets and cryptocurrency.", "features": ["Jobs Board"], "x": 6.702220439910889, "y": 8.169151306152344, "cluster_id": -1},
    {"name": "EdTech AI", "rating": 7.5, "tag": "Education", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Innovating in education with AI.", "features": ["Reading Group"], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "The Turing Test", "rating": 7.2, "tag": "Casual", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Casual chats about AI and consciousness.", "features": [], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "AI Hardware Hub", "rating": 8.0, "tag": "GPU", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Discussions on hardware for AI, including GPUs and TPUs.", "features": ["Jobs Board"], "x": 8.4111328125, "y": 7.152174949645996, "cluster_id": 0},
    {"name": "Startup Founders AI", "rating": 8.7, "tag": "Entrepreneurship", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "A community for founders of AI startups.", "features": ["VC events/Office Hours"], "x": 7.411604881286621, "y": 7.350849151611328, "cluster_id": 0},
    {"name": "AI Art Prompters", "rating": 8.3, "tag": "Prompting", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Sharing prompts and creations for AI art generation.", "features": [], "x": 7.730303764343262, "y": 8.428784370422363, "cluster_id": -1},
    {"name": "Research Paper Club", "rating": 8.6, "tag": "Research", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Weekly discussions of new AI research papers.", "features": ["Reading Group", "Paper Channel"], "x": 10.428731918334961, "y": 5.253073215484619, "cluster_id": 3},
    {"name": "Autonomous Agents", "rating": 9.0, "tag": "Robotics", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Developing autonomous AI agents.", "features": ["Jobs Board"], "x": 8.243552207946777, "y": 5.923832893371582, "cluster_id": 0},
    {"name": "AI for Good", "rating": 8.9, "tag": "Alignment", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Using AI to solve social and environmental problems.", "features": ["VC events/Office Hours"], "x": 10.428757667541504, "y": 5.405788421630859, "cluster_id": 3},
    {"name": "The Generative Lounge", "rating": 7.9, "tag": "Generation", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "A place to share and discuss generative models.", "features": ["Paper Channel"], "x": 9.123537063598633, "y": 4.96541690826416, "cluster_id": 2},
    {"name": "AI Toolmakers", "rating": 8.2, "tag": "Tool", "activityLevel": "Very Active", "language": "English", "location": "Discord", "description": "Building the next generation of AI tools.", "features": ["Jobs Board"], "x": 8.243552207946777, "y": 5.923832893371582, "cluster_id": 0},
    {"name": "Global AI Conference", "rating": 8.5, "tag": "Conference", "activityLevel": "Active", "language": "English", "location": "Irl", "description": "The official server for the Global AI Conference.", "features": ["VC events/Office Hours"], "x": 7.411604881286621, "y": 7.350849151611328, "cluster_id": 0},
    {"name": "Data Science Dojo", "rating": 7.7, "tag": "Education", "activityLevel": "Active", "language": "English", "location": "Discord", "description": "Learn and practice data science with a supportive community.", "features": ["Reading Group", "Jobs Board"], "x": 9.432653427124023, "y": 3.8617305755615234, "cluster_id": 1},
    {"name": "The Logic Puzzle", "rating": 7.3, "tag": "Puzzle", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Solving logic puzzles with and without AI.", "features": [], "x": 9.42111587524414, "y": 3.792558431625366, "cluster_id": 1},
    {"name": "Corporate AI Solutions", "rating": 8.4, "tag": "Company", "activityLevel": "Active", "language": "English", "location": "Slack", "description": "Discussing the implementation of AI in large companies.", "features": ["Jobs Board"], "x": 8.42398452758789, "y": 7.147983551025391, "cluster_id": 0},
    {"name": "Web3 & AI Nexus", "rating": 7.1, "tag": "Crypto", "activityLevel": "Semi-active", "language": "English", "location": "Discord", "description": "Exploring the synergy between Web3 and AI.", "features": [], "x": 6.702220439910889, "y": 8.169151306152344, "cluster_id": -1}
  ],
  "clusters": {
    "3": {"label": "Research & Alignment focused", "server_count": 7, "average_score": 8.29, "top_tags": ["Research", "Alignment"]},
    "0": {"label": "VC events/Office Hours & Jobs Board focused", "server_count": 15, "average_score": 8.11, "top_tags": ["VC events/Office Hours", "Jobs Board"]},
    "1": {"label": "Reading Group & Casual focused", "server_count": 7, "average_score": 7.24, "top_tags": ["Reading Group", "Casual"]},
    "2": {"label": "Paper Channel & LLM focused", "server_count": 5, "average_score": 8.68, "top_tags": ["Paper Channel", "LLM"]}
  }
};

// --- UMAP Cluster View Component ---
const UMAPView = () => {
    const [pinnedServer, setPinnedServer] = useState(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const chartRef = useRef(null);
    const tooltipRef = useRef(null);
    const infoBoxRef = useRef(null);

    // --- STEP 1: Create a Centralized Color Mapping ---
    const CLUSTER_COLOR_MAP = {
      '0': '#1f77b4', // Blue
      '1': '#ff7f0e', // Orange
      '2': '#2ca02c', // Green
      '3': '#d62728', // Red
    };
    
    const OUTLIER_COLOR = "#cccccc";

    // Helper function for deterministic color lookup
    const getColor = useCallback((clusterId) => {
        if (clusterId === -1) return OUTLIER_COLOR;
        // Ensure the key is a string when accessing the map
        return CLUSTER_COLOR_MAP[String(clusterId)] || OUTLIER_COLOR; 
    }, []);

    // --- STEP 2: Modify useMemo ---
    const { xScale, yScale, radiusScale } = useMemo(() => {
        if (!clusterData) return {};
        
        const { servers } = clusterData;

        const xExtent = d3.extent(servers, d => d.x);
        const yExtent = d3.extent(servers, d => d.y);
        const scoreExtent = d3.extent(servers, d => d.rating);
        const padding = 1.5;

        const memoizedXScale = d3.scaleLinear().domain([xExtent[0] - padding, xExtent[1] + padding]);
        const memoizedYScale = d3.scaleLinear().domain([yExtent[0] - padding, yExtent[1] + padding]);
        const memoizedRadiusScale = d3.scaleSqrt().domain(scoreExtent).range([5, 15]);

        return { 
            xScale: memoizedXScale, 
            yScale: memoizedYScale, 
            radiusScale: memoizedRadiusScale, 
        };
    }, []); // Dependency array is now empty because clusterData is a stable constant


    // This useEffect hook runs to draw the D3 chart.
    useEffect(() => {
        if (!clusterData || !chartRef.current || !xScale) return;

        const { servers, clusters } = clusterData;
        const container = chartRef.current;
        const tooltip = d3.select(tooltipRef.current);
        
        const drawChart = () => {
            d3.select(container).select("svg").remove();
            d3.select(container).select("#legend-container").remove();

            const width = container.clientWidth;
            const height = container.clientHeight;

            xScale.range([0, width]);
            yScale.range([height, 0]);

            const svg = d3.select(container).append("svg")
                .attr("width", width)
                .attr("height", height)
                .on("click", () => setPinnedServer(null));

            const mainGroup = svg.append("g");
            
            let simulationNodes = servers.map(d => ({...d}));

            const simulation = d3.forceSimulation(simulationNodes)
                .force("collide", d3.forceCollide(d => radiusScale(d.rating) + 2).strength(0.7))
                .force("x", d3.forceX(d => xScale(d.x)).strength(0.1))
                .force("y", d3.forceY(d => yScale(d.y)).strength(0.1))
                .stop();

            for (let i = 0; i < 120; ++i) simulation.tick();

            const hullGroup = mainGroup.append("g").attr("class", "hulls");
            const nodeGroup = mainGroup.append("g").attr("class", "nodes");
            
            const pointsByCluster = d3.group(simulationNodes, d => d.cluster_id);
            const hullLine = d3.line().curve(d3.curveCatmullRomClosed);

            for (const [clusterId, points] of pointsByCluster.entries()) {
                if (clusterId === -1 || points.length < 3) continue;

                const screenPoints = points.map(p => [p.x, p.y]);
                const hull = d3.polygonHull(screenPoints);
                if (!hull) continue;

                const hullPadding = 35;
                const centroid = d3.polygonCentroid(hull);
                const paddedHull = hull.map(p => {
                    const angle = Math.atan2(p[1] - centroid[1], p[0] - centroid[0]);
                    return [p[0] + hullPadding * Math.cos(angle), p[1] + hullPadding * Math.sin(angle)];
                });

                hullGroup.append("path")
                    .attr("d", hullLine(paddedHull))
                    .attr("fill", getColor(clusterId))
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", getColor(clusterId))
                    .attr("stroke-opacity", 0.3)
                    .attr("stroke-width", 1)
                    .attr("stroke-linejoin", "round");
            }

            const nodes = nodeGroup.selectAll("circle")
                .data(simulationNodes)
                .join("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => radiusScale(d.rating))
                .attr("fill", d => getColor(d.cluster_id))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .attr("cursor", "pointer")
                .style("transition", "r 0.2s, opacity 0.2s")
                .style("opacity", 0.8)
                .on("mouseover", (event, d) => {
                    d3.select(event.currentTarget).attr("r", radiusScale(d.rating) * 1.5);
                    nodeGroup.selectAll("circle").style("opacity", n => n === d ? 1 : 0.3);
                    
                    tooltip.style("visibility", "visible").style("opacity", 1);
                    tooltip.html(`<strong>${d.name}</strong><br/><span class="font-bold text-yellow-400">Score: ${d.rating}</span>`);
                })
                .on("mousemove", (event) => {
                    const [x, y] = d3.pointer(event, container);
                    tooltip.style("top", (y - 10) + "px")
                           .style("left", (x + 10) + "px");
                })
                .on("mouseout", (event, d) => {
                    d3.select(event.currentTarget).attr("r", radiusScale(d.rating));
                    nodeGroup.selectAll("circle").style("opacity", 0.8);
                    tooltip.style("visibility", "hidden").style("opacity", 0);
                })
                .on("click", (event, d) => {
                    event.stopPropagation();
                    const [x, y] = d3.pointer(event, container);
                    setPinnedServer({
                        server: d,
                        x: x,
                        y: y
                    });
                });
            
            const legendContainer = d3.select(container).append("div")
                .attr("id", "legend-container")
                .attr("class", "absolute top-4 left-4 bg-white/30 backdrop-blur-sm p-3 rounded-lg shadow-lg");

            legendContainer.append("h3").attr("class", "text-sm font-semibold mb-2 text-gray-700").text("Cluster Legend");
            const legendItems = legendContainer.append("div").attr("class", "flex flex-col space-y-1");
            const sortedClusters = Object.entries(clusters).sort((a, b) => a[0] - b[0]);

            for (const [clusterId, info] of sortedClusters) {
                const item = legendItems.append("div").attr("class", "flex items-center text-xs");
                item.append("div")
                    .attr("class", "w-3 h-3 rounded-sm mr-2 flex-shrink-0")
                    .style("background-color", getColor(clusterId));
                item.append("span").text(info.label);
            }
            
            const outlierItem = legendItems.append("div").attr("class", "flex items-center text-xs");
            outlierItem.append("div")
                .attr("class", "w-3 h-3 rounded-sm mr-2 flex-shrink-0")
                .style("background-color", OUTLIER_COLOR);
            outlierItem.append("span").text("Outliers");


            const zoom = d3.zoom()
                .scaleExtent([0.2, 8])
                .on("zoom", (event) => {
                    mainGroup.attr("transform", event.transform);
                });

            svg.call(zoom);
        }

        drawChart();
        
        const resizeObserver = new ResizeObserver(drawChart);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
        };

    }, [xScale, yScale, radiusScale, getColor]);

    // Effect to handle clicks outside the info box
    useEffect(() => {
        function handleClickOutside(event) {
            if (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) {
                setIsInfoVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [infoBoxRef]);


    return (
        <div className="w-full h-full p-4 bg-gray-50 relative overflow-hidden">
            <div className="w-full h-full border rounded-lg bg-white shadow-sm relative" ref={chartRef}>
                 <div 
                    ref={tooltipRef} 
                    className="absolute invisible bg-gray-900 text-white text-xs rounded-md px-3 py-1.5 pointer-events-none transition-opacity opacity-0 whitespace-nowrap z-50"
                ></div>
                {pinnedServer && (
                    <PinnedServerCard 
                        data={pinnedServer} 
                        onClose={() => setPinnedServer(null)} 
                        chartRef={chartRef}
                    />
                )}
            </div>

            {/* Info Button and Box */}
            <div className="absolute bottom-8 left-8 z-20">
                <button 
                    onClick={() => setIsInfoVisible(prev => !prev)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <InfoIcon className="w-6 h-6 text-gray-600" />
                </button>
                {isInfoVisible && (
                    <div ref={infoBoxRef} className="absolute bottom-full mb-2 w-80 bg-white rounded-lg shadow-xl border p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">How It Works</h4>
                            <button onClick={() => setIsInfoVisible(false)} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 space-y-2">
                            <span>
                                Servers are plotted based on their characteristics using <strong>UMAP</strong> for dimensionality reduction. Dense groups are then identified using the <strong>HDBSCAN</strong> clustering algorithm.
                            </span>
                            <span className="block pt-2">
                                The size of each circle corresponds to its score, with larger circles indicating higher-rated servers.
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState('Server Explorer');
  const [chats, setChats] = useState({
      'initial-chat': {
          title: 'New Chat',
          messages: []
      }
  });
  const [activeChatId, setActiveChatId] = useState('initial-chat');

  const renderActiveTab = () => {
    switch (activeTab) {
        case 'Server Explorer':
            return <ListView />;
        case 'Folder Dendogram':
            return <DendogramView />;
        case 'UMAP Cluster':
            return <UMAPView />;
        case 'Assistant':
            return <AssistantView chats={chats} setChats={setChats} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />;
        case 'About':
            return <AboutView />;
        default:
            return <ListView />;
    }
  }

  return (
    <div className="h-screen bg-gray-100 font-sans flex flex-col">
      <Header setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-2" aria-label="Tabs">
            <Tab label="Server Explorer" isActive={activeTab === 'Server Explorer'} onClick={() => setActiveTab('Server Explorer')} />
            <Tab label="Folder Dendogram" isActive={activeTab === 'Folder Dendogram'} onClick={() => setActiveTab('Folder Dendogram')} />
            <Tab label="UMAP Cluster" isActive={activeTab === 'UMAP Cluster'} onClick={() => setActiveTab('UMAP Cluster')} />
            <Tab label="Assistant" isActive={activeTab === 'Assistant'} onClick={() => setActiveTab('Assistant')} />
          </nav>
        </div>

        {/* Main Content Container */}
        <div className={activeTab === 'UMAP Cluster' ? 'flex-1 relative' : 'mt-4 bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg shadow-inner'}>
           {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

