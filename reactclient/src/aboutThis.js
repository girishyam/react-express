import React, { Component } from "react";

export default class aboutThisApp extends Component {
  render() {
    return (
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
             <strong>About this app</strong> 
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse "
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <p>
                This is a <strong>Reactjs</strong> front end app using{" "}
                <strong>Expressjs</strong> api on the backend with
                <strong> SQLite database </strong>for data persistance. The
                backend api is intergrated to Twitter APIs to enable these basic
                functionalities.
                <br />
                Once the page is loaded on the browser an api call is made from
                the client side to then try fetch data already stored in SQLite
                database. Result gets dispalyed on the grid.
                <br />
                <br />
                <li>Functionality 1: Query, save and display</li>
                The page has a form with 2 fields allowing user to search for
                recent tweets on a hashtag or tweets that are tagged on any users
                handle. Result gets displayed on the screen (limited to 20 recent tweets.)
                <br />
                <br />
                <li>Functionality 2: Delete All</li>
                "Delete all" button will delete the complete dataset in SQLite database.
                <br />
                <br />
                <li>Functionality 3: View All</li>
                "View all" button will display the complete dataset in SQLite database. (No pagination)
              </p>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}


