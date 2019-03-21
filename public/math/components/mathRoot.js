
class MathRoot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <pre className="language-js">
          let x=5;
          let y=4;
      </pre>
    );
  }
}
const domContainer = document.querySelector('#mathPageContainer');
ReactDOM.render(<MathRoot />, domContainer);
