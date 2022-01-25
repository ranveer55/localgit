import React from 'react';
import Rating from '@material-ui/lab/Rating';


const RatingComponent =({ value, name, setRating, reviewParameter, id,defaultValue })=> {

    const handleChange = (event, newValue) => {
        setRating(newValue);
    }
    return (
        <Rating
            // defaultValue={3}
            name={name}
            value={value ? value : 0}
            onChange={handleChange}
        />
    );
}
export default RatingComponent