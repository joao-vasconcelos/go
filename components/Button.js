import { styled } from '../stitches.config';

const Container = styled('div', {
  //
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$sm',
  //
  // width: '100%',
  padding: '$xs $md',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '$md',
  //
  fontSize: '15px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  //
  transition: '$default',
  cursor: 'pointer',
  //
  variants: {
    color: {
      primary: {
        color: '$gray0',
        backgroundColor: '$primary5',
        borderColor: '$primary6',
        '&:hover': {
          backgroundColor: '$primary6',
          borderColor: '$primary8',
        },
        '&:active': {
          color: '$primary9',
          backgroundColor: '$primary6',
          borderColor: '$primary9',
          boxShadow: '$sm',
        },
      },
      secondary: {
        color: '$gray11',
        backgroundColor: '$gray3',
        borderColor: '$gray7',
        '&:hover': {
          backgroundColor: '$gray6',
          borderColor: '$gray8',
        },
        '&:active': {
          color: '$gray12',
          backgroundColor: '$gray8',
          borderColor: '$gray9',
          boxShadow: '$sm',
        },
      },
      success: {
        color: '$gray0',
        backgroundColor: '$success5',
        borderColor: '$success6',
        '&:hover': {
          backgroundColor: '$success6',
          borderColor: '$success8',
        },
        '&:active': {
          color: '$success9',
          backgroundColor: '$success6',
          borderColor: '$success9',
          boxShadow: '$sm',
        },
      },
      warning: {
        color: '$gray0',
        backgroundColor: '$warning5',
        borderColor: '$warning6',
        '&:active': {
          color: '$warning9',
          backgroundColor: '$warning6',
          borderColor: '$warning9',
          boxShadow: '$sm',
        },
      },
      danger: {
        color: '$gray0',
        backgroundColor: '$danger5',
        borderColor: '$danger6',
        '&:hover': {
          backgroundColor: '$danger6',
          borderColor: '$danger7',
        },
        '&:active': {
          color: '$primary10',
          backgroundColor: '$danger7',
          borderColor: '$danger9',
          boxShadow: '$sm',
        },
      },
    },
  },
  //
  '&[disabled]': {
    cursor: 'not-allowed',
    color: '$gray6',
    backgroundColor: '$gray2',
    borderColor: '$gray4',
    boxShadow: 'none',
    '&:active': {
      color: '$gray6',
      backgroundColor: '$gray2',
      borderColor: '$gray4',
      boxShadow: 'none',
    },
  },
  //
  defaultVariants: {
    color: 'secondary',
  },
});

const IconWrapper = styled('div', {
  display: 'flex',
  fontSize: '17px',
});

const LabelWrapper = styled('div', {});

export default function Button({ icon, label, children, onClick, type, alert, ...props }) {
  //

  return (
    <Container as={type == 'submit' ? 'button' : 'div'} onClick={onClick} {...props}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {label && <LabelWrapper>{label}</LabelWrapper>}
      {children && <LabelWrapper>{children}</LabelWrapper>}
    </Container>
  );
}
