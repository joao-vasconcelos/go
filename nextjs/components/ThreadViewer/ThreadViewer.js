import MessageComponent from '../MessageComponent/MessageComponent';
import styles from './ThreadViewer.module.css';

export default function ThreadViewer({ messages = [] }) {
	//

	const messagesTemp = [
		{
			_id: '0001',
			content:
        'Deserunt labore nisi non consequat irure magna amet minim est pariatur nostrud irure dolore. Esse mollit consectetur reprehenderit esse officia velit. Officia cupidatat ut incididunt fugiat est. Quis eu nulla deserunt nostrud voluptate cupidatat eu duis laboris elit amet minim consequat aute. In dolore aliqua amet aliquip quis eu esse. Amet voluptate laborum minim culpa esse id reprehenderit velit nostrud. Sunt in eiusmod irure sit aliquip aute. Sunt fugiat duis pariatur Lorem sit. Voluptate laboris consectetur aliquip mollit do. Laboris ipsum Lorem exercitation laborum cillum adipisicing. Ad excepteur dolor est pariatur nostrud sunt officia in pariatur amet ex eiusmod elit. Sunt consectetur aliqua et irure commodo culpa duis veniam voluptate. Voluptate dolore ullamco ex est reprehenderit tempor voluptate ipsum ipsum enim id nulla.',
			files: [
				{
					filename: 'filename.pdf',
					url: 'https://www.example.com',
				},
			],
			sent_by: 'User1',
			thread_id: '123',
		},
		{
			_id: '0002',
			content: 'Deserunt labore nisi non consequat irure magna amet minim est pariatur nostrud irure dolore.',
			files: [
				{
					filename: 'filename.pdf',
					url: 'https://www.example.com',
				},
				{
					filename: 'longer_filename.pdf',
					url: 'https://www.example.com',
				},
			],
			sent_by: 'User2',
			thread_id: '123',
		},
		{
			_id: '0003',
			content:
        'Deserunt labore nisi non consequat irure magna amet minim est pariatur nostrud irure dolore. Esse mollit consectetur reprehenderit esse officia velit. Officia cupidatat ut incididunt fugiat est. Quis eu nulla deserunt nostrud voluptate cupidatat eu duis laboris elit amet minim consequat aute. In dolore aliqua amet aliquip quis eu esse. Amet voluptate laborum minim culpa esse id reprehenderit velit nostrud. Sunt in eiusmod irure sit aliquip aute. Sunt fugiat duis pariatur Lorem sit. Voluptate laboris consectetur aliquip mollit do. Laboris ipsum Lorem exercitation laborum cillum adipisicing. Ad excepteur dolor est pariatur nostrud sunt officia in pariatur amet ex eiusmod elit. Sunt consectetur aliqua et irure commodo culpa duis veniam voluptate. Voluptate dolore ullamco ex est reprehenderit tempor voluptate ipsum ipsum enim id nulla.',
			files: [],
			sent_by: 'User2',
			thread_id: '123',
		},
	];

	return (
		<div className={styles.container}>
			{messages.map(message => <MessageComponent key={message._id} message={message} />)}
		</div>
	);
}
