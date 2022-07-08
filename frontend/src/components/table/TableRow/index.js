import './index.css'

function TableRow(props) {
  return (
    <tr className={'table-row ' + props.className } onClick={props.onClick}>
      {props.children}
    </tr>
  );
}

export default TableRow;
