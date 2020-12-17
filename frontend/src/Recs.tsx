import React, {useState, useEffect} from 'react';

type Props = {
    readonly query: string,
    readonly friends: string[],
};

const Recs = () => {
    type User = {
        name: string,
        email: string,
        interests: string[],
        classes: string[],
        clubs: string[],
    };

    const [recs, setRecs] = useState<readonly User[]>([]);

    const fetchRecs = () => {
        fetch('http://localhost:8080/getCommon')
            .then(res => res.json())
            .then(json => setRecs(json));
    };
    
    return (
        <div>
            
        </div>
    );
};

export default Recs;