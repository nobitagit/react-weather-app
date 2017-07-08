import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import './App.css';

const apiHost = 'http://localhost:9000';

const toCentigrades = t => (t - 32) * 5/9

const scale = scaleLinear()
  .domain([0, 30])
  .range(['#083790', '#fb4263'])
  .clamp(true);

function encodeColorByTemp({ temperatureMin, temperatureMax }) {
  const avg = (temperatureMin + temperatureMax) / 2;
  return scale(toCentigrades(avg))
}

function displayDay(time, i) {
  switch(i) {
    case 0:
      return 'today';
    case 1:
      return 'tomorrow';
    default:
      return new Date(time * 1000).toLocaleDateString('en-GB', {
          day : 'numeric',
          month : 'short',
      });
  }
}

function getBkgStyle(forecastData = []) {
  const colorStops = forecastData.map((day, i, self) => {
    const percentage = i * 100 / self.length;
    const color = encodeColorByTemp(day);
    return `${color} ${percentage}0%`;
  }).join(',')
  return {
    background: `linear-gradient(to right, ${colorStops})`
  }
}

function getPosition() {
  return new Promise((resolve, reject) => {
    const sucess = ({ coords }) => resolve(coords);
    const error = err => reject(err);
    navigator.geolocation.getCurrentPosition(sucess, error);
  });
}

function getWeather({ latitude, longitude }) {
  return fetch(`${apiHost}/weather?lat=${latitude}&lon=${longitude}`)
    .then(res => res.json());
}

function getData() {
  // You can uncomment this line if you want to avoid
  // slashing the weather API while in dev
//  return Promise.resolve(retRes);

  return getPosition()
    .then(getWeather);
}

function displayTemp(temperature) {
  const t = toCentigrades(temperature);
  return `${t.toFixed(1)}° C`;
}

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      wData: {},
      forecast: [],
      loading: true,
    };
  };

  componentDidMount() {
    getData()
      .then(res => {
        const wData = res.currently;
        const forecast = res.daily.data.slice(0, this.props.forecastDays);
        this.setState({ wData, forecast, loading: false });
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header"
          style={getBkgStyle(this.state.forecast)}>
          <h2>Weather at your location</h2>
          {this.state.loading ? (
            <p>Fetching data...</p>
          ) : (
            <div>
              <p>
                { displayTemp(this.state.wData.temperature)}</p>
              <small>({ this.state.wData.summary.toString() })</small>
            </div>
          )}
        </div>
        <div className="App-intro">
          {
            this.state.forecast.map((day, i) =>
              (<p className="Axis-day">
                <span className="Axis-day--temp">
                {displayTemp(day.temperatureMin + day.temperatureMax / 2)}
                </span>
                <br />
                {displayDay(day.time, i)}
              </p>)
            )
          }
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  days: 7,
};

export default App;
