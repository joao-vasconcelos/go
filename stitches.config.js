import { createStitches } from '@stitches/react';

export const { styled, getCssText } = createStitches({
  theme: {
    colors: {
      // ACCENT
      primary1: '#FFFFC8',
      primary2: '#FFFF8C',
      primary3: '#FFF050',
      primary4: '#FFE632',
      primary5: '#FFDD00',
      primary6: '#FFCD00',
      primary7: '#FFB900',
      primary8: '#F5A000',
      primary9: '#E68C00',

      // GRAYS
      gray0: '#ffffff',
      gray1: '#F8F9FA',
      gray2: '#F1F3F5',
      gray3: '#E9ECEF',
      gray4: '#DEE2E6',
      gray5: '#CED4DA',
      gray6: '#ADB5BD',
      gray7: '#868E96',
      gray8: '#495057',
      gray9: '#343A40',
      gray10: '#212529',
      gray11: '#6f6e77',
      gray12: '#1a1523',

      // STATUS-SUCCESS
      success0: '#EBFBEE',
      success1: '#D3F9D8',
      success2: '#B2F2BB',
      success3: '#8CE99A',
      success4: '#69DB7C',
      success5: '#51CF66',
      success6: '#40C057',
      success7: '#37B24D',
      success8: '#2F9E44',
      success9: '#2B8A3E',

      // STATUS-WARNING
      warning1: '#FFF8CC',
      warning2: '#FFEF99',
      warning3: '#FFE466',
      warning4: '#FFDA3F',
      warning5: '#FFC800',
      warning6: '#DBA700',
      warning7: '#B78700',
      warning8: '#936A00',
      warning9: '#7A5500',

      // STATUS-DANGER
      danger0: '#FFF5F5',
      danger1: '#FFE3E3',
      danger2: '#FFC9C9',
      danger3: '#FFA8A8',
      danger4: '#FF8787',
      danger5: '#FF6B6B',
      danger6: '#FA5252',
      danger7: '#F03E3E',
      danger8: '#E03131',
      danger9: '#C92A2A',

      // STATUS-INFO
      info1: '#E7F5FF',
      info2: '#D0EBFF',
      info3: '#79CAF7',
      info4: '#57B0F0',
      info5: '#228BE6',
      info6: '#196CC5',
      info7: '#1150A5',
      info8: '#0B3885',
      info9: '#06286E',
    },
    space: {
      xs: '5px',
      sm: '10px',
      md: '15px',
      lg: '25px',
    },
    fonts: {
      system: 'system-ui',
    },
    fontSizes: {
      sm: '12px',
      md: '14px',
      lg: '18px',
    },
    fontWeights: {
      regular: 500,
      medium: 600,
      bold: 700,
    },
    radii: {
      sm: '3px',
      md: '5px',
      lg: '15px',
      pill: '9999px',
    },
    borderWidths: {
      sm: '1px',
      md: '2px',
    },
    shadows: {
      xs: '0 0 10px 0 rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 0 5px 0 rgba(0, 0, 0, 0.1)',
      lg: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
      xl: '0 0 30px 0 rgba(0, 0, 0, 0.2)',
    },
    aspectRatio: {
      square: '1/1',
    },
    transitions: {
      default: 'all 100ms ease',
    },
  },
});
