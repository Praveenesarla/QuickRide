import * as React from 'react';
import Svg, {Rect, Mask, G, Path} from 'react-native-svg';
const SearchInputMap = props => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={0.85}
      y={0.85}
      width={28.3}
      height={28.3}
      rx={8.15}
      fill="#D9D9D9"
      stroke="#B6AFAF"
      strokeWidth={0.3}
    />
    <Mask
      id="mask0_1061_2153"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={1}
      y={1}
      width={28}
      height={28}>
      <Rect x={1} y={1} width={28} height={28} rx={8} fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_1061_2153)">
      <Path d="M1 1H29V29H1V1Z" fill="#D9D9D9" />
      <Path d="M19.1144 1H11.5V11.5H1V18H11.5V29H19.1144V1Z" fill="white" />
      <Path
        d="M21 1C23.1217 1 25.1566 1.85791 26.6569 3.38499C28.1571 4.91207 29 6.98324 29 9.14286C29 12.514 26.4756 16.0462 21.5333 19.819C21.3795 19.9365 21.1923 20 21 20C20.8077 20 20.6205 19.9365 20.4667 19.819C15.5244 16.0462 13 12.514 13 9.14286C13 6.98324 13.8429 4.91207 15.3431 3.38499C16.8434 1.85791 18.8783 1 21 1ZM21 6.42857C20.2928 6.42857 19.6145 6.71454 19.1144 7.22357C18.6143 7.73259 18.3333 8.42298 18.3333 9.14286C18.3333 9.86273 18.6143 10.5531 19.1144 11.0621C19.6145 11.5712 20.2928 11.8571 21 11.8571C21.7072 11.8571 22.3855 11.5712 22.8856 11.0621C23.3857 10.5531 23.6667 9.86273 23.6667 9.14286C23.6667 8.42298 23.3857 7.73259 22.8856 7.22357C22.3855 6.71454 21.7072 6.42857 21 6.42857Z"
        fill="#B82929"
      />
      <Path
        d="M24 9C24 10.6569 22.6569 12 21 12C19.3431 12 18 10.6569 18 9C18 7.34315 19.3431 6 21 6C22.6569 6 24 7.34315 24 9Z"
        fill="white"
      />
    </G>
  </Svg>
);
export default SearchInputMap;
