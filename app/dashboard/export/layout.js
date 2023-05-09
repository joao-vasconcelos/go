'use client';

import ThreeEvenColumns from '../../../layouts/ThreeEvenColumns';
import Pannel from '../../../components/Pannel/Pannel';

export default function Layout({ children }) {
  //

  return <ThreeEvenColumns first={<Pannel></Pannel>} second={<Pannel></Pannel>} third={<Pannel></Pannel>} />;
}
