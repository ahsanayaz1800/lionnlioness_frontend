import React, { Component } from "react";
import { Autocomplete, Button, Icon } from "react-materialize";
import InfoToast from "../../services/InfoToastService";
import ErrorToast from "../../services/ErrorToastService";
import cities from "../../assets/data-json/cities";
import * as actionCreators from "../../actions/user-actions";
import { connect } from "react-redux";

class SelectLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: "",
      long: "",
      city: "Not set",
      cityInput: "",
      editLocationActive: false
    };
    this.citiesJSON = cities["France"];
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    // Check for existing location data
    if (
      this.props.userConnectedData.geo_lat &&
      this.props.userConnectedData.geo_long
    ) {
      await this.getCityFromLatLong(
        this.props.userConnectedData.geo_lat,
        this.props.userConnectedData.geo_long
      );
      this._isMounted &&
        this.setState({
          lat: this.props.userConnectedData.geo_lat,
          long: this.props.userConnectedData.geo_long
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this._isMounted = true;
    if (
      prevState.city !== undefined &&
      prevState.city !== "" &&
      prevState.city !== "Not set" &&
      (this.state.lat !== prevState.lat || this.state.long !== prevState.long)
    ) {
      this.props.updateUserData(
        this.props.userConnectedData.id,
        this.props.userConnectedData.username,
        {
          city: this.state.city,
          geo_lat: this.state.lat,
          geo_long: this.state.long
        }
      );
      InfoToast.custom.info("Your city has been changed", 1500);
    }
  }

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      this.showPosition,
      this.errorPosition
    );
  };

  showPosition = pos => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    this.setState({
      lat: latitude,
      long: longitude
    });

    this.fetchLocationDetails(latitude, longitude);
  };

  errorPosition = error => {
    // Default location when geolocation fails
    const defaultLocation = {
      latitude: 24.8607,
      longitude: 67.0011, // Karachi
    };
    this.setState({
      lat: defaultLocation.latitude,
      long: defaultLocation.longitude
    });

    // Fetch city from the default coordinates
    this.fetchLocationDetails(defaultLocation.latitude, defaultLocation.longitude);
  };

  fetchLocationDetails = (latitude, longitude) => {
    // Use IP-API to get location details
    fetch(`http://ip-api.com/json`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          this._isMounted && this.setState({
            city: data.city,
            lat: data.lat,
            long: data.lon
          });
        } else {
          ErrorToast.custom.error(
            "Couldn't get city from coordinates, please try again later...",
            1400
          );
        }
      })
      .catch(error => {
        console.error("Error fetching location details:", error);
        ErrorToast.custom.error("Couldn't fetch location details", 1400);
      });
  };

  getCityFromLatLong = (lat, long) => {

    // Call IP-API for reverse geocoding
    fetch(`http://ip-api.com/json`)
      .then(response => response.json())
      .then(data => {
      console.log(data)
        if (data.status === "success") {
          this._isMounted && this.setState({ city: data.city });
        
        } else {
          ErrorToast.custom.error(
            "Couldn't get city from coordinates, please try again later...",
            1400
          );
        }
      })
      .catch(error => {
        console.error("Error fetching city from coordinates:", error);
      });
  };

  getLatLongFromCity = city => {
    // Call IP-API for geocoding
    fetch(`http://ip-api.com/json/${city}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "success" && data.lat && data.lon) {
          this._isMounted &&
            this.setState({
              city: city,
              lat: data.lat,
              long: data.lon
            });
        } else {
          ErrorToast.custom.error("City not found, please try again...", 1400);
        }
      })
      .catch(error => {
        console.error("Error fetching lat/long from city:", error);
      });
  };

  showEditLocation = () => {
    this._isMounted &&
      this.setState({
        editLocationActive: true
      });
  };

  hideEditLocation = () => {
    this._isMounted &&
      this.setState({
        editLocationActive: false
      });
  };

  switchEditLocation = () => {
    if (this.state.editLocationActive) this.hideEditLocation();
    else this.showEditLocation();
  };

  geolocateMe = () => {
    this.getLocation();
    this.hideEditLocation();
    InfoToast.custom.info(
      "Please wait while you are being geolocated...",
      1500
    );
  };

  confirmAutoCity = () => {
    document.querySelectorAll(".edit-location-submit")[0].disabled = false;
  };

  handleAutocompleteSubmit = () => {
    if (
      document.querySelectorAll(".edit-location-autoc-input > input")[0].value
    ) {
      this.getLatLongFromCity(
        document.querySelectorAll(".edit-location-autoc-input > input")[0].value
      );
      this.hideEditLocation();
    } else {
      ErrorToast.custom.error("Please enter a city", 1400);
    }
  };

  handleAutocompleteChange = () => {
    document.querySelectorAll(".edit-location-submit")[0].disabled = true;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="location-container">
        {this.state.city}
        <Button
          waves="light"
          style={{ marginLeft: "15px" }}
          onClick={this.switchEditLocation}
        >
          Edit
          <Icon left>edit_location</Icon>
        </Button>
        {this.state.editLocationActive && (
          <div className="edit-location-input">
            <div className="edit-location-autoc">
              <Autocomplete
                className="edit-location-autoc-input"
                style={{ display: "inline-block" }}
                options={{
                  data: this.citiesJSON,
                  minLength: 3,
                  onAutocomplete: this.confirmAutoCity
                }}
                placeholder="Insert city here (3 letters min)"
                icon="place"
                onChange={this.handleAutocompleteChange}
              />
              <Button
                className="edit-location-submit"
                onClick={this.handleAutocompleteSubmit}
              >
                Confirm
              </Button>
            </div>
            <p>Or</p>
            <Button waves="light" onClick={this.geolocateMe}>
              Geolocate me
              <Icon left>location_searching</Icon>
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status
  };
};

export default connect(
  mapStateToProps,
  actionCreators
)(SelectLocation);

