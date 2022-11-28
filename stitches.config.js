import { createStitches } from '@stitches/react';

export const { styled, getCssText } = createStitches({
  theme: {
    colors: {
      // ACCENT
      primary1: '#FFFBCC',
      primary2: '#FFF599',
      primary3: '#FFEE66',
      primary4: '#FFE840',
      primary5: '#FFDD01',
      primary6: '#DBBA00',
      primary7: '#B79900',
      primary8: '#937900',
      primary9: '#7A6300',

      // GRAYS
      gray0: '#ffffff',
      gray1: '#fdfcfd',
      gray2: '#f9f8f9',
      gray3: '#f4f2f4',
      gray4: '#eeedef',
      gray5: '#e9e8ea',
      gray6: '#e4e2e4',
      gray7: '#dcdbdd',
      gray8: '#c8c7cb',
      gray9: '#908e96',
      gray10: '#86848d',
      gray11: '#6f6e77',
      gray12: '#1a1523',

      // STATUS-SUCCESS
      success1: '#C9FCCA',
      success2: '#95F9A1',
      success3: '#5FEE7E',
      success4: '#37DE6C',
      success5: '#00c853',
      success6: '#00AC58',
      success7: '#009058',
      success8: '#007452',
      success9: '#00604E',

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
      danger1: '#FDE4CB',
      danger2: '#FCC397',
      danger3: '#F79863',
      danger4: '#F0703C',
      danger5: '#E63200',
      danger6: '#C51C00',
      danger7: '#A50B00',
      danger8: '#850000',
      danger9: '#6E0008',

      // STATUS-INFO
      info1: '#CAFDFB',
      info2: '#96F7FB',
      info3: '#61E5F4',
      info4: '#3ACBEA',
      info5: '#00A6DD',
      info6: '#0081BE',
      info7: '#00609F',
      info8: '#004580',
      info9: '#00316A',
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
