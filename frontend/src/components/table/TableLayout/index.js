import './index.css'

function TableLayout(props) {
  return (
    <table className="table" style={props.style}>
      {props.children}
    </table>
  );
}

export default TableLayout;
