import React, { useState } from "react";

// --- Data (remains the same) ---
const serverTypes = ["research", "hackathons", "alignment", "GPU", "general", "generation", "education", "puzzle", "tool", "casual", "LLM", "prompting", "bug bounties", "robotics", "conference", "crypto", "entrepreneurship", "company"];
const activityLevels = ["very active", "active", "semi active", "mostly inactive", "inactive"];
const languages = ["english", "korean"];
const locations = ["discord", "slack", "irl"];

const servers = [
  { name: "EleutherAI", score: 8.1, type: "research", activity: "very active", language: "english", location: "discord", readingGroup: true, paperChannel: true, vcEvents: true, jobsBoard: true, link: "https://www.eleuther.ai/", notes: "Lots of resources; community projects to do and very active community." },
  { name: "Cohere for AI", score: 8.1, type: "research", activity: "very active", language: "english", location: "discord", readingGroup: true, paperChannel: true, vcEvents: true, jobsBoard: false, link: "https://share.hsforms.com/10OrjljwpQ52ILJA6ftE-Lg4sxgx", notes: "Pretty good! Lots of stuff to do for various skill levels." },
  { name: "AI Safety Camp", score: 7.8, type: "alignment", activity: "active", language: "english", location: "discord", readingGroup: true, paperChannel: true, vcEvents: true, jobsBoard: true, link: "#", notes: "Focused on AI safety research and education with regular workshops." },
  { name: "GPU Collective", score: 7.2, type: "GPU", activity: "active", language: "english", location: "discord", readingGroup: false, paperChannel: false, vcEvents: true, jobsBoard: true, link: "#", notes: "Community for sharing GPU resources and optimization techniques." },
  { name: "Seoul AI Hub", score: 6.9, type: "general", activity: "active", language: "korean", location: "discord", readingGroup: true, paperChannel: true, vcEvents: false, jobsBoard: true, link: "#", notes: "Korean-speaking AI community with regular paper discussions." },
  { name: "Prompt Engineering Masters", score: 7.5, type: "prompting", activity: "very active", language: "english", location: "slack", readingGroup: false, paperChannel: false, vcEvents: true, jobsBoard: false, link: "#", notes: "Advanced techniques and strategies for prompt engineering." },
  { name: "AI Startup Incubator", score: 8.0, type: "entrepreneurship", activity: "active", language: "english", location: "discord", readingGroup: false, paperChannel: false, vcEvents: true, jobsBoard: true, link: "#", notes: "Connect with AI entrepreneurs and find co-founders." },
  { name: "Robotics Research Group", score: 7.4, type: "robotics", activity: "semi active", language: "english", location: "discord", readingGroup: true, paperChannel: true, vcEvents: false, jobsBoard: true, link: "#", notes: "Academic robotics research community with paper reviews." },
  ...Array.from({ length: 42 }).map((_, i) => ({ name: `${["Neural", "Deep", "Smart", "Advanced", "Future", "Quantum", "Digital", "Cyber", "Meta", "Ultra"][i % 10]} ${["AI", "ML", "Tech", "Labs", "Hub", "Network", "Guild", "Alliance", "Collective", "Society"][Math.floor(i / 10) % 10]} ${i + 9}`, score: +(Math.random() * 4 + 5).toFixed(1), type: serverTypes[i % serverTypes.length], activity: activityLevels[i % activityLevels.length], language: languages[i % languages.length], location: locations[i % locations.length], readingGroup: Math.random() > 0.6, paperChannel: Math.random() > 0.5, vcEvents: Math.random() > 0.4, jobsBoard: Math.random() > 0.3, link: "#", notes: `Sample notes about this ${serverTypes[i % serverTypes.length]} server with ${activityLevels[i % activityLevels.length]} activity level.` }))
];

// --- Helper Components ---
const Badge = ({ children, className = '' }) => (
  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);

export default function AIDiscordDirectory() {
  const [query, setQuery] = useState("");
  const [compactView, setCompactView] = useState(false);
  const [scoreRange, setScoreRange] = useState([0]);
  const [currentView, setCurrentView] = useState("list");
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [readingGroupFilter, setReadingGroupFilter] = useState("all");
  const [paperChannelFilter, setPaperChannelFilter] = useState("all");
  const [vcEventsFilter, setVcEventsFilter] = useState("all");
  const [jobsBoardFilter, setJobsBoardFilter] = useState("all");

  // --- Filtering Logic ---
  const filtered = servers.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
    const matchesScore = s.score >= scoreRange[0];
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(s.type);
    const matchesActivity = selectedActivity.length === 0 || selectedActivity.includes(s.activity);
    const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(s.language);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(s.location);
    const matchesReadingGroup = readingGroupFilter === "all" || (readingGroupFilter === "yes" && s.readingGroup) || (readingGroupFilter === "no" && !s.readingGroup);
    const matchesPaperChannel = paperChannelFilter === "all" || (paperChannelFilter === "yes" && s.paperChannel) || (paperChannelFilter === "no" && !s.paperChannel);
    const matchesVcEvents = vcEventsFilter === "all" || (vcEventsFilter === "yes" && s.vcEvents) || (vcEventsFilter === "no" && !s.vcEvents);
    const matchesJobsBoard = jobsBoardFilter === "all" || (jobsBoardFilter === "yes" && s.jobsBoard) || (jobsBoardFilter === "no" && !s.jobsBoard);
    
    return matchesQuery && matchesScore && matchesType && matchesActivity && matchesLanguage && matchesLocation && matchesReadingGroup && matchesPaperChannel && matchesVcEvents && matchesJobsBoard;
  });

  const toggleSelection = (array, setArray, item) => {
    setArray(prev => 
      prev.includes(item) 
        ? prev.filter(x => x !== item)
        : [...prev, item]
    );
  };

  // --- Filter Dropdown Component ---
  const FilterDropdown = ({ title, options, selected, onToggle, type = "multi" }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (type === "single") {
      return (
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50 bg-white">
            <span className="font-medium">{title}</span>
            <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {options.map(option => (
                <button key={option.value} onClick={() => { onToggle(option.value); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${ selected === option.value ? 'bg-blue-50 text-blue-600' : '' }`}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50 bg-white">
          <span className="font-medium">{title}</span>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <Badge className="bg-gray-200 text-gray-800">{selected.length}</Badge>
            )}
            <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {options.map(option => (
              <label key={option} className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-white text-gray-900">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Discord Directory</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView("list")} className={`px-4 py-2 rounded-lg font-medium ${ currentView === "list" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300" }`}>
            List View
          </button>
          <button onClick={() => setCurrentView("clusters")} className={`px-4 py-2 rounded-lg font-medium ${ currentView === "clusters" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300" }`}>
            Cluster View
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* --- Left Sidebar - Filters --- */}
        <div className="w-full md:w-80 space-y-4 bg-gray-50 p-4 rounded-lg self-start">
          <h3 className="font-semibold text-lg mb-4">Filters</h3>
          
          <input
            placeholder="Search servers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="space-y-3">
            <FilterDropdown title="Server Type" options={serverTypes} selected={selectedTypes} onToggle={(type) => toggleSelection(selectedTypes, setSelectedTypes, type)} />
            <FilterDropdown title="Activity Level" options={activityLevels} selected={selectedActivity} onToggle={(activity) => toggleSelection(selectedActivity, setSelectedActivity, activity)} />
            <FilterDropdown title="Language" options={languages} selected={selectedLanguages} onToggle={(lang) => toggleSelection(selectedLanguages, setSelectedLanguages, lang)} />
            <FilterDropdown title="Location" options={locations} selected={selectedLocations} onToggle={(loc) => toggleSelection(selectedLocations, setSelectedLocations, loc)} />
            <FilterDropdown title="Reading Group" options={[{ label: "All", value: "all" }, { label: "Yes", value: "yes" }, { label: "No", value: "no" }]} selected={readingGroupFilter} onToggle={setReadingGroupFilter} type="single" />
            <FilterDropdown title="Paper Channel" options={[{ label: "All", value: "all" }, { label: "Yes", value: "yes" }, { label: "No", value: "no" }]} selected={paperChannelFilter} onToggle={setPaperChannelFilter} type="single" />
            <FilterDropdown title="VC Events/Office Hours" options={[{ label: "All", value: "all" }, { label: "Yes", value: "yes" }, { label: "No", value: "no" }]} selected={vcEventsFilter} onToggle={setVcEventsFilter} type="single" />
            <FilterDropdown title="Jobs Board" options={[{ label: "All", value: "all" }, { label: "Yes", value: "yes" }, { label: "No", value: "no" }]} selected={jobsBoardFilter} onToggle={setJobsBoardFilter} type="single" />
            
            <div className="pt-4 border-t">
              <label className="block mb-2 font-medium text-sm">Min Score: {scoreRange[0]}</label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={scoreRange[0]}
                onChange={(e) => setScoreRange([parseFloat(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                className={`${compactView ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={compactView}
                onClick={() => setCompactView(!compactView)}
              >
                <span className={`${compactView ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
              </button>
              <label htmlFor="compact" className="text-sm font-medium">Compact view</label>
            </div>
          </div>
          
          <div className="pt-4 text-sm text-gray-600 bg-white p-3 rounded border">
            <strong className="text-black">{filtered.length}</strong> servers match your filters
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1">
          {compactView ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Score</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Activity</th>
                    <th className="px-4 py-2 font-medium">Location</th>
                    <th className="px-4 py-2 font-medium">Features</th>
                    <th className="px-4 py-2 font-medium">Link</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filtered.map((s) => (
                    <tr key={s.name} className="border-t">
                      <td className="px-4 py-2 font-semibold">{s.name}</td>
                      <td className="px-4 py-2">{s.score}</td>
                      <td className="px-4 py-2">
                        <Badge className="capitalize border bg-white">{s.type}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge className="capitalize bg-gray-100 text-gray-800">{s.activity}</Badge>
                      </td>
                      <td className="px-4 py-2 capitalize">{s.location} • {s.language}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {s.readingGroup && <Badge className="bg-purple-100 text-purple-800">📚 Reading</Badge>}
                          {s.paperChannel && <Badge className="bg-blue-100 text-blue-800">📄 Papers</Badge>}
                          {s.vcEvents && <Badge className="bg-green-100 text-green-800">🎥 Events</Badge>}
                          {s.jobsBoard && <Badge className="bg-orange-100 text-orange-800">💼 Jobs</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-blue-600 underline">
                        <a href={s.link} target="_blank" rel="noopener noreferrer">link</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {filtered.map((s) => (
                <div key={s.name} className="border rounded-lg hover:shadow-lg transition-shadow bg-white">
                  <div className="space-y-3 p-4">
                    <div className="text-xl font-semibold">
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{s.name}</a>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-lg font-medium text-green-600">★ {s.score}</div>
                      <Badge className="capitalize border bg-white">{s.type}</Badge>
                      <Badge className="capitalize text-xs bg-gray-100 text-gray-800">{s.activity}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      📍 {s.location} • 🗣️ {s.language}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {s.readingGroup && <Badge className="text-xs bg-purple-100 text-purple-800">📚 Reading Group</Badge>}
                        {s.paperChannel && <Badge className="text-xs bg-blue-100 text-blue-800">📄 Paper Channel</Badge>}
                        {s.vcEvents && <Badge className="text-xs bg-green-100 text-green-800">🎥 VC Events</Badge>}
                        {s.jobsBoard && <Badge className="text-xs bg-orange-100 text-orange-800">💼 Jobs Board</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{s.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
