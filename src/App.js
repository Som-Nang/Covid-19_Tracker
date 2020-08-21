import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from './Table';
import { sortData, prettyPrintState } from "./util";
import LineGraph from "./LineGraph";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import './App.css';




function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  //Countries API WEP page
  //https://disease.sh/docs/#/ -> /v3/covid-19/countries

  {/* USEEFECT = Run a pieces of code based on a given con dition */ }

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((respones) => respones.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {

    //the code inside here will run when the component loads and not again
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {

          const countries = data.map((country) => (
            {
              name: country.country, //Unite Kingdom United State
              value: country.countryInfo.iso2, //UK USA....
            }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    console.log("Yooo >>>", countryCode);
    setCountry(countryCode);

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    ////https://disease.sh/docs/#/ -> /v3/covid-19/countries

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };
  console.log(">>>COUNTRY INFO", countryInfo);

  return (
    <div className="app">

      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19 TRACKER <br></br>
            <span>@DIN SOMNANG</span>
          </h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/*Loop through all */}
              <MenuItem value="worldwide" >Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>
        <div className="app__stats">

          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintState(countryInfo.todayCases)}
            total={countryInfo.cases} />

          <InfoBox
            isRed
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovery"
            cases={prettyPrintState(countryInfo.todayRecovered)}
            total={countryInfo.recovered} />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Dead"
            cases={prettyPrintState(countryInfo.todayDeaths)}
            total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By County</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide New Cases{casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

    </div >


  );
}

export default App;
