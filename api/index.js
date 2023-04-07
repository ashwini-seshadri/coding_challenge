const url = require('url');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static('public'));

const LevelOfAmbitionToUrls = {
  "1": "https://mackaycarboncalculator.beis.gov.uk/pathways/111111111111111111111111111111111111111111111aaaaaaaaaaabaaaaaaaaaaaacaacccccaaaccaabcaaaaggegeggggggggeggggggggggikciiiqgcggggggggqqgg/data",
  "2": "https://mackaycarboncalculator.beis.gov.uk/pathways/222222222222222222222222222222222222222222222aaaaaaaaaaabaaaaaaaaaaaacaacccccaaaccaabcaaaaggegeggggggggeggggggggggikciiiqgcggggggggqqgg/data",
  "3": "https://mackaycarboncalculator.beis.gov.uk/pathways/333333333333333333333333333333333333333333333aaaaaaaaaaabaaaaaaaaaaaacaacccccaaaccaabcaaaaggegeggggggggeggggggggggikciiiqgcggggggggqqgg/data",
  "4": "https://mackaycarboncalculator.beis.gov.uk/pathways/444444444444444444444444444444444444444444444aaaaaaaaaaabaaaaaaaaaaaacaacccccaaaccaabcaaaaggegeggggggggeggggggggggikciiiqgcggggggggqqgg/data"
}

const zip = (a, b) => a.map((e, i) => [e, b[i]]);
const zipToCsv = (array) => array.map(e => e.join(',')).join('\n');

const years = [
  "Year",
  2015,
  2020,
  2025,
  2030,
  2035,
  2040,
  2045,
  2050,
  2055,
  2060,
  2065,
  2070,
  2075,
  2080,
  2085,
  2090,
  2095,
  2100
];

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
});
app.get('/data', (req, res) => {
  const levelOfAmbition = url.parse(req.url, true).query.levelOfAmbition || "1";
  
  async function fetchDataFromRemoteServer(callback) {
    const url = LevelOfAmbitionToUrls[levelOfAmbition];
    const response = await fetch(url, {method: 'GET'});
    let data = await response.json();
    let emissionsCumulative = data['emissions_cumulative'][0];
    let zippedData = zip(years, emissionsCumulative)
    const csvData = zipToCsv(zippedData);
    callback(csvData)
    return emissionsCumulative;
  }
  
  fetchDataFromRemoteServer((data) => {
    res.writeHead(200, {'Content-Type': 'application/csv'});
    res.write(data);
    res.end();
  });
});


app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
