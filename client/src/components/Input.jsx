import '../assets/styles/Input.css'; 


function Input(props) {
  return (
    <input
      type={props.type} 
      placeholder={props.placeholder} 
      value={props.value} 
      onChange={props.onChange} 
      autoComplete={props.autocomplete}
    />
  );
}

export default Input;
