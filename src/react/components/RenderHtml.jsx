// src/RenderHtml.js
import React from 'react';
import exampleHtml from './visualization/index.html';

const RenderHtml = () => {
    return (
        <div>
            {/*<iframe*/}
            {/*    title="Embedded HTML"*/}
            {/*    src="visualization/index.html"*/}
            {/*    width="100%"*/}
            {/*    height="500px"*/}
            {/*    sandbox="allow-scripts"*/}
            {/*/>*/}

            <iframe width="350px" height="197px" src="https://www.youtube.com/embed/f_epkBeS1LQ?si=rcasvtBNv1C0YpPz"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    );
};

export default RenderHtml;
