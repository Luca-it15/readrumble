import React from 'react';

function SiteLogo(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
      <img src={props.imageSrc} alt={props.imageAlt} />
    </div>
  );
}

export default SiteLogo;
