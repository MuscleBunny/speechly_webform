import './index.css'

function TableCell(props) {
  return (
    <td className="table-cell">
      {props.children}
    </td>
  );
}

export default TableCell;
