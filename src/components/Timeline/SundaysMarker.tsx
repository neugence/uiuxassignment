import React, { useEffect, useState } from 'react'
import { CustomMarker, TimelineMarkers } from 'react-calendar-timeline'
import moment, { Moment } from 'moment'

interface MarkerDate {
  id: number;
  date: Moment;
}

const SundaysMarker: React.FC = () => {
  const [markerDates, setMarkerDates] = useState<MarkerDate[]>([]);

  useEffect(() => {
    const dates: MarkerDate[] = [];
    for (let i = 1; i < 100; i++) {
      dates.push({
        id: i,
        date: moment('2018/01/05').add(i * 7, 'day')
      });
    }
    setMarkerDates(dates);
  }, []);

  return (
    <TimelineMarkers>
      {markerDates.map(marker => (
        <CustomMarker
          key={marker.id}
          date={marker.date.valueOf()}>
          {({styles}) => {
            const customStyles = {
              ...styles,
              background: `repeating-linear-gradient(
                0deg, transparent, transparent 5px, white 5px, red 10px )`,
              width: '1px',
            }
            return <div style={customStyles} />
          }}
        </CustomMarker>
      ))}
    </TimelineMarkers>
  );
};

export default SundaysMarker;