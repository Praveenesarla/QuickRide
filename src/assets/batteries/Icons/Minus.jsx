import * as React from 'react';
import Svg, {Rect, G, Path} from 'react-native-svg';
const Minus = props => (
  <Svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      width={12}
      height={12}
      rx={6}
      transform="matrix(1 0 0 -1 0 12)"
      fill="#B82929"
    />
    <G opacity={0.8}>
      <Path
        d="M3.3335 6C3.3335 5.86739 3.38617 5.74021 3.47994 5.64645C3.57371 5.55268 3.70089 5.5 3.8335 5.5H8.16683C8.29944 5.5 8.42661 5.55268 8.52038 5.64645C8.61415 5.74021 8.66683 5.86739 8.66683 6C8.66683 6.13261 8.61415 6.25979 8.52038 6.35355C8.42661 6.44732 8.29944 6.5 8.16683 6.5H3.8335C3.70089 6.5 3.57371 6.44732 3.47994 6.35355C3.38617 6.25979 3.3335 6.13261 3.3335 6Z"
        fill="white"
      />
    </G>
  </Svg>
);
export default Minus;
