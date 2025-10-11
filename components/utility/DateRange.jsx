
"use client";

import { useState, useEffect, useMemo } from 'react';

// Move months outside component for better performance
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateRange = ({ startYear, endYear, id }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Memoize formatted dates for better performance
    const formattedDates = useMemo(() => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Present';
            return `${months[date.getMonth()]}, ${date.getFullYear()}`;
        };

        return {
            start: formatDate(startYear),
            end: endYear ? formatDate(endYear) : 'Present'
        };
    }, [startYear, endYear]);

    if (!isClient) {
        // Return a simple fallback during SSR using basic year format
        const startYearNum = new Date(startYear).getFullYear();
        const endYearNum = endYear ? new Date(endYear).getFullYear() : 'Present';
        return (
            <p id={id} className="sub-content">
                {startYearNum} - {endYearNum}
            </p>
        );
    }
    
    return (
        <p id={id} className="sub-content">
            {formattedDates.start} - {formattedDates.end}
        </p>
    );
};

export default DateRange;