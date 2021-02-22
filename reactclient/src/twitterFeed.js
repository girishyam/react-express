import React, { Component } from "react";
import axios from "axios";
import AboutThisApp from "./aboutThis";
import "./twitterFeed.css";

export default class TweeterFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      twitterHandle: "",
      tweetType: "",
      busy: false,
      successful: false,
      error: false,
      errorMessage: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handleChange(event) {
    let name = event.target.type;
    if (name == "text") {
      this.setState({ twitterHandle: event.target.value });
    } else {
      this.setState({ tweetType: event.target.value });
    }
  }

  handleView(event) {
    this.setState({
      busy: true,
      successful: false,
      error: false,
      errorMessage: "",
    });
    event.preventDefault();
    axios.get("/api/tweets").then((response) => {
      console.log(response.data);
      this.setState({
        tweets: response.data.data,
        busy: false,
        successful: true,
        error: false,
        errorMessage: "",
      });
    });
  }

  handleSubmit(event) {
    const url = "/api/fetch/tweets";
    event.preventDefault();
    this.setState({
      busy: true,
      successful: false,
      error: false,
      errorMessage: "",
    });

    axios
      .post(url, {
        query: this.state.tweetType + this.state.twitterHandle,
      })
      .then((response) => {
        console.log(response);
        this.setState({
          tweets: response.data.data,
          busy: false,
          successful: true,
          error: false,
          errorMessage: response.data.message,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          tweets: [],
          busy: false,
          error: true,
          errorMessage: error,
        });
      });
  }

  handleDelete(event) {
    alert("You are going to delete all tweets in db: ");
    event.preventDefault();
    this.setState({
      busy: true,
      successful: false,
      error: false,
      errorMessage: "",
    });
    axios
      .delete("/api/tweet/all")
      .then((response) => {
        console.log(response.data);
        this.setState({
          tweets: [],
          busy: false,
          successful: true,
          error: false,
          errorMessage: null,
        });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({
          busy: false,
          successful: false,
          error: true,
          errorMessage: error,
        });
      });
  }

  componentDidMount = () => {
    console.log("component did mount called ...");
    axios.get("/api/tweets").then((response) => {
      console.log(response.data);
      this.setState({
        tweets: response.data.data,
      });
    });
  };

  render() {
    return (
      <div className="container">
        <h1>Simple React App - Twitter Search</h1>

        <AboutThisApp />
        <br />
        <div className="action-panel">
          <form className="form-control" onSubmit={this.handleSubmit}>
            <div className="mb-3 ">
              <label>Pick your choice:</label>
              <select
                className="form-control"
                onChange={this.handleChange}
                required
              >
                <option value="">- select -</option>
                <option value="@">@ - Tag</option>
                <option value="#"># - HashTag</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="floatingInput">Enter Text:</label>
              <input
                id="floatingInput"
                className="form-control"
                type="text"
                value={this.state.twitterHandle}
                onChange={this.handleChange}
                placeholder="australia"
                maxLength="40"
                required
              />
            </div>

            <br></br>
            <input className="btn btn-success" type="submit" value="Submit" />
            <button
              onClick={this.handleView}
              name="viewAll"
              className="float-end btn btn-info"
            >
              View all
            </button>
            <button
              onClick={this.handleDelete}
              name="deleteAll"
              className="float-end btn btn-danger"
            >
              Delete all
            </button>
          </form>
        </div>

        <div className="alert alert-light" role="alert">
          {this.state.busy
            ? "... busy fetching tweets ..."
            : this.state.error
            ? this.state.errorMessage
            : " "}
        </div>
        <div>
          <br></br>
          {this.state.successful ? (
            <span className="badge bg-success" role="alert">
              Success
            </span>
          ) : null}
          <br></br>
          {this.state.errorMessage ? (
            <span className="alert alert-warning" role="alert">
              {this.state.errorMessage}
            </span>
          ) : null}
        </div>
        {this.state.tweets.length ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Photo</th>
                <th scope="col">Screen Name</th>
                <th scope="col">Tweet</th>
                <th scope="col">Search term</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tweets.map((data) => (
                <tr key={data.id}>
                  <td>
                    <img
                      src={data.author_profile_image}
                      className="rounded-circle mx-auto d-block"
                    ></img>
                  </td>
                  <td> {data.author_screen_name}</td>
                  <td>{data.tweet_text}</td>
                  <td>{data.query}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info" role="alert">
            No data found.
          </div>
        )}
      </div>
    );
  }
}
