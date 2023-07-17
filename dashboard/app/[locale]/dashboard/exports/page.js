import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import ExportedFilesList from '@/components/ExportedFilesList/ExportedFilesList';
import ExportFileForm from '@/components/ExportFileForm/ExportFileForm';

export default function Page() {
  return (
    <AuthGate scope='exports' permission='view' redirect>
      <TwoEvenColumns first={<ExportedFilesList />} second={<ExportFileForm />} />;
    </AuthGate>
  );
}
