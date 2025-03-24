import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const FloatingMenu = props => (
  <Svg
    width={55}
    height={55}
    viewBox="0 0 66 66"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G filter="url(#filter0_d_1337_3527)">
      <Circle cx={33} cy={33} r={24} fill="white" />
    </G>
    <Path
      d="M40.7576 38.8065C41.0047 38.8068 41.2424 38.9138 41.4221 39.1057C41.6019 39.2976 41.71 39.5599 41.7245 39.8389C41.739 40.118 41.6587 40.3928 41.5001 40.6072C41.3414 40.8215 41.1164 40.9593 40.871 40.9923L40.7576 41H25.2424C24.9952 40.9997 24.7575 40.8926 24.5778 40.7007C24.3981 40.5088 24.2899 40.2466 24.2754 39.9675C24.261 39.6884 24.3412 39.4136 24.4999 39.1993C24.6585 38.9849 24.8835 38.8471 25.1289 38.8141L25.2424 38.8065H40.7576ZM40.7576 31.9032C41.0147 31.9032 41.2614 32.0188 41.4432 32.2245C41.6251 32.4301 41.7272 32.7091 41.7272 33C41.7272 33.2909 41.6251 33.5699 41.4432 33.7755C41.2614 33.9812 41.0147 34.0968 40.7576 34.0968H25.2424C24.9852 34.0968 24.7386 33.9812 24.5567 33.7755C24.3749 33.5699 24.2727 33.2909 24.2727 33C24.2727 32.7091 24.3749 32.4301 24.5567 32.2245C24.7386 32.0188 24.9852 31.9032 25.2424 31.9032H40.7576ZM40.7576 25C41.0147 25 41.2614 25.1156 41.4432 25.3212C41.6251 25.5269 41.7272 25.8059 41.7272 26.0968C41.7272 26.3877 41.6251 26.6666 41.4432 26.8723C41.2614 27.078 41.0147 27.1935 40.7576 27.1935H25.2424C24.9852 27.1935 24.7386 27.078 24.5567 26.8723C24.3749 26.6666 24.2727 26.3877 24.2727 26.0968C24.2727 25.8059 24.3749 25.5269 24.5567 25.3212C24.7386 25.1156 24.9852 25 25.2424 25H40.7576Z"
      fill="#3F525B"
    />
    <Defs></Defs>
  </Svg>
);
export default FloatingMenu;
