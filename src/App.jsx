import React, { useState, useMemo, useRef, useEffect } from 'react';

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
const ExternalLinkIcon = ({ className = 'w-4 h-4' }) => <Icon path="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" className={className} />;
const MinusIcon = ({ className = 'w-5 h-5' }) => <Icon path="M5 11h14v2H5z" className={className} />;
const PlusIcon = ({ className = 'w-5 h-5' }) => <Icon path="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" className={className} />;
const CloseIcon = ({ className = 'w-6 h-6' }) => <Icon path="M6.28 6.28a.75.75 0 00-1.06 1.06L10.94 12l-5.72 5.72a.75.75 0 101.06 1.06L12 13.06l5.72 5.72a.75.75 0 101.06-1.06L13.06 12l5.72-5.72a.75.75 0 00-1.06-1.06L12 10.94 6.28 6.28z" className={className} />;
const GridIcon = ({ className = 'w-5 h-5' }) => <Icon path="M2 2h9v9H2V2zm11 0h9v9h-9V2zM2 13h9v9H2v-9zm11 0h9v9h-9v-9z" className={className} />;
const ListIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" className={className} />;
const SortAscIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" className={className} />;
const SortDescIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3 6h6v2H3V6zm0 7h12v2H3v-2zm0 7h18v-2H3v2z" className={className} />;
const ChevronDownIcon = ({ className = 'w-4 h-4' }) => <Icon path="M12 15.25a1 1 0 01-.7-.29l-4-4a1 1 0 111.4-1.42L12 12.84l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-.7.29z" className={className} />;
const ChevronRightIcon = ({ className = 'w-4 h-4' }) => <Icon path="M10.75 16.4a.99.99 0 01-.7-.29.99.99 0 010-1.41L13.16 12l-3.1-3.1a.99.99 0 010-1.41 1 1 0 011.41 0l3.8 3.8a.99.99 0 010 1.41l-3.8 3.8a1 1 0 01-.71.29z" className={className} />;

// Header component for the top navigation bar
const Header = () => (
  <header className="bg-gray-100 text-gray-800">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">AI Discord Directory</h1>
        </div>
        <nav className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Funding</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Projects</a>
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
        <div className="w-full lg:w-1/4 xl:w-1/5 lg:sticky lg:top-6">
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
        <div onClick={() => onViewClick(server)} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 h-full cursor-pointer">
            {/* Top section of the card */}
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-blue-600 hover:underline">{server.name}</h3>
                <div className="flex items-center flex-wrap gap-x-3 text-sm text-gray-500 mt-1">
                    {server.rating >= 7.5 && <StarIcon />}
                    <span className="font-semibold text-gray-800 text-base">{server.rating}</span>
                    <span className="px-2 py-1 border border-gray-400 rounded-full text-xs font-semibold">{server.tag}</span>
                    <span className={`px-2 py-1 ${activityClass} rounded-full text-xs font-semibold`}>
                        {server.activityLevel}
                    </span>
                </div>
                 <div className="flex items-center space-x-2 text-sm text-gray-600 mt-3">
                    <DiscordIcon className="w-4 h-4 text-gray-500" />
                    <span>discord</span>
                    <span>•</span>
                    <LanguageIcon className="w-4 h-4 text-gray-500" />
                    <span>english</span>
                </div>
                <p className="text-gray-600 mt-3 text-sm">{server.description}</p>
            </div>

            {/* Bottom section of the card */}
            <div>
                <div className="flex flex-wrap gap-2 mt-4">
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
                <div className="border-t mt-4 pt-4 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onViewClick(server); }} className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors">
                            View
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors">
                            Join
                            <ExternalLinkIcon />
                        </button>
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servers.map(server => <ServerCard key={server.name} server={server} onViewClick={onViewClick} />)}
    </div>
);

const TableView = ({ servers, onViewClick }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {['Name', 'Score', 'Type', 'Activity', 'Location', 'Features', 'Link'].map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenDropdown(false);
                setActiveSubmenu(null);
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
                 newLevels[index].specificTag = 'none';
            }
        }
        setSortLevels(newLevels);
        setActiveSubmenu(null);
        setOpenDropdown(false);
    };

    const addLevel = () => {
        setSortLevels([...sortLevels, { key: 'name', direction: 'ascending', specificTag: 'none' }]);
    };

    const removeLevel = (index) => {
        setSortLevels(sortLevels.filter((_, i) => i !== index));
    };
    
    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setOpenDropdown(!openDropdown)} className="flex items-center space-x-2 p-2 border rounded-md bg-white text-sm">
                <span>Sort Priority</span>
                <ChevronDownIcon />
            </button>
            {openDropdown && (
                <div className="absolute top-full mt-1 w-72 bg-white border rounded-md shadow-lg z-10 p-2 space-y-2">
                    {sortLevels.map((level, index) => {
                        const selectedOption = sortOptions.find(opt => opt.value === level.key);
                        return (
                            <div key={index} className="flex items-center justify-between" onMouseLeave={() => setActiveSubmenu(null)}>
                                {sortLevels.length > 1 && (
                                    <button onClick={() => removeLevel(index)} className="p-2 text-gray-400 hover:text-red-600">
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="relative flex-grow" onMouseEnter={() => setActiveSubmenu(index)}>
                                    <button 
                                        className="w-full text-left p-2 hover:bg-gray-100 rounded-md flex justify-between items-center"
                                    >
                                        <span>{selectedOption.label}: {level.specificTag !== 'none' ? level.specificTag : level.direction}</span>
                                        <ChevronRightIcon />
                                    </button>
                                    {activeSubmenu === index && (
                                        <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-md shadow-lg">
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
                        <button onClick={addLevel} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 w-full text-left p-2">
                            + Add Sort Level
                        </button>
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
    const [sortLevels, setSortLevels] = useState([{ key: 'name', direction: 'ascending', specificTag: 'none' }]);
    
    const sortOptions = [
        { value: 'name', label: 'Name', type: 'value' },
        { value: 'rating', label: 'Score', type: 'value' },
        { value: 'activityLevelOrder', label: 'Activity', type: 'value' },
        { value: 'featureCount', label: 'Features', type: 'value' },
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
                <div className="w-full lg:w-3/4 xl:w-4/5">
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
            <ServerModal server={selectedServer} onClose={handleCloseModal} />
        </>
    );
};

// --- Placeholder Views for New Tabs ---
const PlaceholderView = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-500">{title}</h2>
        <p className="text-gray-400 mt-2">This is where the {title.toLowerCase()} visualization will go.</p>
    </div>
);

// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState('List View');

  const renderActiveTab = () => {
    switch (activeTab) {
        case 'List View':
            return <ListView />;
        case 'Dendogram':
            return <PlaceholderView title="Dendogram" />;
        case 't-SNE Cluster':
            return <PlaceholderView title="t-SNE Cluster" />;
        case 'XY Plot':
            return <PlaceholderView title="XY Plot" />;
        case 'Weighted Cluster':
            return <PlaceholderView title="Weighted Cluster" />;
        default:
            return <ListView />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2" aria-label="Tabs">
            <Tab label="List View" isActive={activeTab === 'List View'} onClick={() => setActiveTab('List View')} />
            <Tab label="Dendogram" isActive={activeTab === 'Dendogram'} onClick={() => setActiveTab('Dendogram')} />
            <Tab label="t-SNE Cluster" isActive={activeTab === 't-SNE Cluster'} onClick={() => setActiveTab('t-SNE Cluster')} />
            <Tab label="XY Plot" isActive={activeTab === 'XY Plot'} onClick={() => setActiveTab('XY Plot')} />
            <Tab label="Weighted Cluster" isActive={activeTab === 'Weighted Cluster'} onClick={() => setActiveTab('Weighted Cluster')} />
          </nav>
        </div>

        {/* Main Content Container */}
        <div className="mt-4 bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg shadow-inner">
           {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

