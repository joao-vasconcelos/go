import { useEffect } from 'react';
import { styled } from '../stitches.config';
import Loading from './Loading';

/* * */
/* TABLE */
/* Explanation needed. */
/* * */

const Container = styled('div', {
  width: '100%',
  // boxShadow: '$md',
  borderRadius: '$md',
  overflow: 'hidden',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray5',
});

const Row = styled('div', {
  display: 'grid',
  justifyItems: 'stretch',
  alignItems: 'stretch',
  gap: '$md',
  padding: '$md',
});

const HeaderRow = styled(Row, {
  padding: '$sm $md',
  position: 'relative',
  backgroundColor: '$gray2',
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray5',
  fontWeight: '$bold',
  fontSize: '13px',
  color: '$gray11',
  textTransform: 'uppercase',
});

const BodyRow = styled(Row, {
  borderBottomWidth: '$md',
  borderBottomStyle: 'solid',
  borderBottomColor: '$gray5',
  cursor: 'pointer',
  '&:last-child': {
    borderBottomWidth: '0',
  },
  '&:hover': {
    color: '$primary5',
    backgroundColor: '$gray2',
  },
});

const Body = styled('div', {
  width: '100%',
});

const Cell = styled('div', {
  color: 'inherit',
  // backgroundColor: 'yellow',
});

const NoData = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '$medium',
  fontSize: '20px',
  textTransform: 'uppercase',
  color: '$gray4',
});

export default function Table(props) {
  //

  const colsLength = 'repeat(' + props.columns.length + ', 1fr)';

  // function searchArray(e) {
  //   let filtered = [];
  //   const input = e.target.value.toLowerCase();
  //   if (input) {
  //     filtered = data.filter((el) => {
  //       return Object.values(el).some((val) =>
  //         String(val).toLowerCase().includes(input)
  //       );
  //     });

  //     log.textContent = JSON.stringify(filtered);
  //   }
  // }

  return props.data ? (
    <Container>
      <HeaderRow css={{ gridTemplateColumns: colsLength }}>
        {props.columns.map((col, index) => (
          <Cell key={index}>{col.label}</Cell>
        ))}
      </HeaderRow>
      <Body>
        {props.data?.length ? (
          props.data.map((row, index) => (
            <BodyRow key={index} css={{ gridTemplateColumns: colsLength }} onClick={() => props.onRowClick(row)}>
              {props.columns.map((col, index) => (
                <Cell key={index}>{row[col.key] || '-'}</Cell>
              ))}
            </BodyRow>
          ))
        ) : (
          <NoData>Nenhum dado disponível</NoData>
        )}
      </Body>
    </Container>
  ) : (
    <Loading />
  );
}
