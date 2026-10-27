import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ScrollView,
} from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Path,
  G,
  Rect,
  ClipPath,
  Text as SvgText,
} from 'react-native-svg';
// Auto-generated High-Fidelity World Dots & Country Metadata
export interface DotPoint {
  lat: number;
  lng: number;
  code: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  capital?: string;
  region: string;
  lat: number;
  lng: number;
  metrics: {
    activeUsers: string;
    networkSpeed: string;
    ping: string;
    status: string;
  };
}

export interface FlightArc {
  fromCode: string;
  toCode: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  label: string;
  color: string;
}

// Compact tuple format [lat, lng, countryCode]
export const WORLD_DOTS_RAW: [number, number, string][] = [[78,-77.6,"CA"],[78,-64.8,"GRE"],[78,-52,"GRE"],[78,-39.2,"GRE"],[78,-26.4,"GRE"],[74.8,-94.6,"CA"],[74.8,-82.4,"CA"],[74.8,-45.7,"GRE"],[74.8,-33.5,"GRE"],[74.8,-21.3,"GRE"],[74.8,88.5,"RU"],[74.8,100.7,"RU"],[74.8,149.5,"RU"],[71.6,-119.2,"CA"],[71.6,-109,"CA"],[71.6,-98.9,"CA"],[71.6,-88.8,"CA"],[71.6,-78.6,"CA"],[71.6,-48.2,"GRE"],[71.6,-38.1,"GRE"],[71.6,-27.9,"GRE"],[71.6,53.2,"RU"],[71.6,83.6,"RU"],[71.6,93.7,"RU"],[71.6,103.9,"RU"],[71.6,114,"RU"],[71.6,124.1,"RU"],[71.6,144.4,"RU"],[68.4,-171.3,"RU"],[68.4,-162.6,"US"],[68.4,-153.9,"US"],[68.4,-145.2,"US"],[68.4,-136.5,"CA"],[68.4,-127.8,"CA"],[68.4,-119.2,"CA"],[68.4,-110.5,"RU"],[68.4,-101.8,"RU"],[68.4,-93.1,"CA"],[68.4,-84.4,"CA"],[68.4,-75.7,"RU"],[68.4,-67,"RU"],[68.4,-58.3,"RU"],[68.4,-49.6,"RU"],[68.4,-40.9,"RU"],[68.4,-32.2,"RU"],[68.4,-23.5,"RU"],[68.4,-14.8,"RU"],[68.4,-6.1,"RU"],[68.4,2.5,"RU"],[68.4,11.2,"RU"],[68.4,19.9,"RU"],[68.4,46,"RU"],[68.4,54.7,"RU"],[65.2,-172.4,"RU"],[65.2,-164.7,"US"],[65.2,-157.1,"US"],[65.2,-149.5,"US"],[65.2,-141.9,"US"],[65.2,-134.2,"CA"],[65.2,-126.6,"CA"],[65.2,-119,"CA"],[65.2,-111.3,"CA"],[65.2,-103.7,"CA"],[65.2,-96.1,"CA"],[65.2,-88.5,"CA"],[65.2,-80.8,"RU"],[65.2,-73.2,"CA"],[65.2,-65.6,"RU"],[65.2,-57.9,"RU"],[65.2,-50.3,"RU"],[65.2,-42.7,"RU"],[65.2,-35,"RU"],[65.2,-27.4,"RU"],[65.2,-19.8,"RU"],[65.2,-12.2,"RU"],[65.2,-4.5,"RU"],[65.2,3.1,"RU"],[65.2,10.7,"RU"],[65.2,18.4,"RU"],[65.2,26,"RU"],[62,-159.6,"US"],[62,-152.7,"US"],[62,-145.9,"US"],[62,-139.1,"CA"],[62,-132.3,"CA"],[62,-125.5,"CA"],[62,-118.7,"CA"],[62,-111.8,"CA"],[62,-105,"CA"],[62,-98.2,"CA"],[62,-77.8,"CA"],[62,-43.7,"GRE"],[62,10.9,"NO"],[62,24.5,"FIN"],[62,31.3,"RU"],[62,38.1,"RU"],[62,44.9,"RU"],[62,51.7,"RU"],[62,58.6,"RU"],[62,65.4,"RU"],[62,72.2,"RU"],[62,79,"RU"],[62,85.8,"RU"],[62,92.6,"RU"],[62,99.5,"RU"],[62,106.3,"RU"],[62,113.1,"RU"],[62,119.9,"RU"],[62,126.7,"RU"],[62,133.5,"RU"],[62,140.4,"RU"],[62,147.2,"RU"],[62,154,"RU"],[62,160.8,"RU"],[62,167.6,"RU"],[62,174.4,"RU"],[58.8,-161.5,"US"],[58.8,-155.3,"US"],[58.8,-136.8,"US"],[58.8,-130.6,"CA"],[58.8,-124.4,"CA"],[58.8,-118.2,"CA"],[58.8,-112,"CA"],[58.8,-105.9,"CA"],[58.8,-99.7,"CA"],[58.8,-93.5,"CA"],[58.8,-75,"CA"],[58.8,-68.8,"CA"],[58.8,11.5,"SE"],[58.8,23.9,"EST"],[58.8,30,"RU"],[58.8,36.2,"RU"],[58.8,42.4,"RU"],[58.8,48.6,"RU"],[58.8,54.7,"RU"],[58.8,60.9,"RU"],[58.8,67.1,"RU"],[58.8,73.3,"RU"],[58.8,79.4,"RU"],[58.8,85.6,"RU"],[58.8,91.8,"RU"],[58.8,98,"RU"],[58.8,104.2,"RU"],[58.8,110.3,"RU"],[58.8,116.5,"RU"],[58.8,122.7,"RU"],[58.8,128.9,"RU"],[58.8,135,"RU"],[58.8,141.2,"RU"],[58.8,159.8,"RU"],[55.6,-129,"CA"],[55.6,-123.4,"CA"],[55.6,-117.7,"CA"],[55.6,-112,"CA"],[55.6,-106.4,"CA"],[55.6,-100.7,"CA"],[55.6,-95,"CA"],[55.6,-89.4,"CA"],[55.6,-72.4,"CA"],[55.6,-66.7,"CA"],[55.6,-61.1,"CA"],[55.6,-4.4,"GB"],[55.6,12.6,"DEN"],[55.6,23.9,"LIT"],[55.6,29.6,"BEL"],[55.6,35.2,"RU"],[55.6,40.9,"RU"],[55.6,46.6,"RU"],[55.6,52.2,"RU"],[55.6,57.9,"RU"],[55.6,63.6,"RU"],[55.6,69.2,"RU"],[55.6,74.9,"RU"],[55.6,80.5,"RU"],[55.6,86.2,"RU"],[55.6,91.9,"RU"],[55.6,97.5,"RU"],[55.6,103.2,"RU"],[55.6,108.9,"RU"],[55.6,114.5,"RU"],[55.6,120.2,"RU"],[55.6,125.9,"RU"],[55.6,131.5,"RU"],[55.6,159.8,"RU"],[52.4,-127.6,"CA"],[52.4,-122.3,"CA"],[52.4,-117.1,"CA"],[52.4,-111.8,"CA"],[52.4,-106.6,"CA"],[52.4,-101.3,"CA"],[52.4,-96.1,"CA"],[52.4,-90.8,"CA"],[52.4,-85.6,"CA"],[52.4,-75.1,"CA"],[52.4,-69.9,"CA"],[52.4,-64.6,"CA"],[52.4,-59.4,"CA"],[52.4,-6.9,"IRE"],[52.4,-1.7,"GB"],[52.4,8.8,"DE"],[52.4,14.1,"DE"],[52.4,19.3,"POL"],[52.4,24.5,"BEL"],[52.4,29.8,"BEL"],[52.4,35,"RU"],[52.4,40.3,"RU"],[52.4,45.5,"RU"],[52.4,50.8,"RU"],[52.4,56,"RU"],[52.4,61.3,"KAZ"],[52.4,66.5,"KAZ"],[52.4,71.7,"KAZ"],[52.4,77,"KAZ"],[52.4,82.2,"RU"],[52.4,87.5,"RU"],[52.4,92.7,"RU"],[52.4,98,"RU"],[52.4,103.2,"RU"],[52.4,108.5,"RU"],[52.4,113.7,"RU"],[52.4,118.9,"RU"],[52.4,124.2,"CN"],[52.4,129.4,"RU"],[52.4,134.7,"RU"],[52.4,139.9,"RU"],[49.2,-121.2,"CA"],[49.2,-116.3,"CA"],[49.2,-111.4,"CA"],[49.2,-106.5,"CA"],[49.2,-101.6,"CA"],[49.2,-96.7,"CA"],[49.2,-91.8,"CA"],[49.2,-87,"CA"],[49.2,-82.1,"CA"],[49.2,-77.2,"CA"],[49.2,-72.3,"CA"],[49.2,-62.5,"CA"],[49.2,-57.6,"CA"],[49.2,1.2,"FR"],[49.2,6.1,"FR"],[49.2,11,"DE"],[49.2,15.9,"CZE"],[49.2,20.8,"SLO"],[49.2,25.7,"UKR"],[49.2,30.6,"UKR"],[49.2,35.5,"UKR"],[49.2,40.4,"RU"],[49.2,45.3,"RU"],[49.2,50.2,"KAZ"],[49.2,55.1,"KAZ"],[49.2,60,"KAZ"],[49.2,64.9,"KAZ"],[49.2,69.8,"KAZ"],[49.2,74.7,"KAZ"],[49.2,79.6,"KAZ"],[49.2,84.5,"KAZ"],[49.2,89.4,"MON"],[49.2,94.2,"MON"],[49.2,99.1,"MON"],[49.2,104,"MON"],[49.2,108.9,"MON"],[49.2,113.8,"MON"],[49.2,118.7,"CN"],[49.2,123.6,"CN"],[49.2,128.5,"CN"],[49.2,133.4,"RU"],[49.2,138.3,"RU"],[46,-120.1,"US"],[46,-115.5,"US"],[46,-110.9,"US"],[46,-106.3,"US"],[46,-101.7,"US"],[46,-97.1,"US"],[46,-92.5,"US"],[46,-87.9,"US"],[46,-83.3,"CA"],[46,-78.7,"CA"],[46,-74,"CA"],[46,-69.4,"US"],[46,-64.8,"CA"],[46,-60.2,"CA"],[46,-0.3,"FR"],[46,4.3,"FR"],[46,8.9,"IT"],[46,13.5,"IT"],[46,18.1,"HUN"],[46,22.7,"ROM"],[46,27.3,"ROM"],[46,41.1,"RU"],[46,45.7,"RU"],[46,54.9,"KAZ"],[46,59.5,"KAZ"],[46,64.1,"KAZ"],[46,68.8,"KAZ"],[46,73.4,"KAZ"],[46,78,"KAZ"],[46,82.6,"KAZ"],[46,87.2,"CN"],[46,91.8,"MON"],[46,96.4,"MON"],[46,101,"MON"],[46,105.6,"MON"],[46,110.2,"MON"],[46,114.8,"MON"],[46,119.4,"CN"],[46,124,"CN"],[46,128.6,"CN"],[46,133.2,"CN"],[46,137.9,"RU"],[42.8,-123.3,"US"],[42.8,-118.9,"US"],[42.8,-114.6,"US"],[42.8,-110.2,"US"],[42.8,-105.9,"US"],[42.8,-101.5,"US"],[42.8,-97.1,"US"],[42.8,-92.8,"US"],[42.8,-88.4,"US"],[42.8,-84.1,"US"],[42.8,-79.7,"CA"],[42.8,-75.3,"US"],[42.8,-71,"US"],[42.8,-5.5,"ES"],[42.8,-1.2,"ES"],[42.8,11.9,"IT"],[42.8,20.6,"KOS"],[42.8,25,"BUL"],[42.8,42.4,"GEO"],[42.8,46.8,"RU"],[42.8,55.5,"KAZ"],[42.8,59.9,"UZB"],[42.8,64.2,"UZB"],[42.8,68.6,"KAZ"],[42.8,73,"KAZ"],[42.8,77.3,"KYR"],[42.8,81.7,"CN"],[42.8,86,"CN"],[42.8,90.4,"CN"],[42.8,94.8,"CN"],[42.8,99.1,"MON"],[42.8,103.5,"MON"],[42.8,107.8,"MON"],[42.8,112.2,"CN"],[42.8,116.6,"CN"],[42.8,120.9,"CN"],[42.8,125.3,"CN"],[42.8,129.7,"CN"],[42.8,142.7,"JP"],[39.6,-121.9,"US"],[39.6,-117.7,"US"],[39.6,-113.6,"US"],[39.6,-109.4,"US"],[39.6,-105.2,"US"],[39.6,-101.1,"US"],[39.6,-96.9,"US"],[39.6,-92.8,"US"],[39.6,-88.6,"US"],[39.6,-84.5,"US"],[39.6,-80.3,"US"],[39.6,-76.2,"US"],[39.6,-5.6,"ES"],[39.6,-1.4,"ES"],[39.6,27.7,"TR"],[39.6,31.8,"TR"],[39.6,36,"TR"],[39.6,40.1,"TR"],[39.6,44.3,"TR"],[39.6,48.4,"AZE"],[39.6,56.7,"TUR"],[39.6,60.9,"TUR"],[39.6,65,"UZB"],[39.6,69.2,"TAJ"],[39.6,73.3,"KYR"],[39.6,77.5,"CN"],[39.6,81.6,"CN"],[39.6,85.8,"CN"],[39.6,89.9,"CN"],[39.6,94.1,"CN"],[39.6,98.3,"CN"],[39.6,102.4,"CN"],[39.6,106.6,"CN"],[39.6,110.7,"CN"],[39.6,114.9,"CN"],[39.6,119,"CN"],[39.6,127.3,"NOR"],[36.4,-120.4,"US"],[36.4,-116.4,"US"],[36.4,-112.4,"US"],[36.4,-108.4,"US"],[36.4,-104.5,"US"],[36.4,-100.5,"US"],[36.4,-96.5,"US"],[36.4,-92.5,"US"],[36.4,-88.6,"US"],[36.4,-84.6,"US"],[36.4,-80.6,"US"],[36.4,-76.6,"US"],[36.4,-5.1,"ES"],[36.4,2.9,"ALG"],[36.4,6.9,"ALG"],[36.4,38.7,"SYR"],[36.4,42.6,"IRA"],[36.4,46.6,"IRA"],[36.4,50.6,"IRA"],[36.4,54.6,"IRA"],[36.4,58.5,"IRA"],[36.4,62.5,"TUR"],[36.4,66.5,"AFG"],[36.4,70.5,"AFG"],[36.4,74.4,"PAK"],[36.4,78.4,"CN"],[36.4,82.4,"CN"],[36.4,86.4,"CN"],[36.4,90.3,"CN"],[36.4,94.3,"CN"],[36.4,98.3,"CN"],[36.4,102.3,"CN"],[36.4,106.2,"CN"],[36.4,110.2,"CN"],[36.4,114.2,"CN"],[36.4,118.2,"CN"],[36.4,138.1,"JP"],[33.2,-115,"US"],[33.2,-111.2,"US"],[33.2,-107.3,"US"],[33.2,-103.5,"US"],[33.2,-99.7,"US"],[33.2,-95.9,"US"],[33.2,-92,"US"],[33.2,-88.2,"US"],[33.2,-84.4,"US"],[33.2,-80.6,"US"],[33.2,-7.9,"MOR"],[33.2,-4.1,"MOR"],[33.2,-0.3,"ALG"],[33.2,3.6,"ALG"],[33.2,7.4,"ALG"],[33.2,11.2,"TUN"],[33.2,38,"SYR"],[33.2,41.8,"IRA"],[33.2,45.6,"IRA"],[33.2,49.5,"IRA"],[33.2,53.3,"IRA"],[33.2,57.1,"IRA"],[33.2,60.9,"AFG"],[33.2,64.8,"AFG"],[33.2,68.6,"AFG"],[33.2,72.4,"PAK"],[33.2,76.2,"IN"],[33.2,80,"CN"],[33.2,83.9,"CN"],[33.2,87.7,"CN"],[33.2,91.5,"CN"],[33.2,95.3,"CN"],[33.2,99.2,"CN"],[33.2,103,"CN"],[33.2,106.8,"CN"],[33.2,110.6,"CN"],[33.2,114.5,"CN"],[33.2,118.3,"CN"],[33.2,129.8,"JP"],[30,-109.8,"MX"],[30,-106.1,"MX"],[30,-102.4,"US"],[30,-98.7,"US"],[30,-95,"US"],[30,-91.3,"US"],[30,-6.3,"MOR"],[30,-2.6,"ALG"],[30,1.1,"ALG"],[30,4.8,"ALG"],[30,8.4,"ALG"],[30,12.1,"LIB"],[30,15.8,"LIB"],[30,19.5,"LIB"],[30,23.2,"LIB"],[30,26.9,"EG"],[30,30.6,"EG"],[30,34.3,"EG"],[30,38,"SA"],[30,41.7,"SA"],[30,45.4,"IRA"],[30,52.8,"IRA"],[30,56.5,"IRA"],[30,60.2,"IRA"],[30,63.9,"AFG"],[30,67.6,"PAK"],[30,71.3,"PAK"],[30,75,"IN"],[30,78.7,"IN"],[30,82.3,"NEP"],[30,86,"CN"],[30,89.7,"CN"],[30,93.4,"CN"],[30,97.1,"CN"],[30,100.8,"CN"],[30,104.5,"CN"],[30,108.2,"CN"],[30,111.9,"CN"],[30,115.6,"CN"],[30,119.3,"CN"],[26.8,-111.9,"MX"],[26.8,-108.3,"MX"],[26.8,-104.7,"MX"],[26.8,-101.1,"MX"],[26.8,-97.5,"US"],[26.8,-11.5,"MOR"],[26.8,-7.9,"MAU"],[26.8,-4.3,"ALG"],[26.8,-0.7,"ALG"],[26.8,2.8,"ALG"],[26.8,6.4,"ALG"],[26.8,10,"LIB"],[26.8,13.6,"LIB"],[26.8,17.2,"LIB"],[26.8,20.8,"LIB"],[26.8,24.4,"LIB"],[26.8,27.9,"EG"],[26.8,31.5,"EG"],[26.8,38.7,"SA"],[26.8,42.3,"SA"],[26.8,45.9,"SA"],[26.8,49.4,"SA"],[26.8,60.2,"IRA"],[26.8,63.8,"PAK"],[26.8,67.4,"PAK"],[26.8,71,"IN"],[26.8,74.5,"IN"],[26.8,78.1,"IN"],[26.8,81.7,"IN"],[26.8,85.3,"NEP"],[26.8,88.9,"IN"],[26.8,92.5,"IN"],[26.8,96.1,"MYA"],[26.8,99.6,"CN"],[26.8,103.2,"CN"],[26.8,106.8,"CN"],[26.8,110.4,"CN"],[26.8,114,"CN"],[26.8,117.6,"CN"],[23.6,-110.2,"MX"],[23.6,-106.7,"MX"],[23.6,-103.2,"MX"],[23.6,-99.7,"MX"],[23.6,-15.9,"MOR"],[23.6,-12.4,"W. "],[23.6,-8.9,"MAU"],[23.6,-5.4,"MAL"],[23.6,-1.9,"ALG"],[23.6,1.6,"ALG"],[23.6,5.1,"ALG"],[23.6,8.6,"ALG"],[23.6,12.1,"LIB"],[23.6,15.6,"LIB"],[23.6,19,"LIB"],[23.6,22.5,"LIB"],[23.6,26,"EG"],[23.6,29.5,"EG"],[23.6,33,"EG"],[23.6,40,"SA"],[23.6,43.5,"SA"],[23.6,47,"SA"],[23.6,50.5,"SA"],[23.6,54,"AE"],[23.6,57.5,"OMA"],[23.6,71.4,"IN"],[23.6,74.9,"IN"],[23.6,78.4,"IN"],[23.6,81.9,"IN"],[23.6,85.4,"IN"],[23.6,88.9,"BAN"],[23.6,92.4,"IN"],[23.6,95.9,"MYA"],[23.6,99.4,"CN"],[23.6,102.9,"CN"],[23.6,106.3,"CN"],[23.6,109.8,"CN"],[23.6,113.3,"CN"],[23.6,116.8,"CN"],[23.6,120.3,"TAI"],[20.4,-104.9,"MX"],[20.4,-101.5,"MX"],[20.4,-98.1,"MX"],[20.4,-87.8,"MX"],[20.4,-16.1,"MAU"],[20.4,-12.7,"MAU"],[20.4,-9.3,"MAU"],[20.4,-5.9,"MAL"],[20.4,-2.5,"MAL"],[20.4,0.9,"MAL"],[20.4,4.4,"ALG"],[20.4,7.8,"NIG"],[20.4,11.2,"NIG"],[20.4,14.6,"NIG"],[20.4,18,"CHA"],[20.4,21.4,"CHA"],[20.4,24.8,"LIB"],[20.4,28.3,"SUD"],[20.4,31.7,"SUD"],[20.4,35.1,"SUD"],[20.4,41.9,"SA"],[20.4,45.3,"SA"],[20.4,48.7,"SA"],[20.4,52.2,"SA"],[20.4,55.6,"OMA"],[20.4,76.1,"IN"],[20.4,79.5,"IN"],[20.4,82.9,"IN"],[20.4,86.3,"IN"],[20.4,93.1,"MYA"],[20.4,96.5,"MYA"],[20.4,100,"MYA"],[20.4,103.4,"LAO"],[20.4,110.2,"CN"],[17.2,-99.6,"MX"],[17.2,-96.3,"MX"],[17.2,-92.9,"MX"],[17.2,-89.6,"GUA"],[17.2,-15.9,"MAU"],[17.2,-12.5,"MAU"],[17.2,-9.2,"MAU"],[17.2,-5.8,"MAU"],[17.2,-2.5,"MAL"],[17.2,0.9,"MAL"],[17.2,4.2,"MAL"],[17.2,7.6,"NIG"],[17.2,10.9,"NIG"],[17.2,14.3,"NIG"],[17.2,17.6,"CHA"],[17.2,21,"CHA"],[17.2,24.3,"SUD"],[17.2,27.7,"SUD"],[17.2,31,"SUD"],[17.2,34.4,"SUD"],[17.2,37.7,"ERI"],[17.2,44.4,"YEM"],[17.2,47.8,"YEM"],[17.2,51.1,"YEM"],[17.2,54.5,"OMA"],[17.2,74.6,"IN"],[17.2,77.9,"IN"],[17.2,81.3,"IN"],[17.2,94.7,"MYA"],[17.2,98,"MYA"],[17.2,101.4,"THA"],[17.2,104.7,"LAO"],[17.2,121.5,"PHI"],[14,-91,"GUA"],[14,-87.7,"HON"],[14,-84.4,"NIC"],[14,-15.1,"SEN"],[14,-11.8,"MAL"],[14,-8.5,"MAL"],[14,-5.2,"MAL"],[14,-1.9,"BUR"],[14,1.4,"NIG"],[14,4.7,"NIG"],[14,8,"NIG"],[14,11.3,"NIG"],[14,14.6,"CHA"],[14,17.9,"CHA"],[14,21.2,"CHA"],[14,24.5,"SUD"],[14,27.8,"SUD"],[14,31.1,"SUD"],[14,34.4,"SUD"],[14,37.7,"ETH"],[14,41,"ETH"],[14,44.3,"YEM"],[14,47.6,"YEM"],[14,77.2,"IN"],[14,100.3,"THA"],[14,103.6,"CAM"],[14,106.9,"CAM"],[14,123.4,"PHI"],[10.8,-85.5,"COS"],[10.8,-72.5,"VEN"],[10.8,-69.2,"VEN"],[10.8,-13.9,"GUI"],[10.8,-10.6,"GUI"],[10.8,-7.3,"MAL"],[10.8,-4.1,"BUR"],[10.8,-0.8,"GHA"],[10.8,2.4,"BEN"],[10.8,5.7,"NG"],[10.8,8.9,"NG"],[10.8,12.2,"NG"],[10.8,15.5,"CHA"],[10.8,18.7,"CHA"],[10.8,22,"CHA"],[10.8,25.2,"SUD"],[10.8,28.5,"SUD"],[10.8,31.8,"SUD"],[10.8,35,"ETH"],[10.8,38.3,"ETH"],[10.8,41.5,"ETH"],[10.8,48,"SOM"],[10.8,77.4,"IN"],[10.8,103.4,"CAM"],[10.8,106.7,"VIE"],[10.8,123,"PHI"],[7.6,-76.7,"COL"],[7.6,-73.5,"COL"],[7.6,-70.2,"VEN"],[7.6,-67,"VEN"],[7.6,-63.8,"VEN"],[7.6,-60.6,"GUY"],[7.6,-12.1,"SIE"],[7.6,-8.9,"GUI"],[7.6,-5.7,"CÔT"],[7.6,-2.4,"GHA"],[7.6,0.8,"TOG"],[7.6,4,"NG"],[7.6,7.2,"NG"],[7.6,10.5,"NG"],[7.6,13.7,"CAM"],[7.6,16.9,"CHA"],[7.6,20.2,"CEN"],[7.6,23.4,"CEN"],[7.6,26.6,"S. "],[7.6,29.8,"S. "],[7.6,33.1,"S. "],[7.6,36.3,"ETH"],[7.6,39.5,"ETH"],[7.6,42.8,"ETH"],[7.6,46,"ETH"],[7.6,49.2,"SOM"],[7.6,81.5,"SRI"],[4.4,-77.3,"COL"],[4.4,-74.1,"COL"],[4.4,-70.9,"COL"],[4.4,-67.7,"VEN"],[4.4,-64.5,"VEN"],[4.4,-61.3,"BR"],[4.4,-58,"GUY"],[4.4,-54.8,"SUR"],[4.4,6.1,"NG"],[4.4,9.4,"CAM"],[4.4,12.6,"CAM"],[4.4,15.8,"CEN"],[4.4,19,"DEM"],[4.4,22.2,"CEN"],[4.4,25.4,"DEM"],[4.4,28.6,"DEM"],[4.4,31.8,"S. "],[4.4,35,"KEN"],[4.4,38.2,"ETH"],[4.4,41.5,"ETH"],[4.4,44.7,"SOM"],[4.4,47.9,"SOM"],[4.4,96,"ID"],[4.4,102.4,"MAL"],[4.4,115.3,"BRU"],[1.2,-77.6,"COL"],[1.2,-74.4,"COL"],[1.2,-71.2,"COL"],[1.2,-68,"BR"],[1.2,-64.8,"BR"],[1.2,-61.6,"BR"],[1.2,-58.4,"BR"],[1.2,-55.2,"BR"],[1.2,-52,"BR"],[1.2,12,"GAB"],[1.2,15.2,"CON"],[1.2,18.4,"DEM"],[1.2,21.6,"DEM"],[1.2,24.8,"DEM"],[1.2,28,"DEM"],[1.2,31.2,"UGA"],[1.2,34.4,"UGA"],[1.2,37.6,"KEN"],[1.2,40.8,"KEN"],[1.2,44,"SOM"],[1.2,101.7,"ID"],[1.2,111.3,"MAL"],[1.2,114.5,"ID"],[1.2,117.7,"ID"],[1.2,120.9,"ID"],[-2,-80.7,"ECU"],[-2,-77.5,"ECU"],[-2,-74.3,"PER"],[-2,-71.1,"COL"],[-2,-67.9,"BR"],[-2,-64.7,"BR"],[-2,-61.5,"BR"],[-2,-58.3,"BR"],[-2,-55.1,"BR"],[-2,-51.9,"BR"],[-2,-48.7,"BR"],[-2,-45.5,"BR"],[-2,12.1,"GAB"],[-2,15.3,"CON"],[-2,18.5,"DEM"],[-2,21.7,"DEM"],[-2,24.9,"DEM"],[-2,28.1,"DEM"],[-2,31.3,"TAN"],[-2,34.5,"TAN"],[-2,37.7,"KEN"],[-2,40.9,"KEN"],[-2,101.8,"ID"],[-2,111.4,"ID"],[-2,114.6,"ID"],[-2,121,"ID"],[-2,133.8,"ID"],[-2,137,"ID"],[-5.2,-80.4,"PER"],[-5.2,-77.2,"PER"],[-5.2,-74,"PER"],[-5.2,-70.8,"BR"],[-5.2,-67.5,"BR"],[-5.2,-64.3,"BR"],[-5.2,-61.1,"BR"],[-5.2,-57.9,"BR"],[-5.2,-54.7,"BR"],[-5.2,-51.5,"BR"],[-5.2,-48.3,"BR"],[-5.2,-45,"BR"],[-5.2,-41.8,"BR"],[-5.2,-38.6,"BR"],[-5.2,12.8,"DEM"],[-5.2,16,"DEM"],[-5.2,19.2,"DEM"],[-5.2,22.4,"DEM"],[-5.2,25.6,"DEM"],[-5.2,28.9,"DEM"],[-5.2,32.1,"TAN"],[-5.2,35.3,"TAN"],[-5.2,38.5,"TAN"],[-5.2,138.1,"ID"],[-5.2,141.3,"PAP"],[-5.2,144.5,"PAP"],[-8.4,-76.5,"PER"],[-8.4,-73.3,"BR"],[-8.4,-70,"BR"],[-8.4,-66.8,"BR"],[-8.4,-63.6,"BR"],[-8.4,-60.3,"BR"],[-8.4,-57.1,"BR"],[-8.4,-53.8,"BR"],[-8.4,-50.6,"BR"],[-8.4,-47.4,"BR"],[-8.4,-44.1,"BR"],[-8.4,-40.9,"BR"],[-8.4,-37.7,"BR"],[-8.4,14.1,"ANG"],[-8.4,17.3,"ANG"],[-8.4,20.6,"ANG"],[-8.4,23.8,"DEM"],[-8.4,27,"DEM"],[-8.4,30.3,"ZAM"],[-8.4,33.5,"TAN"],[-8.4,36.7,"TAN"],[-8.4,114.4,"ID"],[-8.4,120.8,"ID"],[-8.4,127.3,"TIM"],[-8.4,146.7,"PAP"],[-11.6,-75.5,"PER"],[-11.6,-72.2,"PER"],[-11.6,-68.9,"BOL"],[-11.6,-65.7,"BOL"],[-11.6,-62.4,"BR"],[-11.6,-59.1,"BR"],[-11.6,-55.9,"BR"],[-11.6,-52.6,"BR"],[-11.6,-49.3,"BR"],[-11.6,-46.1,"BR"],[-11.6,-42.8,"BR"],[-11.6,-39.5,"BR"],[-11.6,16,"ANG"],[-11.6,19.3,"ANG"],[-11.6,22.5,"ANG"],[-11.6,25.8,"DEM"],[-11.6,29.1,"ZAM"],[-11.6,32.3,"ZAM"],[-11.6,35.6,"MOZ"],[-11.6,38.9,"MOZ"],[-14.8,-74.1,"PER"],[-14.8,-70.8,"PER"],[-14.8,-67.5,"BOL"],[-14.8,-64.2,"BOL"],[-14.8,-60.8,"BOL"],[-14.8,-57.5,"BR"],[-14.8,-54.2,"BR"],[-14.8,-50.9,"BR"],[-14.8,-47.6,"BR"],[-14.8,-44.3,"BR"],[-14.8,-41,"BR"],[-14.8,15.3,"ANG"],[-14.8,18.6,"ANG"],[-14.8,21.9,"ANG"],[-14.8,25.2,"ZAM"],[-14.8,28.5,"ZAM"],[-14.8,31.8,"MOZ"],[-14.8,35.1,"MAL"],[-14.8,38.4,"MOZ"],[-14.8,48.4,"MAD"],[-14.8,127.8,"AU"],[-14.8,131.1,"AU"],[-14.8,134.4,"AU"],[-14.8,144.4,"AU"],[-18,-69,"BOL"],[-18,-65.6,"BOL"],[-18,-62.2,"BOL"],[-18,-58.9,"BOL"],[-18,-55.5,"BR"],[-18,-52.1,"BR"],[-18,-48.8,"BR"],[-18,-45.4,"BR"],[-18,-42,"BR"],[-18,15.2,"NAM"],[-18,18.5,"NAM"],[-18,21.9,"NAM"],[-18,25.2,"BOT"],[-18,28.6,"ZIM"],[-18,32,"ZIM"],[-18,35.3,"MOZ"],[-18,45.4,"MAD"],[-18,48.8,"MAD"],[-18,122.8,"AU"],[-18,126.2,"AU"],[-18,129.6,"AU"],[-18,132.9,"AU"],[-18,136.3,"AU"],[-18,139.6,"AU"],[-18,143,"AU"],[-21.2,-66.7,"BOL"],[-21.2,-63.3,"BOL"],[-21.2,-59.9,"PAR"],[-21.2,-56.4,"BR"],[-21.2,-53,"BR"],[-21.2,-49.6,"BR"],[-21.2,-46.1,"BR"],[-21.2,-42.7,"BR"],[-21.2,15.6,"NAM"],[-21.2,19.1,"NAM"],[-21.2,22.5,"BOT"],[-21.2,25.9,"BOT"],[-21.2,29.4,"ZIM"],[-21.2,32.8,"MOZ"],[-21.2,46.5,"MAD"],[-21.2,118.6,"AU"],[-21.2,122,"AU"],[-21.2,125.5,"AU"],[-21.2,128.9,"AU"],[-21.2,132.3,"AU"],[-21.2,135.8,"AU"],[-21.2,139.2,"AU"],[-21.2,142.6,"AU"],[-21.2,146.1,"AU"],[-24.4,-67.6,"AR"],[-24.4,-64,"AR"],[-24.4,-60.5,"AR"],[-24.4,-57,"PAR"],[-24.4,-53.5,"BR"],[-24.4,-50,"BR"],[-24.4,16.8,"NAM"],[-24.4,20.3,"BOT"],[-24.4,23.8,"BOT"],[-24.4,27.3,"ZA"],[-24.4,30.8,"ZA"],[-24.4,34.3,"MOZ"],[-24.4,44.9,"MAD"],[-24.4,115.2,"AU"],[-24.4,118.7,"AU"],[-24.4,122.2,"AU"],[-24.4,125.7,"AU"],[-24.4,129.2,"AU"],[-24.4,132.7,"AU"],[-24.4,136.2,"AU"],[-24.4,139.8,"AU"],[-24.4,143.3,"AU"],[-24.4,146.8,"AU"],[-24.4,150.3,"AU"],[-27.6,-68.1,"AR"],[-27.6,-64.5,"AR"],[-27.6,-60.8,"AR"],[-27.6,-57.2,"AR"],[-27.6,-53.6,"BR"],[-27.6,-50,"BR"],[-27.6,18.6,"NAM"],[-27.6,22.2,"ZA"],[-27.6,25.8,"ZA"],[-27.6,29.4,"ZA"],[-27.6,116.1,"AU"],[-27.6,119.7,"AU"],[-27.6,123.3,"AU"],[-27.6,126.9,"AU"],[-27.6,130.5,"AU"],[-27.6,134.1,"AU"],[-27.6,137.8,"AU"],[-27.6,141.4,"AU"],[-27.6,145,"AU"],[-27.6,148.6,"AU"],[-27.6,152.2,"AU"],[-30.8,-68.2,"AR"],[-30.8,-64.5,"AR"],[-30.8,-60.8,"AR"],[-30.8,-57.1,"URU"],[-30.8,-53.3,"BR"],[-30.8,21.2,"ZA"],[-30.8,24.9,"ZA"],[-30.8,28.6,"ZA"],[-30.8,118,"AU"],[-30.8,121.8,"AU"],[-30.8,125.5,"AU"],[-30.8,129.2,"AU"],[-30.8,132.9,"AU"],[-30.8,136.7,"AU"],[-30.8,140.4,"AU"],[-30.8,144.1,"AU"],[-30.8,147.8,"AU"],[-30.8,151.6,"AU"],[-34,-68.1,"AR"],[-34,-64.2,"AR"],[-34,-60.3,"AR"],[-34,-56.5,"URU"],[-34,20.7,"ZA"],[-34,117.2,"AU"],[-34,136.5,"AU"],[-34,140.4,"AU"],[-34,144.2,"AU"],[-34,148.1,"AU"],[-37.2,-71.5,"CHI"],[-37.2,-67.5,"AR"],[-37.2,-63.5,"AR"],[-37.2,-59.5,"AR"],[-37.2,141.4,"AU"],[-37.2,145.4,"AU"],[-37.2,149.4,"AU"],[-40.4,-70.7,"AR"],[-40.4,-66.5,"AR"],[-40.4,-62.3,"AR"],[-43.6,-69.5,"AR"],[-46.8,-72.5,"CHI"],[-46.8,-67.8,"AR"],[-50,-75.5,"CHI"],[-50,-70.5,"AR"],[1.3,103.8,"SG"]];

export const WORLD_DOTS: DotPoint[] = WORLD_DOTS_RAW.map(([lat, lng, code]) => ({
  lat,
  lng,
  code,
}));

export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  "US": {
    "code": "US",
    "name": "United States of America",
    "flag": "🇺🇸",
    "capital": "Washington, D.C.",
    "region": "North America",
    "lat": 43.1,
    "lng": -108.3,
    "metrics": {
      "activeUsers": "48.2M",
      "networkSpeed": "940 Mbps",
      "ping": "12 ms",
      "status": "Operational"
    }
  },
  "IN": {
    "code": "IN",
    "name": "India",
    "flag": "🇮🇳",
    "capital": "New Delhi",
    "region": "South Asia",
    "lat": 23.1,
    "lng": 79.8,
    "metrics": {
      "activeUsers": "82.4M",
      "networkSpeed": "620 Mbps",
      "ping": "18 ms",
      "status": "Optimal"
    }
  },
  "GB": {
    "code": "GB",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "capital": "London",
    "region": "Europe",
    "lat": 54,
    "lng": -3.1,
    "metrics": {
      "activeUsers": "18.7M",
      "networkSpeed": "850 Mbps",
      "ping": "9 ms",
      "status": "Operational"
    }
  },
  "DE": {
    "code": "DE",
    "name": "Germany",
    "flag": "🇩🇪",
    "capital": "Berlin",
    "region": "Europe",
    "lat": 51.3,
    "lng": 11.3,
    "metrics": {
      "activeUsers": "22.1M",
      "networkSpeed": "890 Mbps",
      "ping": "11 ms",
      "status": "Operational"
    }
  },
  "FR": {
    "code": "FR",
    "name": "France",
    "flag": "🇫🇷",
    "capital": "Paris",
    "region": "Europe",
    "lat": 47.6,
    "lng": 2.8,
    "metrics": {
      "activeUsers": "16.5M",
      "networkSpeed": "820 Mbps",
      "ping": "14 ms",
      "status": "Operational"
    }
  },
  "JP": {
    "code": "JP",
    "name": "Japan",
    "flag": "🇯🇵",
    "capital": "Tokyo",
    "region": "East Asia",
    "lat": 37.5,
    "lng": 136.9,
    "metrics": {
      "activeUsers": "34.8M",
      "networkSpeed": "1.2 Gbps",
      "ping": "8 ms",
      "status": "Optimal"
    }
  },
  "BR": {
    "code": "BR",
    "name": "Brazil",
    "flag": "🇧🇷",
    "capital": "Brasília",
    "region": "South America",
    "lat": -10.1,
    "lng": -53.7,
    "metrics": {
      "activeUsers": "29.3M",
      "networkSpeed": "480 Mbps",
      "ping": "26 ms",
      "status": "Operational"
    }
  },
  "AU": {
    "code": "AU",
    "name": "Australia",
    "flag": "🇦🇺",
    "capital": "Canberra",
    "region": "Oceania",
    "lat": -25.6,
    "lng": 134.4,
    "metrics": {
      "activeUsers": "11.9M",
      "networkSpeed": "780 Mbps",
      "ping": "22 ms",
      "status": "Operational"
    }
  },
  "CA": {
    "code": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "capital": "Ottawa",
    "region": "North America",
    "lat": 57.8,
    "lng": -97.9,
    "metrics": {
      "activeUsers": "14.2M",
      "networkSpeed": "860 Mbps",
      "ping": "15 ms",
      "status": "Operational"
    }
  },
  "CN": {
    "code": "CN",
    "name": "China",
    "flag": "🇨🇳",
    "capital": "Beijing",
    "region": "East Asia",
    "lat": 35.7,
    "lng": 104.5,
    "metrics": {
      "activeUsers": "95.6M",
      "networkSpeed": "980 Mbps",
      "ping": "20 ms",
      "status": "Operational"
    }
  },
  "ZA": {
    "code": "ZA",
    "name": "South Africa",
    "flag": "🇿🇦",
    "capital": "Pretoria",
    "region": "Africa",
    "lat": -28.7,
    "lng": 25.7,
    "metrics": {
      "activeUsers": "8.4M",
      "networkSpeed": "380 Mbps",
      "ping": "34 ms",
      "status": "Operational"
    }
  },
  "AE": {
    "code": "AE",
    "name": "United Arab Emirates",
    "flag": "🇦🇪",
    "capital": "Abu Dhabi",
    "region": "Middle East",
    "lat": 23.6,
    "lng": 54,
    "metrics": {
      "activeUsers": "6.7M",
      "networkSpeed": "1.1 Gbps",
      "ping": "14 ms",
      "status": "Optimal"
    }
  },
  "SG": {
    "code": "SG",
    "name": "Singapore",
    "flag": "🇸🇬",
    "capital": "Singapore",
    "region": "Southeast Asia",
    "lat": 1.3,
    "lng": 103.8,
    "metrics": {
      "activeUsers": "5.2M",
      "networkSpeed": "1.4 Gbps",
      "ping": "6 ms",
      "status": "Optimal"
    }
  },
  "IT": {
    "code": "IT",
    "name": "Italy",
    "flag": "🇮🇹",
    "capital": "Rome",
    "region": "Europe",
    "lat": 44.9,
    "lng": 11.4,
    "metrics": {
      "activeUsers": "12.8M",
      "networkSpeed": "710 Mbps",
      "ping": "16 ms",
      "status": "Operational"
    }
  },
  "ES": {
    "code": "ES",
    "name": "Spain",
    "flag": "🇪🇸",
    "capital": "Madrid",
    "region": "Europe",
    "lat": 40.2,
    "lng": -3.8,
    "metrics": {
      "activeUsers": "13.4M",
      "networkSpeed": "740 Mbps",
      "ping": "15 ms",
      "status": "Operational"
    }
  },
  "MX": {
    "code": "MX",
    "name": "Mexico",
    "flag": "🇲🇽",
    "capital": "Mexico City",
    "region": "North America",
    "lat": 23.2,
    "lng": -102.5,
    "metrics": {
      "activeUsers": "19.1M",
      "networkSpeed": "420 Mbps",
      "ping": "28 ms",
      "status": "Operational"
    }
  },
  "NL": {
    "code": "NL",
    "name": "Netherlands",
    "flag": "🇳🇱",
    "capital": "Amsterdam",
    "region": "Europe",
    "lat": 0,
    "lng": 0,
    "metrics": {
      "activeUsers": "9.3M",
      "networkSpeed": "960 Mbps",
      "ping": "7 ms",
      "status": "Optimal"
    }
  },
  "SE": {
    "code": "SE",
    "name": "Sweden",
    "flag": "🇸🇪",
    "capital": "Stockholm",
    "region": "Europe",
    "lat": 58.8,
    "lng": 11.5,
    "metrics": {
      "activeUsers": "7.1M",
      "networkSpeed": "910 Mbps",
      "ping": "10 ms",
      "status": "Optimal"
    }
  },
  "SA": {
    "code": "SA",
    "name": "Saudi Arabia",
    "flag": "🇸🇦",
    "capital": "Riyadh",
    "region": "Middle East",
    "lat": 24.5,
    "lng": 44.7,
    "metrics": {
      "activeUsers": "11.5M",
      "networkSpeed": "790 Mbps",
      "ping": "21 ms",
      "status": "Operational"
    }
  },
  "AR": {
    "code": "AR",
    "name": "Argentina",
    "flag": "🇦🇷",
    "capital": "Buenos Aires",
    "region": "South America",
    "lat": -34.1,
    "lng": -64.8,
    "metrics": {
      "activeUsers": "10.2M",
      "networkSpeed": "390 Mbps",
      "ping": "32 ms",
      "status": "Operational"
    }
  },
  "KR": {
    "code": "KR",
    "name": "South Korea",
    "flag": "🇰🇷",
    "capital": "Seoul",
    "region": "East Asia",
    "lat": 0,
    "lng": 0,
    "metrics": {
      "activeUsers": "24.6M",
      "networkSpeed": "1.3 Gbps",
      "ping": "7 ms",
      "status": "Optimal"
    }
  },
  "RU": {
    "code": "RU",
    "name": "Russia",
    "flag": "🇷🇺",
    "capital": "Moscow",
    "region": "Eurasia",
    "lat": 60.5,
    "lng": 60.7,
    "metrics": {
      "activeUsers": "38.4M",
      "networkSpeed": "550 Mbps",
      "ping": "24 ms",
      "status": "Operational"
    }
  },
  "ID": {
    "code": "ID",
    "name": "Indonesia",
    "flag": "🇮🇩",
    "capital": "Jakarta",
    "region": "Southeast Asia",
    "lat": -1.8,
    "lng": 117.4,
    "metrics": {
      "activeUsers": "28.7M",
      "networkSpeed": "360 Mbps",
      "ping": "31 ms",
      "status": "Operational"
    }
  },
  "EG": {
    "code": "EG",
    "name": "Egypt",
    "flag": "🇪🇬",
    "capital": "Cairo",
    "region": "North Africa",
    "lat": 26.8,
    "lng": 30,
    "metrics": {
      "activeUsers": "9.8M",
      "networkSpeed": "310 Mbps",
      "ping": "38 ms",
      "status": "Operational"
    }
  },
  "NG": {
    "code": "NG",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "capital": "Abuja",
    "region": "West Africa",
    "lat": 8.5,
    "lng": 7.8,
    "metrics": {
      "activeUsers": "15.3M",
      "networkSpeed": "270 Mbps",
      "ping": "45 ms",
      "status": "Operational"
    }
  },
  "TR": {
    "code": "TR",
    "name": "Turkey",
    "flag": "🇹🇷",
    "capital": "Ankara",
    "region": "Eurasia",
    "lat": 39.6,
    "lng": 36,
    "metrics": {
      "activeUsers": "14.9M",
      "networkSpeed": "510 Mbps",
      "ping": "23 ms",
      "status": "Operational"
    }
  },
  "NO": {
    "code": "NO",
    "name": "Norway",
    "flag": "🇳🇴",
    "capital": "Oslo",
    "region": "Europe",
    "lat": 62,
    "lng": 10.9,
    "metrics": {
      "activeUsers": "4.8M",
      "networkSpeed": "940 Mbps",
      "ping": "9 ms",
      "status": "Optimal"
    }
  },
  "NZ": {
    "code": "NZ",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "capital": "Wellington",
    "region": "Oceania",
    "lat": 0,
    "lng": 0,
    "metrics": {
      "activeUsers": "3.6M",
      "networkSpeed": "720 Mbps",
      "ping": "25 ms",
      "status": "Operational"
    }
  },
  "CH": {
    "code": "CH",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "capital": "Bern",
    "region": "Europe",
    "lat": 0,
    "lng": 0,
    "metrics": {
      "activeUsers": "6.2M",
      "networkSpeed": "980 Mbps",
      "ping": "8 ms",
      "status": "Optimal"
    }
  }
};

export const FEATURED_COUNTRIES: CountryInfo[] = [
  COUNTRIES_DATA['US'],
  COUNTRIES_DATA['IN'],
  COUNTRIES_DATA['GB'],
  COUNTRIES_DATA['JP'],
  COUNTRIES_DATA['DE'],
  COUNTRIES_DATA['FR'],
  COUNTRIES_DATA['BR'],
  COUNTRIES_DATA['AU'],
  COUNTRIES_DATA['CA'],
  COUNTRIES_DATA['AE'],
  COUNTRIES_DATA['SG'],
  COUNTRIES_DATA['ZA'],
].filter(Boolean);

export const SAMPLE_ARCS: FlightArc[] = [
  { fromCode: 'US', toCode: 'GB', fromLat: 40.7, fromLng: -74.0, toLat: 51.5, toLng: -0.1, label: 'Transatlantic Optical (NYC - LDN)', color: '#00D4FF' },
  { fromCode: 'GB', toCode: 'IN', fromLat: 51.5, fromLng: -0.1, toLat: 19.0, toLng: 72.8, label: 'Eurasia Gateway (LDN - BOM)', color: '#38BDF8' },
  { fromCode: 'IN', toCode: 'SG', fromLat: 19.0, fromLng: 72.8, toLat: 1.3, toLng: 103.8, label: 'Indo-Pacific Fiber (BOM - SIN)', color: '#10B981' },
  { fromCode: 'SG', toCode: 'JP', fromLat: 1.3, fromLng: 103.8, toLat: 35.6, toLng: 139.6, label: 'Asia Backbone (SIN - TYO)', color: '#818CF8' },
  { fromCode: 'JP', toCode: 'US', fromLat: 35.6, fromLng: 139.6, toLat: 37.7, toLng: -122.4, label: 'Transpacific Fastlane (TYO - SFO)', color: '#F43F5E' },
  { fromCode: 'US', toCode: 'BR', fromLat: 25.7, fromLng: -80.2, toLat: -23.5, toLng: -46.6, label: 'Pan-American Highway (MIA - SAO)', color: '#F59E0B' },
  { fromCode: 'GB', toCode: 'ZA', fromLat: 51.5, fromLng: -0.1, toLat: -33.9, toLng: 18.4, label: 'Atlantic Meridian (LDN - CPT)', color: '#A855F7' },
  { fromCode: 'SG', toCode: 'AU', fromLat: 1.3, fromLng: 103.8, toLat: -33.8, toLng: 151.2, label: 'Southern Cross Link (SIN - SYD)', color: '#06B6D4' }
];

// Complete Fibonacci Sphere dots for oceans and global matrix
export const OCEAN_SPHERE_DOTS: { lat: number; lng: number }[] = (() => {
  const dots: { lat: number; lng: number }[] = [];
  const count = 420;
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const lat = 90 - (phi * 180) / Math.PI;
    const lng = (((theta * 180) / Math.PI) % 360) - 180;
    dots.push({ lat, lng });
  }
  return dots;
})();

export interface GlobeDot {
  lat: number;
  lng: number;
  isLand: boolean;
  code: string;
}

export const ALL_GLOBE_DOTS: GlobeDot[] = [
  ...WORLD_DOTS.map((d) => ({ lat: d.lat, lng: d.lng, isLand: true, code: d.code })),
  ...OCEAN_SPHERE_DOTS.map((d) => ({ lat: d.lat, lng: d.lng, isLand: false, code: '' })),
];


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type WorldMapMode = 'globe' | 'flat';

export interface DotTheme {
  id: string;
  name: string;
  dotColor: string;
  accentColor: string;
  oceanDotColor: string;
}

export interface GlobeCoreTheme {
  id: string;
  name: string;
  coreStart: string;
  coreMid: string;
  coreEnd: string;
  atmosphereColor: string;
  rimColor: string;
}

export const DOT_THEMES: DotTheme[] = [
  { id: 'cyan', name: 'Cyan', dotColor: '#00D4FF', accentColor: '#38BDF8', oceanDotColor: 'rgba(56, 189, 248, 0.22)' },
  { id: 'emerald', name: 'Emerald', dotColor: '#10B981', accentColor: '#34D399', oceanDotColor: 'rgba(52, 211, 153, 0.22)' },
  { id: 'amber', name: 'Gold', dotColor: '#F59E0B', accentColor: '#FBBF24', oceanDotColor: 'rgba(251, 191, 36, 0.22)' },
  { id: 'violet', name: 'Violet', dotColor: '#A855F7', accentColor: '#C084FC', oceanDotColor: 'rgba(192, 132, 252, 0.22)' },
  { id: 'rose', name: 'Rose', dotColor: '#F43F5E', accentColor: '#FB7185', oceanDotColor: 'rgba(251, 113, 133, 0.22)' },
  { id: 'silver', name: 'Silver', dotColor: '#F8FAFC', accentColor: '#FFFFFF', oceanDotColor: 'rgba(248, 250, 252, 0.28)' },
];

export const CORE_THEMES: GlobeCoreTheme[] = [
  { id: 'space', name: 'Deep Space', coreStart: '#0F172A', coreMid: '#0B132B', coreEnd: '#020617', atmosphereColor: '#00D4FF', rimColor: 'rgba(56, 189, 248, 0.18)' },
  { id: 'midnight', name: 'Midnight', coreStart: '#090D16', coreMid: '#030712', coreEnd: '#000000', atmosphereColor: '#64748B', rimColor: 'rgba(255, 255, 255, 0.12)' },
  { id: 'nebula', name: 'Nebula', coreStart: '#1C0D30', coreMid: '#120520', coreEnd: '#080110', atmosphereColor: '#A855F7', rimColor: 'rgba(168, 85, 247, 0.22)' },
  { id: 'teal', name: 'Cyber Teal', coreStart: '#04241C', coreMid: '#021611', coreEnd: '#010B08', atmosphereColor: '#10B981', rimColor: 'rgba(16, 185, 129, 0.22)' },
  { id: 'hologram', name: 'Translucent', coreStart: 'rgba(15, 23, 42, 0.35)', coreMid: 'rgba(11, 19, 43, 0.2)', coreEnd: 'rgba(2, 6, 23, 0.05)', atmosphereColor: '#38BDF8', rimColor: 'rgba(56, 189, 248, 0.25)' },
];

export interface StarsGlobeProps {
  initialMode?: WorldMapMode;
  mode?: WorldMapMode;
  onModeChange?: (mode: WorldMapMode) => void;
  allowModeToggle?: boolean;
  size?: number;
  selectedCountryCode?: string | null;
  onSelectCountry?: (country: CountryInfo | null) => void;
  onInteractionChange?: (isInteracting: boolean) => void;
  dotColor?: string;
  oceanDotColor?: string;
  globeCoreColor?: string;
  atmosphereColor?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showAtmosphere?: boolean;
  showCustomizationControls?: boolean;
}

export type StarsWorldProps = StarsGlobeProps;

// Pre-computed dispersed positions for starburst assembly
const SCATTER_SEED = (ALL_GLOBE_DOTS || []).map((_, i) => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const dist = 160 + (i % 65) * 3.8;
  return {
    sx: Math.cos(angle) * dist,
    sy: Math.sin(angle) * dist,
    sz: ((i % 120) - 60) * 3.6,
    delay: (i % 50) / 110,
  };
});

function circlePath(cx: number, cy: number, r: number): string {
  const roundedX = Math.round(cx * 10) / 10;
  const roundedY = Math.round(cy * 10) / 10;
  const roundedR = Math.round(r * 10) / 10;
  return `M${roundedX - roundedR} ${roundedY}a${roundedR} ${roundedR} 0 1 0 ${2 * roundedR} 0a${roundedR} ${roundedR} 0 1 0 ${-2 * roundedR} 0`;
}

export const StarsGlobe: React.FC<StarsGlobeProps> = ({
  initialMode = 'globe',
  mode: controlledMode,
  onModeChange,
  allowModeToggle = true,
  size = Math.min(SCREEN_WIDTH - 16, 380),
  selectedCountryCode,
  onSelectCountry,
  onInteractionChange,
  dotColor: propDotColor,
  oceanDotColor: propOceanDotColor,
  globeCoreColor: propGlobeCoreColor,
  atmosphereColor: propAtmosphereColor,
  autoRotate: initialAutoRotate = true,
  autoRotateSpeed: initialSpeed = 0.35,
  showAtmosphere = true,
  showCustomizationControls = true,
}) => {
  // Decoupled mode state: works seamlessly in both controlled & uncontrolled mode
  const [internalMode, setInternalMode] = useState<WorldMapMode>(initialMode);
  const activeMode = controlledMode !== undefined ? controlledMode : internalMode;

  // Morph progress: 1.0 = Globe, 0.0 = Flat Map
  const morphProgressRef = useRef<number>(activeMode === 'globe' ? 1 : 0);
  const [morphProgress, setMorphProgress] = useState<number>(activeMode === 'globe' ? 1 : 0);
  const morphAnimFrameRef = useRef<number | null>(null);

  // Themes
  const [selectedDotTheme, setSelectedDotTheme] = useState<string>('cyan');
  const [selectedCoreTheme, setSelectedCoreTheme] = useState<string>('space');
  const [currentSpeed, setCurrentSpeed] = useState<number>(initialSpeed);

  const activeDotTheme = DOT_THEMES.find((t) => t.id === selectedDotTheme) || DOT_THEMES[0];
  const activeCoreTheme = CORE_THEMES.find((t) => t.id === selectedCoreTheme) || CORE_THEMES[0];

  const currentDotColor = propDotColor || activeDotTheme.dotColor;
  const currentAccentColor = activeDotTheme.accentColor;
  const currentOceanDotColor = propOceanDotColor || activeDotTheme.oceanDotColor;
  const currentAtmosphereColor = propAtmosphereColor || activeCoreTheme.atmosphereColor;

  // Selected Country
  const [internalSelectedCode, setInternalSelectedCode] = useState<string | null>(
    selectedCountryCode !== undefined ? selectedCountryCode : 'IN'
  );
  const activeCode = selectedCountryCode !== undefined ? selectedCountryCode : internalSelectedCode;
  const activeCountry = activeCode ? COUNTRIES_DATA[activeCode] || null : null;

  // 3D Globe Rotation
  const initLng = activeCountry ? -activeCountry.lng : 15;
  const initLat = activeCountry ? -Math.max(-30, Math.min(30, activeCountry.lat * 0.45)) : 18;
  const rotationLngRef = useRef(initLng);
  const tiltLatRef = useRef(initLat);
  const [rotationState, setRotationState] = useState({ lng: initLng, lat: initLat });

  // 2D Flat Pan offset
  const flatPanRef = useRef({ x: 0, y: 0 });
  const [flatPan, setFlatPan] = useState({ x: 0, y: 0 });

  // Auto rotation
  const [isAutoRotating, setIsAutoRotating] = useState(initialAutoRotate);
  const isInteractingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Appearance build animation
  const [appearProgress, setAppearProgress] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Responsive adaptive canvas height: smoothly transitions from flat (size * 0.62) to globe (size * 0.98)
  const canvasHeight = Math.round(size * (0.62 + 0.36 * morphProgress));
  const center = { x: size / 2, y: canvasHeight / 2 };
  const radius = (size * 0.44) * (0.86 + 0.14 * morphProgress);

  // Trigger celestial dots build animation
  const playAppearAnimation = useCallback(() => {
    setAppearProgress(0);
    let startTime: number | null = null;
    const duration = 1800;

    const step = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAppearProgress(eased);

      if (p < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    playAppearAnimation();
  }, [playAppearAnimation]);

  // Pulse phase interval for beacon
  useEffect(() => {
    let phase = 0;
    const interval = setInterval(() => {
      phase = (phase + 0.05) % 1;
      setPulsePhase(phase);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Robust 60fps Morphing between Flat Map and 3D Globe
  const animateMorphTo = useCallback((targetValue: number) => {
    if (morphAnimFrameRef.current) {
      cancelAnimationFrame(morphAnimFrameRef.current);
      morphAnimFrameRef.current = null;
    }
    const startVal = morphProgressRef.current;
    if (Math.abs(startVal - targetValue) < 0.001) {
      morphProgressRef.current = targetValue;
      setMorphProgress(targetValue);
      return;
    }

    let startTime: number | null = null;
    const duration = 680; // 680ms silky smooth transition

    const step = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const p = Math.min(1, elapsed / duration);
      // Quintic ease in-out
      const eased = p < 0.5 ? 16 * Math.pow(p, 5) : 1 - Math.pow(-2 * p + 2, 5) / 2;
      const current = startVal + (targetValue - startVal) * eased;

      morphProgressRef.current = current;
      setMorphProgress(current);

      if (p < 1) {
        morphAnimFrameRef.current = requestAnimationFrame(step);
      } else {
        morphProgressRef.current = targetValue;
        setMorphProgress(targetValue);
        morphAnimFrameRef.current = null;
      }
    };
    morphAnimFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Sync if controlledMode changes from outside
  useEffect(() => {
    if (controlledMode !== undefined) {
      const target = controlledMode === 'globe' ? 1 : 0;
      if (Math.abs(morphProgressRef.current - target) > 0.01) {
        animateMorphTo(target);
      }
    }
  }, [controlledMode, animateMorphTo]);

  // Mode Switch Handler (Works unconditionally from flat <-> globe)
  const switchMode = (newMode: WorldMapMode) => {
    if (controlledMode === undefined) {
      setInternalMode(newMode);
    }
    onModeChange?.(newMode);
    animateMorphTo(newMode === 'globe' ? 1 : 0);
  };

  // Camera fly-to when country selected
  const flyToCountry = useCallback(
    (country: CountryInfo) => {
      isInteractingRef.current = true;
      const startLng = rotationLngRef.current;
      const startLat = tiltLatRef.current;

      const targetLng = -country.lng;
      const targetLat = -Math.max(-35, Math.min(35, country.lat * 0.45));

      let diffLng = (targetLng - startLng) % 360;
      if (diffLng > 180) diffLng -= 360;
      if (diffLng < -180) diffLng += 360;

      let startTime: number | null = null;
      const duration = 850;

      const animateFly = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const currentLng = (startLng + diffLng * eased) % 360;
        const currentLat = startLat + (targetLat - startLat) * eased;

        rotationLngRef.current = currentLng;
        tiltLatRef.current = currentLat;
        setRotationState({ lng: currentLng, lat: currentLat });

        if (t < 1) {
          requestAnimationFrame(animateFly);
        } else {
          isInteractingRef.current = false;
        }
      };

      requestAnimationFrame(animateFly);
    },
    []
  );

  const handleCountryPress = (country: CountryInfo) => {
    const nextCode = activeCode === country.code ? null : country.code;
    setInternalSelectedCode(nextCode);
    if (onSelectCountry) {
      onSelectCountry(nextCode ? country : null);
    }
    if (nextCode) {
      flyToCountry(country);
    }
  };

  // 60FPS Continuous Auto-Rotation loop (active in globe mode)
  useEffect(() => {
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isInteractingRef.current && isAutoRotating && morphProgressRef.current > 0.25) {
        const delta = currentSpeed * 60 * dt;
        const newLng = (rotationLngRef.current + delta) % 360;
        rotationLngRef.current = newLng;
        setRotationState({ lng: newLng, lat: tiltLatRef.current });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, currentSpeed]);

  // Gestures: Globe 3D Rotation or Flat 2D Pan
  const startRotationRef = useRef({ lng: initLng, lat: initLat });
  const startFlatPanRef = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        isInteractingRef.current = true;
        startRotationRef.current = {
          lng: rotationLngRef.current,
          lat: tiltLatRef.current,
        };
        startFlatPanRef.current = { ...flatPanRef.current };
        onInteractionChange?.(true);
      },
      onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (morphProgressRef.current > 0.4) {
          // 3D Globe Rotation
          const sensitivity = 0.55;
          const newLng = (startRotationRef.current.lng + gestureState.dx * sensitivity) % 360;
          const newLat = Math.max(
            -60,
            Math.min(60, startRotationRef.current.lat - gestureState.dy * (sensitivity * 0.7))
          );
          rotationLngRef.current = newLng;
          tiltLatRef.current = newLat;
          setRotationState({ lng: newLng, lat: newLat });
        } else {
          // 2D Flat Pan
          const newX = Math.max(-55, Math.min(55, startFlatPanRef.current.x + gestureState.dx * 0.5));
          const newY = Math.max(-35, Math.min(35, startFlatPanRef.current.y + gestureState.dy * 0.5));
          flatPanRef.current = { x: newX, y: newY };
          setFlatPan({ x: newX, y: newY });
        }
      },
      onPanResponderRelease: () => {
        isInteractingRef.current = false;
        onInteractionChange?.(false);
      },
      onPanResponderTerminate: () => {
        isInteractingRef.current = false;
        onInteractionChange?.(false);
      },
    })
  ).current;

  // Unified Dot Projection with Morphing Interpolation
  const { frontLandDots, frontOceanDots, backDotsPath, highlightDotsPath, beaconCenter } = useMemo(() => {
    const radLng = (rotationState.lng * Math.PI) / 180;
    const radLat = (rotationState.lat * Math.PI) / 180;
    const cosLatTilt = Math.cos(radLat);
    const sinLatTilt = Math.sin(radLat);

    // Flat map card frame dimensions
    const flatCardW = size * 0.96;
    const flatCardH = canvasHeight * 0.90;
    const flatCardX = (size - flatCardW) / 2;
    const flatCardY = (canvasHeight - flatCardH) / 2;

    // Safe inner padding so dots never touch or spill outside boundaries & rounded corners
    const padX = 18;
    const padY = 16;
    const flatW = flatCardW - padX * 2;
    const flatH = flatCardH - padY * 2;
    const flatLeft = flatCardX + padX + flatPan.x;
    const flatTop = flatCardY + padY + flatPan.y;

    let frontLandStr = '';
    let frontOceanStr = '';
    let backStr = '';
    let highlightStr = '';
    let selectedCentroidPx: { x: number; y: number; visible: boolean } | null = null;

    const m = morphProgress; // 1 = Globe, 0 = Flat

    for (let i = 0; i < ALL_GLOBE_DOTS.length; i++) {
      const dot = ALL_GLOBE_DOTS[i];
      const scatter = SCATTER_SEED[i];

      // Staggered local progress
      const localP = Math.max(0, Math.min(1, (appearProgress - scatter.delay) / (1 - scatter.delay)));
      const easedLocal =
        localP < 0.5 ? 4 * localP * localP * localP : 1 - Math.pow(-2 * localP + 2, 3) / 2;

      // 1. Globe 3D Coordinates
      const phi = (dot.lat * Math.PI) / 180;
      const theta = (dot.lng * Math.PI) / 180 + radLng;

      const x0 = Math.cos(phi) * Math.sin(theta);
      const y0 = -Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(theta);

      const targetX = x0;
      const targetY = y0 * cosLatTilt - z0 * sinLatTilt;
      const targetZ = y0 * sinLatTilt + z0 * cosLatTilt;

      const startX = scatter.sx / radius;
      const startY = scatter.sy / radius;

      const globeX = center.x + (startX + (targetX - startX) * easedLocal) * radius;
      const globeY = center.y + (startY + (targetY - startY) * easedLocal) * radius;

      // 2. Flat 2D Map Coordinates (properly normalized within card boundaries)
      const normLng = (dot.lng + 180) / 360;
      const normLat = Math.max(0, Math.min(1, (84 - dot.lat) / 146));
      const targetFlatX = flatLeft + normLng * flatW;
      const targetFlatY = flatTop + normLat * flatH;

      const flatX = center.x + (scatter.sx * 0.75) * (1 - easedLocal) + (targetFlatX - center.x) * easedLocal;
      const flatY = center.y + (scatter.sy * 0.75) * (1 - easedLocal) + (targetFlatY - center.y) * easedLocal;

      // 3. Morphing Interpolation
      const px = flatX + (globeX - flatX) * m;
      const py = flatY + (globeY - flatY) * m;

      const isSelected = activeCode !== null && dot.code === activeCode && dot.isLand;

      // In Flat mode (m=0), all dots are visible. In Globe mode (m=1), targetZ determines front/back.
      const isFront = m < 0.25 || targetZ > -0.15;
      const depthScale = (1 - m) * 1.05 + m * (0.85 + Math.max(-0.2, targetZ) * 0.3);

      if (isFront) {
        if (isSelected) {
          highlightStr += circlePath(px, py, 2.5 * depthScale);
        } else if (dot.isLand) {
          frontLandStr += circlePath(px, py, 1.45 * depthScale);
        } else {
          // Oceans: subtle star matrix
          frontOceanStr += circlePath(px, py, 1.05 * depthScale);
        }
      } else if (appearProgress > 0.6 && m > 0.35) {
        // Holographic volume dots on globe back
        const backR = dot.isLand ? 0.85 : 0.65;
        backStr += circlePath(px, py, backR);
      }
    }

    // Project active country centroid
    if (activeCountry) {
      // Globe centroid
      const phi = (activeCountry.lat * Math.PI) / 180;
      const theta = (activeCountry.lng * Math.PI) / 180 + radLng;
      const x0 = Math.cos(phi) * Math.sin(theta);
      const y0 = -Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(theta);
      const targetX = x0;
      const targetY = y0 * cosLatTilt - z0 * sinLatTilt;
      const targetZ = y0 * sinLatTilt + z0 * cosLatTilt;

      const globeCentroidX = center.x + targetX * radius;
      const globeCentroidY = center.y + targetY * radius;

      // Flat centroid
      const flatCentroidX = flatLeft + ((activeCountry.lng + 180) / 360) * flatW;
      const flatNormLat = Math.max(0, Math.min(1, (84 - activeCountry.lat) / 146));
      const flatCentroidY = flatTop + flatNormLat * flatH;

      const cx = flatCentroidX + (globeCentroidX - flatCentroidX) * m;
      const cy = flatCentroidY + (globeCentroidY - flatCentroidY) * m;

      const isCentroidVisible = m < 0.25 || targetZ > 0.05;

      if (isCentroidVisible) {
        selectedCentroidPx = {
          x: cx,
          y: cy,
          visible: true,
        };
      }
    }

    return {
      frontLandDots: frontLandStr,
      frontOceanDots: frontOceanStr,
      backDotsPath: backStr,
      highlightDotsPath: highlightStr,
      beaconCenter: selectedCentroidPx,
    };
  }, [
    rotationState,
    flatPan,
    morphProgress,
    appearProgress,
    activeCode,
    activeCountry,
    center.x,
    center.y,
    radius,
    size,
    canvasHeight,
  ]);

  // Core sphere body opacity fades in as dots arrive and fades out in flat mode
  const sphereBodyOpacity = Math.max(0, Math.min(1, (appearProgress - 0.35) / 0.65)) * morphProgress;
  const atmosphereOpacity = Math.max(0, Math.min(1, (appearProgress - 0.5) / 0.5)) * morphProgress;

  // Flat map card frame dimensions
  const flatCardW = size * 0.96;
  const flatCardH = canvasHeight * 0.90;
  const flatCardX = (size - flatCardW) / 2;
  const flatCardY = (canvasHeight - flatCardH) / 2;

  return (
    <View style={styles.container}>
      {/* Interactive SVG Canvas with adaptive height */}
      <View style={[styles.canvasWrapper, { width: size, height: canvasHeight }]}>
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <Svg width={size} height={canvasHeight}>
            <Defs>
              {/* Outer Cosmic Nebula Corona Glow */}
              <RadialGradient id="outerNebulaAura" cx="50%" cy="50%" r="50%">
                <Stop offset="52%" stopColor={currentAtmosphereColor} stopOpacity="0.25" />
                <Stop offset="76%" stopColor={currentAtmosphereColor} stopOpacity="0.08" />
                <Stop offset="100%" stopColor={currentAtmosphereColor} stopOpacity="0" />
              </RadialGradient>

              {/* 3D Spherical Specular & Void Shadow */}
              <RadialGradient id="globeCoreGlow" cx="34%" cy="28%" r="72%">
                <Stop offset="0%" stopColor={activeCoreTheme.coreStart} stopOpacity="0.95" />
                <Stop offset="62%" stopColor={activeCoreTheme.coreMid} stopOpacity="0.88" />
                <Stop offset="100%" stopColor={activeCoreTheme.coreEnd} stopOpacity="0.98" />
              </RadialGradient>

              {/* Atmospheric Rim Lighting Glow */}
              <RadialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="76%" stopColor={currentAtmosphereColor} stopOpacity="0" />
                <Stop offset="90%" stopColor={currentAtmosphereColor} stopOpacity="0.22" />
                <Stop offset="98%" stopColor={currentAtmosphereColor} stopOpacity="0.65" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
              </RadialGradient>

              {/* Hardware-accelerated Card Frame Clipping Mask for Flat Map Mode */}
              <ClipPath id="flatCardClip">
                <Rect
                  x={flatCardX}
                  y={flatCardY}
                  width={flatCardW}
                  height={flatCardH}
                  rx={18}
                />
              </ClipPath>
            </Defs>

            {/* Flat Map Outer Card Matrix Frame (fades out in globe mode) */}
            {morphProgress < 0.99 && (
              <Rect
                x={flatCardX}
                y={flatCardY}
                width={flatCardW}
                height={flatCardH}
                rx={18}
                fill="rgba(15, 23, 42, 0.5)"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
                opacity={1 - morphProgress}
              />
            )}

            {/* Layer 0: Cosmic Nebula Corona Bloom */}
            {showAtmosphere && atmosphereOpacity > 0.01 && (
              <Circle
                cx={center.x}
                cy={center.y}
                r={radius * 1.28}
                fill="url(#outerNebulaAura)"
                pointerEvents="none"
                opacity={atmosphereOpacity}
              />
            )}

            {/* Celestial Sphere Body: Fades in as dots assemble & in globe mode */}
            {sphereBodyOpacity > 0.01 && (
              <Circle
                cx={center.x}
                cy={center.y}
                r={radius}
                fill="url(#globeCoreGlow)"
                stroke={activeCoreTheme.rimColor}
                strokeWidth={1}
                opacity={sphereBodyOpacity}
              />
            )}

            {/* Atmosphere Outer Ring Halo */}
            {showAtmosphere && atmosphereOpacity > 0.01 && (
              <Circle
                cx={center.x}
                cy={center.y}
                r={radius * 1.05}
                fill="url(#atmosphereGlow)"
                pointerEvents="none"
                opacity={atmosphereOpacity}
              />
            )}

            {/* Dots and Beacon Layers: Strictly bounded inside Card Frame in Flat Map mode */}
            <G clipPath={morphProgress < 0.99 ? 'url(#flatCardClip)' : undefined}>
              {/* Layer 1: Back-facing Ghost Dots (Holographic depth volume) */}
              {backDotsPath.length > 0 && (
                <Path d={backDotsPath} fill="rgba(71, 85, 105, 0.25)" />
              )}

              {/* Layer 2: Ocean / Celestial Sphere Dots */}
              {frontOceanDots.length > 0 && (
                <Path d={frontOceanDots} fill={currentOceanDotColor} />
              )}

              {/* Layer 3: Continent Landmass Star Dots */}
              {frontLandDots.length > 0 && (
                <Path d={frontLandDots} fill={currentDotColor} />
              )}

              {/* Layer 4: Highlighted Country Neon Star Dots */}
              {highlightDotsPath.length > 0 && (
                <Path
                  d={highlightDotsPath}
                  fill={currentAccentColor}
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth={0.6}
                />
              )}

              {/* Layer 5: Pulsing Radar Beacon on Active Country Centroid */}
              {beaconCenter && (
                <G>
                  {/* Outer Expanding Sonar Waves */}
                  <Circle
                    cx={beaconCenter.x}
                    cy={beaconCenter.y}
                    r={6 + pulsePhase * 18}
                    fill="none"
                    stroke={currentAccentColor}
                    strokeWidth={1.5}
                    strokeOpacity={1 - pulsePhase}
                  />
                  <Circle
                    cx={beaconCenter.x}
                    cy={beaconCenter.y}
                    r={3 + ((pulsePhase + 0.5) % 1) * 18}
                    fill="none"
                    stroke={currentAccentColor}
                    strokeWidth={1.2}
                    strokeOpacity={1 - ((pulsePhase + 0.5) % 1)}
                  />
                  {/* Center Core Pin */}
                  <Circle
                    cx={beaconCenter.x}
                    cy={beaconCenter.y}
                    r={4}
                    fill="#FFFFFF"
                    stroke={currentAccentColor}
                    strokeWidth={2}
                  />
                </G>
              )}
            </G>
          </Svg>
        </View>
      </View>

      {/* Sleek Low-Profile Customization Dock with Mode Switcher */}
      {showCustomizationControls && (
        <View style={styles.compactDock}>
          {/* Row 1: Mode Switcher [ 🌐 3D Globe | 🗺️ 2D Flat ] + Rebuild */}
          <View style={styles.dockRow}>
            {allowModeToggle ? (
              <View style={styles.modeToggleWrap}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.modeToggleBtn,
                    activeMode === 'globe' && {
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      borderColor: currentDotColor,
                    },
                  ]}
                  onPress={() => switchMode('globe')}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      activeMode === 'globe' && { color: currentDotColor, fontWeight: '800' },
                    ]}
                  >
                    🌐 3D Globe
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.modeToggleBtn,
                    activeMode === 'flat' && {
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      borderColor: currentDotColor,
                    },
                  ]}
                  onPress={() => switchMode('flat')}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      activeMode === 'flat' && { color: currentDotColor, fontWeight: '800' },
                    ]}
                  >
                    🗺️ 2D Flat
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.dockLabel}>
                {activeMode === 'globe' ? 'GLOBE' : 'FLAT'}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.dockBtn, { borderColor: currentDotColor }]}
              activeOpacity={0.8}
              onPress={playAppearAnimation}
            >
              <Text style={[styles.dockBtnText, { color: currentDotColor }]}>✨ Rebuild</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Star Dots Color Swatches + Motion Controls */}
          <View style={styles.dockRow}>
            <Text style={styles.dockLabel}>STARS</Text>
            <View style={styles.dockSwatches}>
              {DOT_THEMES.map((theme) => {
                const isSelected = selectedDotTheme === theme.id;
                return (
                  <TouchableOpacity
                    key={theme.id}
                    onPress={() => setSelectedDotTheme(theme.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    style={[
                      styles.dockSwatchWrap,
                      isSelected && {
                        borderColor: theme.dotColor,
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        shadowColor: theme.dotColor,
                        shadowOpacity: 0.8,
                        shadowRadius: 6,
                      },
                    ]}
                  >
                    <View style={[styles.dockSwatchDot, { backgroundColor: theme.dotColor }]} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Spin & Speed Controls */}
            <View style={styles.dockActionGroup}>
              <TouchableOpacity
                style={[
                  styles.dockMiniBtn,
                  isAutoRotating &&
                    activeMode === 'globe' && {
                      borderColor: currentDotColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (activeMode === 'flat') {
                    switchMode('globe');
                    setIsAutoRotating(true);
                  } else {
                    setIsAutoRotating((prev) => !prev);
                  }
                }}
              >
                <Text
                  style={[
                    styles.dockMiniBtnText,
                    isAutoRotating && activeMode === 'globe' && { color: currentDotColor },
                  ]}
                >
                  {isAutoRotating && activeMode === 'globe' ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              {activeMode === 'globe' && (
                <TouchableOpacity
                  style={styles.dockMiniBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    const speeds = [0.2, 0.35, 0.7];
                    const idx = speeds.indexOf(currentSpeed);
                    const nextSpeed = speeds[(idx + 1) % speeds.length];
                    setCurrentSpeed(nextSpeed);
                  }}
                >
                  <Text style={styles.dockMiniBtnText}>
                    {currentSpeed === 0.2 ? '0.5x' : currentSpeed === 0.7 ? '2x' : '1x'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Featured Country Destination Quick-Select Horizontal Carousel */}
      <View style={styles.countryPickerWrap}>
        <View style={styles.pickerHeaderRow}>
          <Text style={styles.pickerSectionTitle}>EXPLORE DESTINATIONS</Text>
          <Text style={styles.pickerSubtitle}>Tap to fly & lock</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.countryScrollRow}
        >
          {FEATURED_COUNTRIES.map((country) => {
            const isSelected = activeCode === country.code;
            return (
              <TouchableOpacity
                key={country.code}
                activeOpacity={0.8}
                style={[
                  styles.countryPill,
                  isSelected && {
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    borderColor: currentDotColor,
                    shadowColor: currentDotColor,
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                  },
                ]}
                onPress={() => handleCountryPress(country)}
              >
                <Text style={styles.pillFlag}>{country.flag}</Text>
                <Text
                  style={[
                    styles.pillText,
                    isSelected && { color: currentDotColor, fontWeight: '800' },
                  ]}
                >
                  {country.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  canvasWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactDock: {
    marginTop: 22,
    width: '92%',
    maxWidth: 380,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    gap: 6,
  },
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 28,
  },
  modeToggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 3,
  },
  modeToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  dockLabel: {
    color: '#64748B',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    width: 44,
  },
  dockSwatches: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dockSwatchWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dockSwatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dockBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  dockActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dockMiniBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  dockMiniBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  countryPickerWrap: {
    marginTop: 10,
    width: '100%',
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  pickerSectionTitle: {
    color: '#64748B',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  pickerSubtitle: {
    color: '#475569',
    fontSize: 9.5,
    fontWeight: '600',
  },
  countryScrollRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  pillFlag: {
    fontSize: 13,
  },
  pillText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '600',
  },
});

export { StarsGlobe as StarsWorld };
export default StarsGlobe;
