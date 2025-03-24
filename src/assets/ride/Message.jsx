import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
const Message = props => (
  <Svg
    width={36}
    height={37}
    viewBox="0 0 36 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      y={0.5}
      width={36}
      height={36}
      rx={4}
      fill="#B82929"
      fillOpacity={0.1}
    />
    <Path
      d="M13 15.5H22M13 19.5H22M13 23.5H18M28 18.5C28 24.023 23.523 28.5 18 28.5H8V18.5C8 12.977 12.477 8.5 18 8.5C23.523 8.5 28 12.977 28 18.5Z"
      stroke="#B82929"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Message;
