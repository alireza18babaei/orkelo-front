import React from 'react';
import { useLocation } from 'react-router-dom';

const ScrollArrow = () => {
    const { pathname } = useLocation();
    const [scrollValue, setScrollValue] = React.useState(0);
    const [showGoTop, setShowGoTop] = React.useState(false);
    const hiddenOnRoute = pathname === '/requests' || pathname === '/requests-management';

    React.useEffect(() => {
        if (hiddenOnRoute) {
            setShowGoTop(false);
            return undefined;
        }

        const handleScroll = () => {
            const pos = document.documentElement.scrollTop;
            const calcHeight = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            const newScrollValue = Math.round((pos * 100) / calcHeight);
            setScrollValue(newScrollValue);
            if (pos > 100) {
                setShowGoTop(true);
            } else {
                setShowGoTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hiddenOnRoute]);

    const handleClick = () => {
        document.documentElement.scrollTop = 0;
    };

    return (
        <div
            className="go-top"
            style={{
                display: !hiddenOnRoute && showGoTop ? 'grid' : 'none',
                background: `conic-gradient( rgba(var(--primary),1) ${scrollValue}%, var(--light-gray) ${scrollValue}%)`
            }}
            onClick={handleClick}
        >
          <span className="progress-value">
            <i className="ti ti-arrow-up"></i>
          </span>
        </div>
    );
};

export default ScrollArrow;
