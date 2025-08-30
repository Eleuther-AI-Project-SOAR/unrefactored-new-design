import React, { useState, useMemo, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { servers } from './data/servers'

// Helper component for SVG icons
const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// --- Icon components for clarity ---
const StarIcon = ({ className = 'w-5 h-5 text-yellow-400' }) => <Icon path="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" className={className} />;
const LanguageIcon = ({ className = 'w-4 h-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" clipRule="evenodd" />
    </svg>
);
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
const ChevronRightIcon = ({ className = 'w-5 h-5' }) => <Icon path="M10.75 16.4a.99.99 0 01-.7-.29.99.99 0 010-1.41L13.16 12l-3.1-3.1a.99.99 0 010-1.41 1 1 0 011.41 0l3.8 3.8a.99.99 0 010 1.41l-3.8 3.8a1 1 0 01-.71.29z" className={className} />;
const ChevronDownIcon = ({ className = 'w-4 h-4' }) => <Icon path="M12 15.25a1 1 0 01-.7-.29l-4-4a1 1 0 111.4-1.42L12 12.84l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-.7.29z" className={className} />;
const SendIcon = ({ className = 'w-5 h-5' }) => <Icon path="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" className={className} />;
const MoreIcon = ({ className = 'w-5 h-5' }) => <Icon path="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" className={className} />;
const FolderIcon = ({ className = 'w-5 h-5' }) => <Icon path="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" className={className} />;
const FileIcon = ({ className = 'w-5 h-5' }) => <Icon path="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" className={className} />;
const InfoIcon = ({ className = 'w-6 h-6' }) => <Icon path="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" className={className} />;

// --- New Theme Icons ---
const SunIcon = ({ className = 'w-5 h-5' }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 7.758a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
);

const MoonIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className={className}>
        <path d="M303.3 112.7C196.2 121.2 112 210.8 112 320C112 434.9 205.1 528 320 528C353.3 528 384.7 520.2 412.6 506.3C309.2 482.9 232 390.5 232 280C232 214.2 259.4 154.9 303.3 112.7zM64 320C64 178.6 178.6 64 320 64C339.4 64 358.4 66.2 376.7 70.3C386.6 72.5 394 80.8 395.2 90.8C396.4 100.8 391.2 110.6 382.1 115.2C321.5 145.4 280 207.9 280 280C280 381.6 362.4 464 464 464C469 464 473.9 463.8 478.8 463.4C488.9 462.6 498.4 468.2 502.6 477.5C506.8 486.8 504.6 497.6 497.3 504.6C451.3 548.8 388.8 576 320 576C178.6 576 64 461.4 64 320z"/>
    </svg>
);

const TwitterIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className={className}>
        <path d="M523.4 215.7C523.7 220.2 523.7 224.8 523.7 229.3C523.7 368 418.1 527.9 225.1 527.9C165.6 527.9 110.4 510.7 64 480.8C72.4 481.8 80.6 482.1 89.3 482.1C138.4 482.1 183.5 465.5 219.6 437.3C173.5 436.3 134.8 406.1 121.5 364.5C128 365.5 134.5 366.1 141.3 366.1C150.7 366.1 160.1 364.8 168.9 362.5C120.8 352.8 84.8 310.5 84.8 259.5L84.8 258.2C98.8 266 115 270.9 132.2 271.5C103.9 252.7 85.4 220.5 85.4 184.1C85.4 164.6 90.6 146.7 99.7 131.1C151.4 194.8 229 236.4 316.1 240.9C314.5 233.1 313.5 225 313.5 216.9C313.5 159.1 360.3 112 418.4 112C448.6 112 475.9 124.7 495.1 145.1C518.8 140.6 541.6 131.8 561.7 119.8C553.9 144.2 537.3 164.6 515.6 177.6C536.7 175.3 557.2 169.5 576 161.4C561.7 182.2 543.8 200.7 523.4 215.7z"/>
    </svg>
);

const DiscordIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className={className}>
        <path d="M524.5 133.8C524.3 133.5 524.1 133.2 523.7 133.1C485.6 115.6 445.3 103.1 404 96C403.6 95.9 403.2 96 402.9 96.1C402.6 96.2 402.3 96.5 402.1 96.9C396.6 106.8 391.6 117.1 387.2 127.5C342.6 120.7 297.3 120.7 252.8 127.5C248.3 117 243.3 106.8 237.7 96.9C237.5 96.6 237.2 96.3 236.9 96.1C236.6 95.9 236.2 95.9 235.8 95.9C194.5 103 154.2 115.5 116.1 133C115.8 133.1 115.5 133.4 115.3 133.7C39.1 247.5 18.2 358.6 28.4 468.2C28.4 468.5 28.5 468.7 28.6 469C28.7 469.3 28.9 469.4 29.1 469.6C73.5 502.5 123.1 527.6 175.9 543.8C176.3 543.9 176.7 543.9 177 543.8C177.3 543.7 177.7 543.4 177.9 543.1C189.2 527.7 199.3 511.3 207.9 494.3C208 494.1 208.1 493.8 208.1 493.5C208.1 493.2 208.1 493 208 492.7C207.9 492.4 207.8 492.2 207.6 492.1C207.4 492 207.2 491.8 206.9 491.7C191.1 485.6 175.7 478.3 161 469.8C160.7 469.6 160.5 469.4 160.3 469.2C160.1 469 160 468.6 160 468.3C160 468 160 467.7 160.2 467.4C160.4 467.1 160.5 466.9 160.8 466.7C163.9 464.4 167 462 169.9 459.6C170.2 459.4 170.5 459.2 170.8 459.2C171.1 459.2 171.5 459.2 171.8 459.3C268 503.2 372.2 503.2 467.3 459.3C467.6 459.2 468 459.1 468.3 459.1C468.6 459.1 469 459.3 469.2 459.5C472.1 461.9 475.2 464.4 478.3 466.7C478.5 466.9 478.7 467.1 478.9 467.4C479.1 467.7 479.1 468 479.1 468.3C479.1 468.6 479 468.9 478.8 469.2C478.6 469.5 478.4 469.7 478.2 469.8C463.5 478.4 448.2 485.7 432.3 491.6C432.1 491.7 431.8 491.8 431.6 492C431.4 492.2 431.3 492.4 431.2 492.7C431.1 493 431.1 493.2 431.1 493.5C431.1 493.8 431.2 494 431.3 494.3C440.1 511.3 450.1 527.6 461.3 543.1C461.5 543.4 461.9 543.7 462.2 543.8C462.5 543.9 463 543.9 463.3 543.8C516.2 527.6 565.9 502.5 610.4 469.6C610.6 469.4 610.8 469.2 610.9 469C611 468.8 611.1 468.5 611.1 468.2C623.4 341.4 590.6 231.3 524.2 133.7zM222.5 401.5C193.5 401.5 169.7 374.9 169.7 342.3C169.7 309.7 193.1 283.1 222.5 283.1C252.2 283.1 275.8 309.9 275.3 342.3C275.3 375 251.9 401.5 222.5 401.5zM417.9 401.5C388.9 401.5 365.1 374.9 365.1 342.3C365.1 309.7 388.5 283.1 417.9 283.1C447.6 283.1 471.2 309.9 470.7 342.3C470.7 375 447.5 401.5 417.9 401.5z" />
    </svg>
);

// --- Location & Sort Icons ---
const DiscordLocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 640 640" className="w-4 h-4 text-gray-500 dark:text-gray-400"><path fill="currentColor" d="M524.5 133.8C524.3 133.5 524.1 133.2 523.7 133.1C485.6 115.6 445.3 103.1 404 96C403.6 95.9 403.2 96 402.9 96.1C402.6 96.2 402.3 96.5 402.1 96.9C396.6 106.8 391.6 117.1 387.2 127.5C342.6 120.7 297.3 120.7 252.8 127.5C248.3 117 243.3 106.8 237.7 96.9C237.5 96.6 237.2 96.3 236.9 96.1C236.6 95.9 236.2 95.9 235.8 95.9C194.5 103 154.2 115.5 116.1 133C115.8 133.1 115.5 133.4 115.3 133.7C39.1 247.5 18.2 358.6 28.4 468.2C28.4 468.5 28.5 468.7 28.6 469C28.7 469.3 28.9 469.4 29.1 469.6C73.5 502.5 123.1 527.6 175.9 543.8C176.3 543.9 176.7 543.9 177 543.8C177.3 543.7 177.7 543.4 177.9 543.1C189.2 527.7 199.3 511.3 207.9 494.3C208 494.1 208.1 493.8 208.1 493.5C208.1 493.2 208.1 493 208 492.7C207.9 492.4 207.8 492.2 207.6 492.1C207.4 492 207.2 491.8 206.9 491.7C191.1 485.6 175.7 478.3 161 469.8C160.7 469.6 160.5 469.4 160.3 469.2C160.1 469 160 468.6 160 468.3C160 468 160 467.7 160.2 467.4C160.4 467.1 160.5 466.9 160.8 466.7C163.9 464.4 167 462 169.9 459.6C170.2 459.4 170.5 459.2 170.8 459.2C171.1 459.2 171.5 459.2 171.8 459.3C268 503.2 372.2 503.2 467.3 459.3C467.6 459.2 468 459.1 468.3 459.1C468.6 459.1 469 459.3 469.2 459.5C472.1 461.9 475.2 464.4 478.3 466.7C478.5 466.9 478.7 467.1 478.9 467.4C479.1 467.7 479.1 468 479.1 468.3C479.1 468.6 479 468.9 478.8 469.2C478.6 469.5 478.4 469.7 478.2 469.8C463.5 478.4 448.2 485.7 432.3 491.6C432.1 491.7 431.8 491.8 431.6 492C431.4 492.2 431.3 492.4 431.2 492.7C431.1 493 431.1 493.2 431.1 493.5C431.1 493.8 431.2 494 431.3 494.3C440.1 511.3 450.1 527.6 461.3 543.1C461.5 543.4 461.9 543.7 462.2 543.8C462.5 543.9 463 543.9 463.3 543.8C516.2 527.6 565.9 502.5 610.4 469.6C610.6 469.4 610.8 469.2 610.9 469C611 468.8 611.1 468.5 611.1 468.2C623.4 341.4 590.6 231.3 524.2 133.7zM222.5 401.5C193.5 401.5 169.7 374.9 169.7 342.3C169.7 309.7 193.1 283.1 222.5 283.1C252.2 283.1 275.8 309.9 275.3 342.3C275.3 375 251.9 401.5 222.5 401.5zM417.9 401.5C388.9 401.5 365.1 374.9 365.1 342.3C365.1 309.7 388.5 283.1 417.9 283.1C447.6 283.1 471.2 309.9 470.7 342.3C470.7 375 447.5 401.5 417.9 401.5z"/></svg>);
const SlackLocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 640 640" className="w-4 h-4 text-gray-500 dark:text-gray-400"><path fill="currentColor" d="M190.1 379.1C190.1 405 168.9 426.2 143 426.2C117.1 426.2 96 405 96 379.1C96 353.2 117.2 332 143.1 332L190.2 332L190.2 379.1zM213.8 379.1C213.8 353.2 235 332 260.9 332C286.8 332 308 353.2 308 379.1L308 496.9C308 522.8 286.8 544 260.9 544C235 544 213.8 522.8 213.8 496.9L213.8 379.1zM260.9 190.1C235 190.1 213.8 168.9 213.8 143C213.8 117.1 235 96 260.9 96C286.8 96 308 117.2 308 143.1L308 190.2L260.9 190.2zM260.9 213.8C286.8 213.8 308 235 308 260.9C308 286.8 286.8 308 260.9 308L143.1 308C117.2 308 96 286.8 96 260.9C96 235 117.2 213.8 143.1 213.8L260.9 213.8zM449.9 260.9C449.9 235 471.1 213.8 497 213.8C522.9 213.8 544 235 544 260.9C544 286.8 522.8 308 496.9 308L449.8 308L449.8 260.9zM426.2 260.9C426.2 286.8 405 308 379.1 308C353.2 308 332 286.8 332 260.9L332 143.1C332 117.2 353.2 96 379.1 96C405 96 426.2 117.2 426.2 143.1L426.2 260.9zM379.1 449.9C405 449.9 426.2 471.1 426.2 497C426.2 522.9 405 544 379.1 544C353.2 544 332 522.8 332 496.9L332 449.8L379.1 449.8zM379.1 426.2C353.2 426.2 332 405 332 379.1C332 353.2 353.2 332 379.1 332L496.9 332C522.8 332 544 353.2 544 379.1C544 405 522.8 426.2 496.9 426.2L379.1 426.2z"/></svg>);
const PersonLocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 640 640" className="w-4 h-4 text-gray-500 dark:text-gray-400"><path fill="currentColor" d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/></svg>);
const SortIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="size-4"><path fillRule="evenodd" d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>);

// Header component for the top navigation bar
const Header = ({ setActiveTab, theme, toggleTheme }) => (
  <header className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setActiveTab('Server Explorer')}>AI Discord Directory</h1>
            </div>
            <nav className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                    <button onClick={() => setActiveTab('Server Explorer')} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold">Home</button>
                    <button onClick={() => setActiveTab('About')} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold">About</button>
                    <button onClick={() => setActiveTab('Submit Server')} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold">Submit Server</button>
                </div>
            </nav>
        </div>
        <div className="flex items-center">
            <a href="https://x.com/SeonGunness" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <TwitterIcon />
            </a>
            <a href="https://discord.gg/buBqNytqx3" target="_blank" rel="noopener noreferrer" className="ml-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative" style={{ top: '-1px' }}>
                <DiscordIcon />
            </a>
            <button
                onClick={toggleTheme}
                className="ml-6 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle dark mode"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </div>
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
        ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
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
            ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'}
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
        <div className="w-full lg:w-80 xl:w-96 lg:flex-shrink-0 lg:sticky lg:top-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md lg:max-h-[calc(100vh-3rem)] overflow-y-auto dark:border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-gray-200">Filters</h2>
                    <button 
                        onClick={handleClearAll}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label htmlFor="search" className="sr-only">Search servers</label>
                        <input type="text" id="search" placeholder="Search servers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
                    </div>
                    <div>
                        <label htmlFor="min-score" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Score: {minScore.toFixed(1)}</label>
                        <input
                            type="range"
                            id="min-score"
                            min="0"
                            max="10"
                            step="0.1"
                            value={minScore}
                            onChange={(e) => setMinScore(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-gray-700 dark:accent-indigo-500"
                        />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Showing <b>{resultsCount}</b> of <b>{totalCount}</b> servers
                    </p>

                    <div className="space-y-6 dark:border-gray-700 pt-6">
                        {filterData.map(({ title, tags, key }) => {
                            const isCollapsed = collapsedCategories[title];
                            return (
                                <div key={title}>
                                    <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2 mb-3">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{title}</h3>
                                        <button onClick={() => toggleCategory(title)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                            {isCollapsed ? <PlusIcon /> : <MinusIcon />}
                                        </button>
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <FilterTag
                                                    key={tag}
                                                    tag={tag}
                                                    isSelected={(selectedTags[key] || []).includes(tag)}
                                                    onClick={() => handleTagClick(key, tag)}
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

// Mappings for tag and style info
const featureTagStyles = {
    'Reading Group': { icon: <ReadingGroupIcon />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    'Paper Channel': { icon: <PaperChannelIcon />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    'VC events/Office Hours': { icon: <VCEventsIcon />, color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    'Jobs Board': { icon: <JobsBoardIcon />, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' },
};

const activityLevelStyles = {
    'Very Active': 'bg-green-500 text-white dark:bg-green-600',
    'Active': 'bg-green-200 text-green-800 dark:bg-green-800/60 dark:text-green-200',
    'Semi-active': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800/60 dark:text-yellow-200',
    'Mostly Inactive': 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100',
    'Inactive': 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const locationStyles = {
    'Discord': <DiscordLocationIcon />,
    'Slack': <SlackLocationIcon />,
    'Irl': <PersonLocationIcon />,
};

// Server card component
const ServerCard = ({ server, onViewClick }) => {
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

    return (
        <div
            onClick={() => onViewClick(server)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col hover:shadow-lg dark:hover:bg-gray-700 transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            <div className="flex flex-col">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 pr-2">{server.name}</h3>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`Joining ${server.name}...`);
                            }}
                            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex-shrink-0"
                        >
                            <ExternalLinkIcon />
                        </a>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {server.rating >= 7.5 && <StarIcon />}
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">{server.rating}</span>
                        <div className="flex items-center gap-x-3 flex-shrink-0">
                            <span className="px-2 py-1 border border-gray-400 dark:border-gray-500 dark:text-gray-400 rounded-full text-xs font-semibold whitespace-nowrap">{server.tag}</span>
                            <span className={`px-2 py-1 ${activityClass} rounded-full text-xs font-semibold whitespace-nowrap`}>
                                {server.activityLevel}
                            </span>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {locationStyles[server.location] || <DiscordLocationIcon />}
                        <span>{server.location}</span>
                        <span>•</span>
                        <LanguageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>{server.language}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm line-clamp-3">{server.description}</p>
                </div>

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
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div onClick={handleOutsideClick} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{server.name}</h2>
                        <a href="#" onClick={(e) => e.stopPropagation()} className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            <ExternalLinkIcon />
                        </a>
                    </div>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center flex-wrap gap-x-3 text-sm">
                        {server.rating >= 7.5 && <StarIcon />}
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{server.rating}</span>
                        <span className="px-3 py-1 border border-gray-400 dark:border-gray-500 dark:text-gray-400 rounded-full text-sm font-semibold">{server.tag}</span>
                        <span className={`px-3 py-1 ${activityClass} rounded-full text-sm font-semibold`}>
                            {server.activityLevel}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {locationStyles[server.location] || <DiscordLocationIcon />}
                        <span>{server.location}</span>
                        <span>•</span>
                        <LanguageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>{server.language}</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Description</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{server.description}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Features</h4>
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
                            }) : <p className="text-sm text-gray-500 dark:text-gray-400">No specific features listed.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- View Components ---
const GridView = ({ servers, onViewClick }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-6 items-stretch">
        {servers.map(server => <ServerCard key={server.name} server={server} onViewClick={onViewClick} />)}
    </div>
);

const TableView = ({ servers, onViewClick }) => (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                    {['Name', 'Score', 'Type', 'Activity', 'Location', 'Features', 'Link'].map(header => (
                        <th key={header} scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${header === 'Link' ? 'text-right' : 'text-left'}`}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {servers.map(server => (
                    <tr key={server.name} onClick={() => onViewClick(server)} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{server.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{server.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full border border-gray-400 dark:border-gray-500 dark:text-gray-400">
                                {server.tag}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activityLevelStyles[server.activityLevel]}`}>
                                {server.activityLevel}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{server.location} • {server.language}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                                {server.features.map(feature => {
                                    const style = featureTagStyles[feature];
                                    return style ? <span key={feature} className={`inline-flex items-center p-1 ${style.color} rounded-md`}>{style.icon}</span> : null;
                                })}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" onClick={(e) => e.stopPropagation()} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">link</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ViewSwitcher = ({ view, setView }) => (
    <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <button onClick={() => setView('grid')} className={`p-2 rounded-md transition-colors duration-150 ${view === 'grid' ? 'bg-white dark:bg-gray-100 shadow text-gray-800 dark:text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            <GridIcon />
        </button>
        <button onClick={() => setView('table')} className={`p-2 rounded-md transition-colors duration-150 ${view === 'table' ? 'bg-white dark:bg-gray-100 shadow text-gray-800 dark:text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            <ListIcon />
        </button>
    </div>
);

// --- New Sort Dropdown Component ---
const SortDropDown = ({ 
    sorting, 
    setSorting,
    showSortDropdown,
    toggleSortDropdown,
    resetSorting,
    isSortingApplied
}) => {
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                toggleSortDropdown(false);
            }
        };

        if (showSortDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortDropdown, toggleSortDropdown]);

    const primaryOptions = ['Score', 'Name', 'Activity', 'Server Type', 'Language', 'Location', 'Others'];

    const getSecondaryOptions = (primaryOption) => {
        switch (primaryOption) {
            case 'Score':
            case 'Name':
            case 'Activity':
                return ['descending', 'ascending'];
            case 'Server Type':
                return filterData.find(f => f.title === 'Server Type').tags;
            case 'Language':
                return filterData.find(f => f.title === 'Language').tags;
            case 'Location':
                return filterData.find(f => f.title === 'Location').tags;
            case 'Others':
                return filterData.find(f => f.title === 'Others').tags;
            default:
                return ['descending', 'ascending'];
        }
    };

    const secondaryOptions = getSecondaryOptions(sorting.primary);

    const handlePrimaryChange = (option) => {
        setSorting({ primary: option, secondary: getSecondaryOptions(option)[0] });
    };

    const handleSecondaryChange = (option) => {
        setSorting(prev => ({ ...prev, secondary: option }));
    };

    return (
        <div className="absolute top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-20" ref={dropdownRef}>
            <div className="p-2">
                {isSortingApplied && (
                    <div className="mb-2">
                        <button
                            onClick={() => {
                                resetSorting();
                                toggleSortDropdown(false);
                            }}
                            className="w-full text-xs px-2 py-1 rounded text-left bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        >
                            Reset Sorting
                        </button>
                    </div>
                )}
                {isSortingApplied && <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>}
                <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Sort By</div>
                    <div className="grid grid-cols-2 gap-1">
                        {primaryOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handlePrimaryChange(option)}
                                className={`text-xs px-2 py-1 rounded text-left ${
                                    sorting.primary === option
                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {['Score', 'Name', 'Activity'].includes(sorting.primary) ? 'Order' : 'Prioritize'}
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                        {secondaryOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSecondaryChange(option)}
                                className={`text-xs px-2 py-1 rounded text-left ${
                                    sorting.secondary === option
                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
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
    const [sorting, setSorting] = useState({ primary: 'Score', secondary: 'descending' });
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    
    const toggleSortDropdown = (state) => setShowSortDropdown(prevState => typeof state === 'boolean' ? state : !prevState);
    const resetSorting = () => setSorting({ primary: 'Score', secondary: 'descending' });
    const isSortingApplied = sorting.primary !== 'Score' || sorting.secondary !== 'descending';

    const handleViewClick = (server) => {
        setSelectedServer(server);
    };

    const handleCloseModal = () => {
        setSelectedServer(null);
    };

    const processedServers = useMemo(() => {
        let filtered = servers.filter(server => {
            const searchMatch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                server.description.toLowerCase().includes(searchQuery.toLowerCase());
            const scoreMatch = server.rating >= minScore;
            
            const tagMatch = Object.entries(selectedTags).every(([categoryKey, tags]) => {
                if (tags.length === 0) return true;
                const serverValue = server[categoryKey];

                if (categoryKey === 'features') {
                    // 'AND' logic for features
                    return tags.every(tag => serverValue.includes(tag));
                }
                
                // 'OR' logic for other categories
                return tags.includes(serverValue);
            });

            return searchMatch && scoreMatch && tagMatch;
        });
        
        const sorted = [...filtered].sort((a, b) => {
            const { primary, secondary } = sorting;
            const isAscending = secondary === 'ascending';
            
            switch (primary) {
                case 'Score':
                    return isAscending ? a.rating - b.rating : b.rating - a.rating;
                case 'Name':
                    return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                case 'Activity':
                    const activityValues = { 'Very Active': 4, 'Active': 3, 'Semi-active': 2, 'Mostly Inactive': 1, 'Inactive': 0 };
                    const comparison = activityValues[a.activityLevel] - activityValues[b.activityLevel];
                    return isAscending ? comparison : -comparison;
                case 'Server Type':
                    const aHasTag = a.tag.includes(secondary);
                    const bHasTag = b.tag.includes(secondary);
                    if (aHasTag && !bHasTag) return -1;
                    if (!aHasTag && bHasTag) return 1;
                    return a.name.localeCompare(b.name);
                case 'Language':
                    if (a.language === secondary && b.language !== secondary) return -1;
                    if (a.language !== secondary && b.language === secondary) return 1;
                    return a.name.localeCompare(b.name);
                case 'Location':
                    if (a.location === secondary && b.location !== secondary) return -1;
                    if (a.location !== secondary && b.location === secondary) return 1;
                    return a.name.localeCompare(b.name);
                case 'Others':
                    const aHasFeature = a.features.includes(secondary);
                    const bHasFeature = b.features.includes(secondary);
                    if (aHasFeature && !bHasFeature) return -1;
                    if (!aHasFeature && bHasFeature) return 1;
                    return a.name.localeCompare(b.name);
                default:
                    return b.rating - a.rating;
            }
        });

        return sorted;
    }, [servers, searchQuery, minScore, selectedTags, sorting]);

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
                    <div className="w-full flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="relative">
                                <button
                                    onClick={toggleSortDropdown}
                                    className="flex items-center space-x-2 p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm dark:text-gray-300"
                                >
                                    <span>{isSortingApplied ? `${sorting.primary}: ${sorting.secondary}` : 'Sort By'}</span>
                                    <SortIcon />
                                </button>
                                {showSortDropdown && (
                                    <SortDropDown 
                                        sorting={sorting}
                                        setSorting={setSorting}
                                        showSortDropdown={showSortDropdown}
                                        toggleSortDropdown={toggleSortDropdown}
                                        resetSorting={resetSorting}
                                        isSortingApplied={isSortingApplied}
                                    />
                                )}
                            </div>
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
    <div className="mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">About the AI Discord Directory</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
                Welcome to the AI Discord Directory, your central hub for discovering and exploring communities focused on Artificial Intelligence. In the rapidly expanding world of AI, finding the right community to learn, collaborate, and stay up-to-date can be a challenge. Our mission is to simplify that process.
            </p>
            <p>
                This directory is a curated collection of Discord servers and other online groups dedicated to a wide range of AI topics—from cutting-edge research and large language models (LLMs) to AI safety, robotics, and casual coding discussions. Whether you're a seasoned researcher, a student just starting your journey, or a hobbyist passionate about AI, you'll find a community that fits your interests.
            </p>
            <h3 className="text-2xl font-semibold xt-gray-700 dark:text-gray-200 pt-4">Our Goal</h3>
            <p>
            Our primary goal is to fost a more connected and accessible AI ecosystem. We believe that collaboration and knowledge sharing are key to driving innovation. By providing a comprehensive and easy-to-navigate directory, we hope to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Help individuals find relevant communities to enhance their learning and career growth.</li>
                <li>Enable collaboration between different groups and individuals on exciting projects.</li>
                <li>Provide a platform for server owners to reach a wider audience of AI enthusiasts.</li>
                <li>Offer powerful filtering and visualization tools to help you understand the landscape of AI communities.</li>
            </ul>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 pt-4">How It Works</h3>
            <p>
                We gather information on various AI-focused communities and organize it in a structured way. Each server is evaluated based on several factors, including activity level, primary focus, and available resources like paper channels or job boards. Our unique scoring system helps you quickly identify high-quality and active communities.
            </p>
            <p>
                You can use our advanced filtering, sorting, and visualization tools—like the Folder Dendogram and t-SNE Cluster views—to explore the relathips between different communities and find the perfect one for you.
        </p>
    </div>
    </div>
);


// --- Assnt View Component ---
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
            <div className="w-1/4 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 rounded-l-lg flex flex-col">
                <div className="p-2">
                    <button
                        onClick={handleNewChat}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border dark:border-gray-600"
                    >
                        + New Chat
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-1">
                    {Object.keys(chats).reverse().map(chatId => (
                        <div key={chatId} className="relative group">
                            <button
                                onClick={() => setActiveChatId(chatId)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm truncate ${activeChatId === chatId ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300'}`}
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
                                    <MoreIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                                </button>
                                {menuOpen === chatId && (
                                    <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 border dark:border-gray-700">
                                        <button 
                                            onClick={() => { setEditingChatId(chatId); setEditingTitle(chats[chatId].title); setMenuOpen(null); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            Rename
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChat(chatId)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
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
            <div className="w-3/4 bg-white dark:bg-gray-900 rounded-r-lg flex flex-col relative">
                 {activeChat && activeChat.messages.length > 0 ? (
                    <>
                        <div className="flex-grow overflow-y-auto p-6">
                            <div className="max-w-4xl mx-auto">
                                {activeChat.messages.map((msg, index) => (
                                    <div key={index} className={`flex items-start gap-4 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-2 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-transparent text-gray-800 dark:text-gray-200 select-text'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-900">
                             <div className="max-w-4xl mx-auto flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="e.g., 'Find me a server for AI safety research'"
                                    className="flex-grow px-4 py-3 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                />
                                <button onClick={handleSendMessage} className="px-4 py-3 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition-colors shadow-sm">
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-4">Tell me what you are looking for?</h2>
                        <div className="w-full max-w-xl flex">
                             <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="e.g., 'Find me a server for AI safety research'"
                                className="flex-grow px-4 py-3 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
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
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [expandedServer, setExpandedServer] = useState(null);
    const [dendogramData, setDendogramData] = useState(null);

    const [clusterFeatures, setClusterFeatures] = useState({
        'Server Type': true,
        'Activity Level': false,
        'Language': false,
        'Location': false,
        'Others': false,
    });
    const [includeScore, setIncludeScore] = useState(false);

    const [appliedClusterFeatures, setAppliedClusterFeatures] = useState(clusterFeatures);
    const [appliedIncludeScore, setAppliedIncludeScore] = useState(includeScore);


    const dendogramServers = useMemo(() => [
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

    const generateDendogram = useCallback((serversToCluster, featureOptions, sortByScore) => {
        const groupServers = (servers, keys, parentId = 'root') => {
            if (keys.length === 0 || servers.length === 0) {
                let finalServers = [...servers];
                if (sortByScore) {
                    finalServers.sort((a, b) => b.rating - a.rating);
                }
                return finalServers.map((server, i) => ({
                    id: `${parentId}-${server.name.replace(/\s+/g, '')}-${i}`,
                    name: server.name,
                    isLeaf: true,
                    server: server,
                    servers: [server]
                }));
            }

            const [currentKey, ...restKeys] = keys;

            const grouped = servers.reduce((acc, server) => {
                const value = server[currentKey] || 'N/A';
                if (!acc[value]) {
                    acc[value] = [];
                }
                acc[value].push(server);
                return acc;
            }, {});

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

    useEffect(() => {
        const data = generateDendogram(dendogramServers, appliedClusterFeatures, appliedIncludeScore);
        setDendogramData(data);
        setSelectedNode(data);
        setExpandedFolders({root: true});
    }, [dendogramServers, generateDendogram, appliedClusterFeatures, appliedIncludeScore]);

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

    const Folder = ({ node, depth = 0 }) => (
        <div>
            <div className={`flex items-center space-x-2 py-1 rounded-md transition-colors ${selectedNode?.id === node.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <div style={{ paddingLeft: `${depth * 1.5}rem` }} className="flex items-center space-x-2 flex-grow">
                    <button onClick={() => !node.isLeaf && toggleFolder(node)} className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {!node.isLeaf && (
                            expandedFolders[node.id] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />
                        )}
                    </button>
                    <button onClick={() => setSelectedNode(node)} className="flex items-center space-x-2 text-left">
                        {node.isLeaf ? <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" /> : <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{node.name} {!node.isLeaf && `(${node.servers.length})`}</span>
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
                <h2 className="text-2xl font-bold dark:text-gray-200">Server Similarity Dendogram</h2>
                <p className="text-gray-600 dark:text-gray-400">Hierarchical clustering based on your selected attributes</p>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 border dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Clustering Options</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 dark:text-gray-300">
                        <div className="font-medium">Cluster By:</div>
                        {Object.keys(clusterFeatures).map(feature => (
                            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={clusterFeatures[feature]}
                                    onChange={() => handleFeatureChange(feature)}
                                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700"
                                />
                                <span className="text-sm">{feature}</span>
                            </label>
                        ))}
                        <div className="border-l dark:border-gray-700 pl-6 flex items-center gap-x-6">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeScore}
                                    onChange={() => setIncludeScore(prev => !prev)}
                                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700"
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Click {'>'} to expand clusters.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Click a folder or file name to view details on the right.</p>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 mt-2 dark:text-gray-200">Server Clusters</h3>
                    <div className="border dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm overflow-auto">
                        {dendogramData && <Folder node={dendogramData} depth={0} />}
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2 mt-10 dark:text-gray-200">Servers in: <span className="font-normal text-indigo-600 dark:text-indigo-400">{selectedNode?.name}</span></h3>
                    <div className="space-y-2">
                        <div className="p-2 flex items-center border-b dark:border-gray-700 font-bold text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg">
                            <div className="w-1/6">Score</div>
                            <div className="w-2/6">Name</div>
                            <div className="w-2/6">Type</div>
                            <div className="w-1/6">Link</div>
                            <div className="w-10"></div>
                        </div>
                        {serversToShow?.map(server => (
                            <div key={server.name} className="border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                                <div className="p-2 flex items-center">
                                    <div className="w-1/6 font-medium text-sm dark:text-gray-300">{server.rating}</div>
                                    <div className="w-2/6 font-medium text-sm dark:text-gray-300">{server.name}</div>
                                    <div className="w-2/6 text-sm dark:text-gray-300">{server.tag}</div>
                                    <div className="w-1/6 text-sm"><a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">link</a></div>
                                    <div className="w-10 flex justify-center">
                                        <button onClick={() => setExpandedServer(expandedServer === server.name ? null : server.name)}>
                                            {expandedServer === server.name ? <MinusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                                {expandedServer === server.name && (
                                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 space-y-4">
                                        <div className="flex">
                                            <p className="w-24 flex-shrink-0 text-sm font-semibold text-gray-600 dark:text-gray-300">Description:</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
                                        </div>
                                        <div className="flex">
                                            <p className="w-24 flex-shrink-0 text-sm font-semibold text-gray-600 dark:text-gray-300">Features:</p>
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

            let finalX = x + 20;
            if (finalX + cardWidth > chartRect.width - 10) {
                finalX = x - cardWidth - 20;
            }

            let finalY = y;
            if (y - cardHeight / 2 < 10) {
                finalY = cardHeight / 2 + 10;
            } else if (y + cardHeight / 2 > chartRect.height - 10) {
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
    const activityClass = activityLevelStyles[server.activityLevel] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

    return (
        <div
            ref={cardRef}
            style={style} 
            className="w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{server.name}</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center flex-wrap gap-x-3 text-xs mb-3">
                    <span className="flex items-center font-bold dark:text-gray-300"><StarIcon className="w-4 h-4 mr-1" />{server.rating}</span>
                    <span className="px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded-full font-semibold dark:text-gray-300">{server.tag}</span>
                    <span className={`px-2 py-0.5 ${activityClass} rounded-full font-semibold`}>
                        {server.activityLevel}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{server.description}</p>
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
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-b-xl">
                 <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Join Server
                    <ExternalLinkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

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

    const CLUSTER_COLOR_MAP = {
      '0': '#1f77b4',
      '1': '#ff7f0e',
      '2': '#2ca02c',
      '3': '#d62728',
    };

    const OUTLIER_COLOR = "#cccccc";

    const getColor = useCallback((clusterId) => {
        if (clusterId === -1) return OUTLIER_COLOR;
        return CLUSTER_COLOR_MAP[String(clusterId)] || OUTLIER_COLOR;
    }, []);

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
    }, []);


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
                .attr("class", "absolute top-4 left-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm p-3 rounded-lg shadow-lg");

            legendContainer.append("h3").attr("class", "text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200").text("Cluster Legend");
            const legendItems = legendContainer.append("div").attr("class", "flex flex-col space-y-1");
            const sortedClusters = Object.entries(clusters).sort((a, b) => a[0] - b[0]);

            for (const [clusterId, info] of sortedClusters) {
                const item = legendItems.append("div").attr("class", "flex items-center text-xs text-gray-700 dark:text-gray-300");
                item.append("div")
                    .attr("class", "w-3 h-3 rounded-sm mr-2 flex-shrink-0")
                    .style("background-color", getColor(clusterId));
                item.append("span").text(info.label);
            }
            
            const outlierItem = legendItems.append("div").attr("class", "flex items-center text-xs text-gray-700 dark:text-gray-300");
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
        <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
            <div className="w-full h-full border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm relative" ref={chartRef}>
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

            <div className="absolute bottom-8 left-8 z-20">
                <button
                    onClick={() => setIsInfoVisible(prev => !prev)}
                    className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                    <InfoIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                {isInfoVisible && (
                    <div ref={infoBoxRef} className="absolute bottom-full mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">How It Works</h4>
                            <button onClick={() => setIsInfoVisible(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
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

// --- New Submit Server View Component ---
const SubmitServerView = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [description, setDescription] = useState('');

    const serverTypeTags = filterData.find(f => f.title === 'Server Type')?.tags || [];
    const otherTags = filterData.find(f => f.title === 'Others')?.tags || [];
    const allSelectableTags = [...serverTypeTags, ...otherTags];


    const handleTagClick = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your submission! It will be reviewed shortly.');
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">List Your AI Server</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Join our directory and connect your AI research community with researchers worldwide. Get your server discovered by the right audience.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Application Form */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start space-x-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <FileIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Server Application</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Fill out this form to get your server listed in our directory. All submissions are manually reviewed to ensure quality.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name (Optional)</label>
                                    <input type="text" id="org-name" placeholder="e.g., Stanford AI Lab" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website (Optional)</label>
                                    <input type="url" id="website" placeholder="https://your-organization.com" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="server-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Server Name *</label>
                                    <input type="text" id="server-name" placeholder="e.g., AI Research Hub" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="member-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Member Count *</label>
                                    <input type="number" id="member-count" placeholder="e.g., 1500" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Server Description *</label>
                                <textarea 
                                    id="description" 
                                    rows="4" 
                                    placeholder="Describe your server's purpose, main topics, and what makes it unique... (minimum 10 characters)" 
                                    required 
                                    minLength="10"
                                    maxLength="500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
                                ></textarea>
                                <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{description.length}/500 characters</p>
                            </div>
                            <div>
                                <label htmlFor="invite-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invite Link *</label>
                                <input type="url" id="invite-link" placeholder="https://discord.gg/your-server" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be a valid URL invite link (e.g., https://discord.gg/...)</p>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email *</label>
                                     <input type="email" id="email" placeholder="your.email@example.com" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language *</label>
                                    <input type="text" id="language" placeholder="e.g., English" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="activity-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Level *</label>
                                    <select id="activity-level" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200">
                                        <option value="">Select activity level</option>
                                        <option>Very Active</option>
                                        <option>Active</option>
                                        <option>Semi-active</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="difficulty-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Difficulty Level *</label>
                                    <select id="difficulty-level" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200">
                                        <option value="">Select difficulty level</option>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>All levels</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features & Tags * <span className="text-gray-500 dark:text-gray-400">(Select at least one)</span></label>
                                <div className="flex flex-wrap gap-2">
                                    {allSelectableTags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleTagClick(tag)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                selectedTags.includes(tag) 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors shadow-md">
                                    Submit Application
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Review Process */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Review Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-indigo-500 dark:text-indigo-400 mb-2">1</div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">Application Review</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We review your server for quality, relevance, and activity level.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-indigo-500 dark:text-indigo-400 mb-2">2</div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">Verification</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We verify your server and ensure it meets our community standards.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold text-indigo-500 dark:text-indigo-400 mb-2">3</div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">Go Live</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Once approved, your server goes live in our directory.</p>
                            </div>
                        </div>
                    </div>
                </div>
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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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
        case 'Submit Server':
            return <SubmitServerView />;
        default:
            return <ListView />;
    }
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 font-sans flex flex-col">
      <Header setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 flex flex-col">
        {activeTab === 'Submit Server' || activeTab === 'About' ? (
            <div className="flex-1 overflow-y-auto">
                {renderActiveTab()}
            </div>
        ) : (
            <>
                <div className="px-4 sm:px-6 lg:px-8 pt-6 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                  <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                    <Tab label="Server Explorer" isActive={activeTab === 'Server Explorer'} onClick={() => setActiveTab('Server Explorer')} />
                    <Tab label="Folder Dendogram" isActive={activeTab === 'Folder Dendogram'} onClick={() => setActiveTab('Folder Dendogram')} />
                    <Tab label="UMAP Cluster" isActive={activeTab === 'UMAP Cluster'} onClick={() => setActiveTab('UMAP Cluster')} />
                    <Tab label="Assistant" isActive={activeTab === 'Assistant'} onClick={() => setActiveTab('Assistant')} />
                  </nav>
                </div>
                <div className={activeTab === 'UMAP Cluster' ? 'flex-1 relative bg-gray-50 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-inner flex-1'}>
                   {renderActiveTab()}
                </div>
            </>
        )}
      </main>
    </div>
  );
}



