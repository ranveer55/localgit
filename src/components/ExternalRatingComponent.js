import React from 'react';
import Rating from '@material-ui/lab/Rating';


const ExternalRatingComponent = ({ value, readOnly = false, name,setRating: setRating, reviewParameter, id,defaultValue })=> {

    const handleChange = (even, newValue) => {
        setRating(newValue);
    }
    return (
        <Rating
            // defaultValue={3}
            readOnly={readOnly}
            name={name}
            value={value}
            onChange={handleChange}
        />
    );
}
export default ExternalRatingComponent