import React from 'react'

 function ReadingTime() {

    const text = 'Lorem ipsum do';
    const readingTime = require('reading-time');

    const stats = readingTime(text);

    const seconds = Math.floor(stats.time / 100);

    const minutes = Math.floor(seconds / 60);

    return (
        <div>
           <ul>
               <li>{minutes} minutes</li>
               <li>{seconds} seconds</li>
               <li>{stats.words} words</li>
           </ul>
        </div>
    )
}

export default ReadingTime;