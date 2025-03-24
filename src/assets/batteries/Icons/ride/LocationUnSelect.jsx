import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const LocationUnSelect = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0.8375 8.62512C0.8375 12.9179 4.33227 16.4126 8.625 16.4126C12.9177 16.4126 16.4125 12.9179 16.4125 8.62512C16.4125 4.33239 12.9177 0.837622 8.625 0.837622C4.33227 0.837622 0.8375 4.33239 0.8375 8.62512ZM2.1625 8.62512C2.1625 5.06528 5.0578 2.16262 8.625 2.16262C12.1922 2.16262 15.0875 5.06528 15.0875 8.62512C15.0875 12.185 12.1922 15.0876 8.625 15.0876C5.0578 15.0876 2.1625 12.185 2.1625 8.62512Z"
      fill="#7B7A7A"
      stroke="#7B7A7A"
      strokeWidth={0.2}
    />
  </Svg>
);
export default LocationUnSelect;
