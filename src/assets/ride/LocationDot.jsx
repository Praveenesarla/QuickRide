import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const LocationDot = props => (
  <Svg
    width={7}
    height={7}
    viewBox="0 0 7 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={0.0205078}
      y={0.758606}
      width={6}
      height={6}
      rx={3}
      fill="#007716"
    />
  </Svg>
);
export default LocationDot;
