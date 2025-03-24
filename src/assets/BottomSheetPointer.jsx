import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const BottomSheetPointer = props => (
  <Svg
    width={81}
    height={4}
    viewBox="0 0 81 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect opacity={0.2} x={0.5} width={80} height={4} rx={2} fill="black" />
  </Svg>
);
export default BottomSheetPointer;
