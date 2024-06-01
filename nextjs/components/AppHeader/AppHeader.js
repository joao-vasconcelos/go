'use client';

/* * */

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import AppOptions from '../AppOptions/AppOptions';
import styles from './AppHeader.module.css';

/* * */

const greetings = ['Olá', 'Hi', 'Hey', 'Oi', 'Hallo', 'Ciao', 'Hej'];

/* * */

export default function AppHeader() {
	//

	//
	// A. Setup variables

	const { data: sessionData } = useSession();

	const [drawnGreeting] = useState(greetings[(greetings.length * Math.random()) | 0]);

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<p className={styles.greeting}>{sessionData?.user?.name ? `${drawnGreeting} ${sessionData?.user?.name}` : '• • •'}</p>
			<div className={styles.options}>
				<AppOptions />
			</div>
		</div>
	);

	//
}
