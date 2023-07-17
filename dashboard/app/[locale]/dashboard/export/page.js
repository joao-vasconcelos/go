import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import ExportedFilesList from '@/components/ExportedFilesList/ExportedFilesList';
import ExportFileForm from '@/components/ExportFileForm/ExportFileForm';

export default function Page() {
  //

  //
  // E. Render components

  return <TwoEvenColumns first={<ExportedFilesList />} second={<ExportFileForm />} />;
}
