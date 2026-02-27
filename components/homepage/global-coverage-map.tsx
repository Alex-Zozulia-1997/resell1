'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe2, TrendingUp, X } from 'lucide-react';

// Topography data URL (world map)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Dummy dataset: Country ISO codes with IP counts
const countryIpData: Record<string, number> = {
  US: 9776304,
  RU: 3779498,
  NG: 1588914,
  DE: 7028342,
  BR: 771588,
  ID: 422811,
  UA: 966372,
  CA: 195210,
  IN: 1187632,
  PH: 175815,
  GB: 162720,
  NL: 135981,
  PL: 127161,
  FR: 83385,
  VN: 83304,
  MX: 82908,
  PK: 72810,
  TR: 66015,
  JP: 49626,
  KR: 49041,
  ES: 47160,
  KZ: 45387,
  TH: 42624,
  IT: 40869,
  CL: 40680,
  AU: 40392,
  SG: 39735,
  EC: 36630,
  PE: 35217,
  MY: 34848,
  AR: 34641,
  CO: 31239,
  SA: 30753,
  AZ: 30411,
  AE: 28089,
  BY: 27702,
  HK: 26649,
  MA: 23652,
  DZ: 23436,
  TW: 21996,
  UZ: 20979,
  CH: 20943,
  VE: 20646,
  ZA: 20520,
  SE: 20367,
  BG: 20331,
  IE: 20295,
  IQ: 19782,
  FI: 19314,
  DO: 19260,
  EG: 19152,
  PT: 19008,
  KG: 18828,
  BE: 18675,
  BO: 18405,
  RO: 18396,
  IL: 17928,
  BD: 17577,
  CZ: 17046,
  LT: 16992,
  CN: 16695,
  LV: 15984,
  AT: 15777,
  NP: 15543,
  NZ: 15408,
  NO: 15246,
  AM: 14400,
  GT: 14382,
  MD: 13608,
  BH: 13608,
  JO: 13428,
  GR: 13401,
  HR: 13230,
  SV: 13131,
  CR: 13131,
  KW: 13104,
  EE: 13095,
  PA: 12681,
  HU: 12537,
  AL: 12501,
  KE: 12294,
  SK: 12195,
  UY: 12114,
  RS: 12078,
  GE: 12069,
  PY: 11808,
  TN: 11808,
  KH: 11583,
  CI: 11349,
  OM: 11169,
  DK: 11097,
  SN: 10971,
  CY: 7290,
  MM: 6588,
  HN: 4068,
  QA: 2340,
  NI: 1629,
  MU: 1557,
  LB: 1422,
  PR: 1386,
  TT: 1188,
  JM: 1152,
  LK: 1044,
  GA: 1026,
  SY: 981,
  PS: 918,
  SI: 801,
  LI: 792,
  BA: 783,
  LY: 747,
  BB: 711,
  AO: 657,
  XK: 657,
  MK: 639,
  TJ: 603,
  GH: 576,
  CG: 567,
  MT: 558,
  LU: 531,
  BN: 441,
  ME: 432,
  MV: 414,
  MZ: 405,
  ET: 369,
  SO: 360,
  BS: 360,
  IS: 351,
  TZ: 351,
  RW: 342,
  IR: 324,
  TG: 324,
  BZ: 315,
  RE: 297,
  ZW: 279,
  FJ: 261,
  GY: 261,
  MN: 261,
  UG: 252,
  LA: 252,
  BW: 234,
  BF: 234,
  CD: 216,
  ML: 216,
  AD: 198,
  MO: 189,
  YE: 189,
  AF: 180,
  GP: 153,
  NA: 138,
  CM: 135,
  BJ: 126,
  CV: 117,
  SR: 110,
  KN: 99,
  MQ: 81,
  BM: 81,
  MG: 81,
  SC: 81,
  GD: 72,
  CW: 72,
  GF: 63,
  MF: 63,
  VC: 63,
  ZM: 54,
  LC: 54,
  SL: 54,
  BT: 59,
  MW: 45,
  KY: 46,
  GU: 45,
  AG: 45,
  NE: 46,
  MP: 36,
  VG: 36,
  MR: 46,
  HT: 34,
  IM: 27,
  MC: 23,
  JE: 27,
  SD: 23,
  TM: 27,
  DM: 12,
  TL: 29,
  WS: 34,
  VU: 45,
  CU: 55,
  PF: 5,
  GL: 23,
  LR: 18,
  FO: 19,
  BI: 19,
  AW: 19,
  BQ: 26,
  DJ: 68,
  VI: 69,
  TC: 46,
  GI: 99,
  PG: 23,
  GM: 24,
};

// City counts per country
const countryCityData: Record<string, number> = {
  AF: 2, AL: 31, DZ: 89, AD: 1, AO: 3, AG: 1, AR: 503, AM: 16, AW: 0, AU: 69,
  AT: 59, AZ: 26, BS: 3, BH: 5, BD: 95, BB: 4, BY: 26, BE: 136, BZ: 6, BJ: 1,
  BM: 3, BT: 1, BO: 18, BA: 18, BW: 1, BR: 2186, BN: 2, BG: 63, BF: 2, BI: 1,
  KH: 12, CM: 2, CA: 434, CV: 3, KY: 1, TD: 1, CL: 179, CN: 78, CO: 316, CR: 25,
  HR: 24, CU: 3, CW: 1, CY: 9, CZ: 100, CD: 5, DK: 52, DJ: 1, DM: 1, DO: 48,
  TL: 2, EC: 157, EG: 53, SV: 20, EE: 20, ET: 1, FO: 1, FJ: 3, FI: 35, FR: 1173,
  GF: 2, PF: 1, GA: 2, GE: 11, DE: 627, GH: 2, GI: 0, GR: 49, GL: 1, GD: 1,
  GP: 9, GU: 4, GT: 58, GN: 1, GW: 1, GY: 3, HT: 2, HN: 50, HK: 91, HU: 76,
  IS: 4, IN: 442, ID: 711, IR: 9, IQ: 32, IE: 66, IM: 2, IL: 53, IT: 440, CI: 2,
  JM: 13, JP: 471, JE: 1, JO: 14, KZ: 55, KE: 16, XK: 21, KW: 4, KG: 3, LA: 5,
  LV: 13, LB: 11, LY: 6, LI: 2, LT: 13, LU: 5, MO: 2, MG: 5, MW: 2, MY: 117,
  MV: 3, ML: 2, MT: 16, MQ: 3, MR: 1, MU: 14, YT: 1, MX: 735, MD: 26, MC: 1,
  MN: 3, ME: 3, MA: 54, MZ: 1, MM: 40, NA: 1, NP: 35, NL: 222, NC: 1, NZ: 28,
  NI: 3, NE: 1, NG: 63, MK: 19, NO: 89, OM: 4, PK: 112, PS: 16, PA: 13, PY: 35,
  PE: 294, PH: 326, PL: 356, PT: 198, PR: 69, QA: 1, CG: 3, RE: 11, RO: 96,
  RU: 937, RW: 1, KN: 2, LC: 1, MF: 0, VC: 1, SA: 29, SN: 2, RS: 33, SC: 1,
  SG: 5, SK: 70, SI: 18, SO: 4, ZA: 76, KR: 213, ES: 704, LK: 10, SD: 1, SR: 1,
  SE: 145, CH: 95, SY: 10, TW: 60, TJ: 3, TZ: 4, TH: 214, TG: 3, TT: 12, TN: 31,
  TR: 280, TM: 1, TV: 1, VI: 2, UG: 1, UA: 312, AE: 19, GB: 647, US: 3399,
  UY: 21, UZ: 21, VU: 1, VE: 102, VN: 274, YE: 2, ZM: 3, ZW: 1,
};

// Country name to ISO code mapping (2-letter codes)
const countryNameToCode: Record<string, string> = {
  'united states of america': 'US',
  'united states': 'US',
  china: 'CN',
  'united kingdom': 'GB',
  'england': 'GB',
  'scotland': 'GB',
  'wales': 'GB',
  'northern ireland': 'GB',
  germany: 'DE',
  france: 'FR',
  japan: 'JP',
  canada: 'CA',
  australia: 'AU',
  brazil: 'BR',
  india: 'IN',
  spain: 'ES',
  italy: 'IT',
  netherlands: 'NL',
  'south korea': 'KR',
  'korea, republic of': 'KR',
  mexico: 'MX',
  poland: 'PL',
  turkey: 'TR',
  sweden: 'SE',
  belgium: 'BE',
  switzerland: 'CH',
  austria: 'AT',
  norway: 'NO',
  denmark: 'DK',
  finland: 'FI',
  singapore: 'SG',
  'new zealand': 'NZ',
  ireland: 'IE',
  portugal: 'PT',
  czechia: 'CZ',
  'czech republic': 'CZ',
  romania: 'RO',
  greece: 'GR',
  hungary: 'HU',
  'united arab emirates': 'AE',
  thailand: 'TH',
  malaysia: 'MY',
  'south africa': 'ZA',
  argentina: 'AR',
  chile: 'CL',
  colombia: 'CO',
  peru: 'PE',
  vietnam: 'VN',
  philippines: 'PH',
  indonesia: 'ID',
  ukraine: 'UA',
  'saudi arabia': 'SA',
  egypt: 'EG',
  israel: 'IL',
  'hong kong': 'HK',
  russia: 'RU',
  'russian federation': 'RU',
  nigeria: 'NG',
  pakistan: 'PK',
  kazakhstan: 'KZ',
  ecuador: 'EC',
  azerbaijan: 'AZ',
  belarus: 'BY',
  morocco: 'MA',
  algeria: 'DZ',
  taiwan: 'TW',
  uzbekistan: 'UZ',
  venezuela: 'VE',
  bulgaria: 'BG',
  iraq: 'IQ',
  'dominican republic': 'DO',
  kyrgyzstan: 'KG',
  bolivia: 'BO',
  bangladesh: 'BD',
  lithuania: 'LT',
  latvia: 'LV',
  nepal: 'NP',
  armenia: 'AM',
  guatemala: 'GT',
  moldova: 'MD',
  bahrain: 'BH',
  jordan: 'JO',
  croatia: 'HR',
  'el salvador': 'SV',
  'costa rica': 'CR',
  kuwait: 'KW',
  estonia: 'EE',
  panama: 'PA',
  albania: 'AL',
  kenya: 'KE',
  slovakia: 'SK',
  uruguay: 'UY',
  serbia: 'RS',
  georgia: 'GE',
  paraguay: 'PY',
  tunisia: 'TN',
  cambodia: 'KH',
  'côte d\'ivoire': 'CI',
  'ivory coast': 'CI',
  oman: 'OM',
  senegal: 'SN',
  cyprus: 'CY',
  'myanmar': 'MM',
  'burma': 'MM',
  honduras: 'HN',
  qatar: 'QA',
  nicaragua: 'NI',
  mauritius: 'MU',
  lebanon: 'LB',
  'puerto rico': 'PR',
  'trinidad and tobago': 'TT',
  jamaica: 'JM',
  'sri lanka': 'LK',
  gabon: 'GA',
  syria: 'SY',
  palestine: 'PS',
  slovenia: 'SI',
  liechtenstein: 'LI',
  'bosnia and herzegovina': 'BA',
  libya: 'LY',
  barbados: 'BB',
  angola: 'AO',
  kosovo: 'XK',
  'north macedonia': 'MK',
  macedonia: 'MK',
  tajikistan: 'TJ',
  ghana: 'GH',
  'congo': 'CG',
  'republic of the congo': 'CG',
  malta: 'MT',
  luxembourg: 'LU',
  brunei: 'BN',
  montenegro: 'ME',
  maldives: 'MV',
  mozambique: 'MZ',
  ethiopia: 'ET',
  somalia: 'SO',
  bahamas: 'BS',
  iceland: 'IS',
  tanzania: 'TZ',
  rwanda: 'RW',
  iran: 'IR',
  togo: 'TG',
  belize: 'BZ',
  'réunion': 'RE',
  zimbabwe: 'ZW',
  fiji: 'FJ',
  guyana: 'GY',
  mongolia: 'MN',
  uganda: 'UG',
  laos: 'LA',
  botswana: 'BW',
  'burkina faso': 'BF',
  'democratic republic of the congo': 'CD',
  'dr congo': 'CD',
  mali: 'ML',
  andorra: 'AD',
  'macao': 'MO',
  'macau': 'MO',
  yemen: 'YE',
  afghanistan: 'AF',
  guadeloupe: 'GP',
  namibia: 'NA',
  cameroon: 'CM',
  benin: 'BJ',
  'cape verde': 'CV',
  suriname: 'SR',
  'saint kitts and nevis': 'KN',
  martinique: 'MQ',
  bermuda: 'BM',
  madagascar: 'MG',
  seychelles: 'SC',
  grenada: 'GD',
  'curaçao': 'CW',
  'french guiana': 'GF',
  'saint martin': 'MF',
  'saint vincent and the grenadines': 'VC',
  zambia: 'ZM',
  'saint lucia': 'LC',
  'sierra leone': 'SL',
  bhutan: 'BT',
  malawi: 'MW',
  'cayman islands': 'KY',
  guam: 'GU',
  'antigua and barbuda': 'AG',
  niger: 'NE',
  'northern mariana islands': 'MP',
  'british virgin islands': 'VG',
  mauritania: 'MR',
  haiti: 'HT',
  'isle of man': 'IM',
  monaco: 'MC',
  jersey: 'JE',
  sudan: 'SD',
  turkmenistan: 'TM',
  dominica: 'DM',
  'timor-leste': 'TL',
  'east timor': 'TL',
  samoa: 'WS',
  vanuatu: 'VU',
  cuba: 'CU',
  'french polynesia': 'PF',
  greenland: 'GL',
  liberia: 'LR',
  'faroe islands': 'FO',
  burundi: 'BI',
  aruba: 'AW',
  'caribbean netherlands': 'BQ',
  djibouti: 'DJ',
  'u.s. virgin islands': 'VI',
  'turks and caicos islands': 'TC',
  gibraltar: 'GI',
  'papua new guinea': 'PG',
  gambia: 'GM',
};

// Get set of countries with data
const countryCodesWithData = new Set(Object.keys(countryIpData));

// Color scale for IP counts
const maxIps = Math.max(...Object.values(countryIpData));
const colorScale = scaleLinear<number>()
  .domain([0, maxIps])
  .range([0, 1]);

// Navy blue color interpolation
const navyBlueInterpolate = interpolate('#90caf9', '#0d47a1');

// Format IP count for display
const formatIpCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
};

export default function GlobalCoverageMap() {
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    iso: string;
    ipCount: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    iso: string;
    ipCount: number;
  } | null>({
    name: 'United States',
    iso: 'US',
    ipCount: countryIpData.US,
  });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Country ISO to flag mapping (using emoji flags)
  const countryIsoToFlag: Record<string, string> = {
    US: '🇺🇸', CN: '🇨🇳', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', IN: '🇮🇳', BR: '🇧🇷', 
    CA: '🇨🇦', KR: '🇰🇷', VN: '🇻🇳', UA: '🇺🇦', RU: '🇷🇺', NG: '🇳🇬', ID: '🇮🇩', PH: '🇵🇭', 
    NL: '🇳🇱', PL: '🇵🇱', MX: '🇲🇽', PK: '🇵🇰', TR: '🇹🇷', ES: '🇪🇸', KZ: '🇰🇿', TH: '🇹🇭', 
    IT: '🇮🇹', CL: '🇨🇱', AU: '🇦🇺', SG: '🇸🇬', EC: '🇪🇨', PE: '🇵🇪', MY: '🇲🇾', AR: '🇦🇷', 
    CO: '🇨🇴', SA: '🇸🇦', AZ: '🇦🇿', AE: '🇦🇪', BY: '🇧🇾', HK: '🇭🇰', MA: '🇲🇦', DZ: '🇩🇿', 
    TW: '🇹🇼', UZ: '🇺🇿', CH: '🇨🇭', VE: '🇻🇪', ZA: '🇿🇦', SE: '🇸🇪', BG: '🇧🇬', IE: '🇮🇪', 
    IQ: '🇮🇶', FI: '🇫🇮', DO: '🇩🇴', EG: '🇪🇬', PT: '🇵🇹', KG: '🇰🇬', BE: '🇧🇪', BO: '🇧🇴', 
    RO: '🇷🇴', IL: '🇮🇱', BD: '🇧🇩', CZ: '🇨🇿', LT: '🇱🇹', LV: '🇱🇻', AT: '🇦🇹', NP: '🇳🇵', 
    NZ: '🇳🇿', NO: '🇳🇴', AM: '🇦🇲', GT: '🇬🇹', MD: '🇲🇩', BH: '🇧🇭', JO: '🇯🇴', GR: '🇬🇷', 
    HR: '🇭🇷', SV: '🇸🇻', CR: '🇨🇷', KW: '🇰🇼', EE: '🇪🇪', PA: '🇵🇦', HU: '🇭🇺', AL: '🇦🇱', 
    KE: '🇰🇪', SK: '🇸🇰', UY: '🇺🇾', RS: '🇷🇸', GE: '🇬🇪', PY: '🇵🇾', TN: '🇹🇳', KH: '🇰🇭', 
    CI: '🇨🇮', OM: '🇴🇲', DK: '🇩🇰', SN: '🇸🇳',
  };

  // Function to get flag or fallback
  const getFlagForCountry = (iso: string) => {
    return countryIsoToFlag[iso] || null;
  };

  // Get top 10 countries by IP count
  const topCountries = Object.entries(countryIpData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([iso, ipCount]) => {
      const countryName = Object.entries(countryNameToCode).find(
        ([, code]) => code === iso
      )?.[0];
      return {
        iso,
        name: countryName
          ?.split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') || iso,
        ipCount,
      };
    });

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const name = geo.properties.name;
    const iso = countryNameToCode[name.toLowerCase()];
    if (iso && countryIpData[iso] && !selectedCountry) {
      setHoveredCountry({ name, iso, ipCount: countryIpData[iso] });
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredCountry) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  const handleCountryClick = (geo: any) => {
    const name = geo.properties.name;
    const iso = countryNameToCode[name.toLowerCase()];
    if (iso && countryIpData[iso]) {
      setSelectedCountry({ name, iso, ipCount: countryIpData[iso] });
    }
  };

  const handleCountrySelect = (country: { name: string; iso: string; ipCount: number }) => {
    setSelectedCountry(country);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
          Global Coverage
        </h2>
        <p className="text-gray-600 dark:text-gray-400 pt-1 max-w-2xl mx-auto">
          Access premium residential IPs from 195+ countries worldwide. Click on
          any country to explore detailed statistics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
        <Card className="p-4 text-center border-2 hover:border-blue-500 transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600">195+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Countries
          </div>
        </Card>
        <Card className="p-4 text-center border-2 hover:border-blue-500 transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600">16M+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Residential IPs
          </div>
        </Card>
        <Card className="p-4 text-center border-2 hover:border-blue-500 transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600">{Object.values(countryCityData).reduce((a, b) => a + b, 0).toLocaleString()}+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Cities
          </div>
        </Card>
        <Card className="p-4 text-center border-2 hover:border-blue-500 transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600">99.9%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Uptime
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="lg:col-span-2 p-6 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 200,
              }}
              width={800}
              height={550}
              style={{
                width: '100%',
                height: 'auto',
              }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name;
                    const iso = countryNameToCode[name.toLowerCase()];
                    const hasData = iso && countryCodesWithData.has(iso);
                    const ipCount = iso ? countryIpData[iso] : 0;
                    const isSelected =
                      selectedCountry?.iso === iso ||
                      selectedCountry?.name.toLowerCase() === name.toLowerCase();

                    const fill = (() => {
                      if (isSelected) return '#1878deff';
                      if (hasData) {
                        return navyBlueInterpolate(colorScale(ipCount));
                      }
                      return '#E5E7EB';
                    })();

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(event) => handleMouseEnter(geo, event)}
                        onClick={() => handleCountryClick(geo)}
                        style={{
                          default: {
                            fill: fill,
                            stroke: isSelected ? '#1F2937' : '#9CA3AF',
                            strokeWidth: isSelected ? 1.5 : 0.5,
                            outline: 'none',
                            transition: 'all 0.3s ease',
                          },
                          hover: {
                            fill: hasData ? '#1f3ed7ff' : '#E5E7EB',
                            stroke: '#1F2937',
                            strokeWidth: 1,
                            outline: 'none',
                            cursor: hasData ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: '#1f3ed7ff',
                            stroke: '#111827',
                            strokeWidth: 1,
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Tooltip */}
          {hoveredCountry && !selectedCountry && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: `${tooltipPosition.x + 10}px`,
                top: `${tooltipPosition.y + 10}px`,
              }}>
              <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700">
                <div className="font-semibold text-sm mb-1">
                  {hoveredCountry.name}
                </div>
                <div className="text-blue-400 text-lg font-bold">
                  {formatIpCount(hoveredCountry.ipCount)} IPs
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Click to view details
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Selected Country Details */}
          {selectedCountry ? (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold">
                      {selectedCountry.name}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCountry.iso}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedCountry(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Available IPs
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatIpCount(selectedCountry.ipCount)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Cities
                    </div>
                    <div className="text-lg font-bold">
                      {countryCityData[selectedCountry.iso] || 0}+
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      ASNs
                    </div>
                    <div className="text-lg font-bold">
                      {Math.floor(selectedCountry.ipCount / 50000)}+
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>99.9% uptime guaranteed</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Globe2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">No country selected</p>
                <p className="text-xs">
                  Click on a country or use search to view details
                </p>
              </div>
            </Card>
          )}

          {/* Top Countries List */}
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top Countries
            </h3>
            <div className="space-y-2">
              {topCountries.map((country, index) => (
                <button
                  key={country.iso}
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    {getFlagForCountry(country.iso) ? (
                      <div className="text-lg">
                        {getFlagForCountry(country.iso)!}
                      </div>
                    ) : (
                      <div className="w-5 h-4 rounded-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Globe2 className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{country.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {formatIpCount(country.ipCount)}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-8">
        <p className="text-gray-600 dark:text-gray-400">
          Need coverage in a specific region? Talk to us{' '}
          <span className="font-semibold text-blue-600">
          sales@ipden.io
          </span>{' '}
         
          
        </p>
      </div>
    </div>
  );
}
