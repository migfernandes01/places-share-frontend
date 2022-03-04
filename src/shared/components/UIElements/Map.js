//Map components
import React from 'react';

function Map(props) {
    return (
        <iframe title="map" width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
        src={'https://maps.google.com/maps?q=' + props.coordinates.lat.toString() + ',' + props.coordinates.lng.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}></iframe>
    );
}

export default Map;