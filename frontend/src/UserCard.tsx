import React, {useState} from 'react';

type Props = {
    name: string,
    email: string,
    interests: string[],
    classes: string[],
    clubs: string[],
};

const User = ({name, email, interests, classes, clubs}: Props) => {
    return (
        <div>
            <p>{name}, contact at {email}</p>
        </div>
    );
};

export default User;