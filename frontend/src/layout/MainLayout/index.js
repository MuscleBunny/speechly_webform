
function MainLayout(props) {
  return (
    <div style={{
      width: '80%',
      minWidth: '500px',
      maxWidth: '700px',
      margin: 'auto'
    }}>
      {props.children}
    </div>
  );
}

export default MainLayout;
