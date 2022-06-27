import './index.css'

function TableRow(props) {
  return (
    <tr className="table-row" onClick={props.onClick}>
      {props.children}
    </tr>
  );
}

export default TableRow;
