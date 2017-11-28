export class AirportSearchFilter {
  name:string;
  property:string;
  placeHolder:string
}


let AirportSearchFilters : AirportSearchFilter[] = [
  {
    name : "ICAO Code",
    property : "codeFIR",
    placeHolder : "ICAO 4-letter code of the location (DOC7910)"
  },
  {
    name : 'IATA Code',
    property : "codeIATA",
    placeHolder : "IATA 3-letter code of the location"
  },
  {
    name : 'Local Code',
    property : "codeLocal",
    placeHolder : "Local 3-letter code of the location"
  },
  {
    name : 'Name',
    property : "nameFIR",
    placeHolder : "Name of the airport"
  }
];

export default AirportSearchFilters;
