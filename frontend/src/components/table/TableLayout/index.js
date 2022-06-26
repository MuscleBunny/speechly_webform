import './index.css'

function TableLayout(props) {
  return (
    <table className="table">
      {props.children}
    </table>
  );
}

export default TableLayout;
