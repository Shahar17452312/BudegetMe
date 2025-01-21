
import PropTypes from 'prop-types'; 

function Input(props) {
    return ( 
    <div className="input-group mb-3">
        <input type={props.type} 
        className="form-control" 
        placeholder={props.placeholder}  
        aria-label={props.ariaLabel }
        name={props.name}
        value={props.value}
        onChange={props.onChange}/>

    </div>);

   
}


Input.propTypes = {
    placeholder: PropTypes.string.isRequired, 
    ariaLabel : PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    name:PropTypes.string,
    value:PropTypes.string,
    onChange:PropTypes.func

};

export default Input; 
