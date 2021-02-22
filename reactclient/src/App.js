import "./App.css";
import TweeterFeed from "./twitterFeed";
import logo from './logo.svg';

function App() {
  return (
    <div className="container-fluid">
      <nav className="navbar fixed-top  navbar-dark bg-primary  ">
        <div className="container">
          <a className="navbar-brand ">
            <img
              src={logo}
              className="rounded mx-auto d-block  App-logo">                
              </img>
               React
          </a>
        </div>
      </nav>
      
      <div className="body mt-7">
        <TweeterFeed />
      </div>
    </div>
  );
}

export default App;
