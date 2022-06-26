import './index.css'

function TableHeader(props) {
  return (
    <thead className="table-header">
      {props.children}
    </thead>
  );
}

export default TableHeader;
