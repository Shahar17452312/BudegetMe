
import PropTypes from 'prop-types'; 

function Input(props) {
    return ( 
    <div className="input-group mb-3">
        <input type="text" 
        className="form-control" 
        placeholder={props.placeholder}  
        aria-label={props.ariaLabel }/>
    </div>);

   
}


Input.propTypes = {
    placeholder: PropTypes.string.isRequired, 
    ariaLabel : PropTypes.string.isRequired
};

export default Input; 
