import Link from 'next/link';
import { styled } from '@stitches/react';
import { useRouter } from 'next/router';

/* * */
/* NAVIGATION BUTTON */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'left',
  gap: '$sm',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  backgroundColor: '$gray3',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray6',
  borderRadius: '$md',
  color: '$gray11',
  padding: '$sm',
  fontSize: '14px',
  transition: '$default',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray4',
    borderColor: '$gray7',
  },
  '&:active': {
    color: '$gray12',
    backgroundColor: '$gray6',
    borderColor: '$gray8',
  },
  variants: {
    active: {
      true: {
        color: '$gray12',
        backgroundColor: '$primary5',
        borderColor: '$gray12',
        boxShadow: '$lg',
        '&:hover': {
          color: '$gray12',
          backgroundColor: '$primary5',
          borderColor: '$gray12',
        },
      },
    },
  },
  '&[disabled]': {
    cursor: 'not-allowed',
    pointerEvents: 'none',
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
});

const IconWrapper = styled('div', {
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function NavigationButton({ icon, label, disabled, destination }) {
  //

  const router = useRouter();

  // Is current button selected

  let isActive;
  if (destination == '/' && router.asPath == '/') {
    isActive = true;
  } else if (router.asPath != '/' && destination != '/') {
    isActive = router.asPath.includes(destination);
  }

  return (
    <Link href={destination}>
      <Container active={isActive} disabled={disabled}>
        <IconWrapper>{icon}</IconWrapper>
        {label}
      </Container>
    </Link>
  );
}
