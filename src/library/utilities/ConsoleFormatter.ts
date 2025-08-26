// ConsoleFormatter.ts
export class ConsoleFormatter {
	static clear() {
		console.clear();
	}

	static header(message: string) {
		console.log(`%c${message}`, 'color: white; background: #444; font-weight: bold; font-size: 20px; padding: 4px 8px; border-radius: 4px;');
	}

	static subHeader(message: string) {
		console.log(`%c${message}`, 'color: #1e90ff; font-weight: bold; font-size: 14px;');
	}

	static default(message: string) {
		console.log(`%c${message}`, 'color: gray; font-size: 12px; font-style: italic;');
	}

	static info(message: string) {
		console.log(`%c${message}`, 'color: gray; font-size: 12px; font-style: italic;');
	}

	static data(...entries: [string, string | number | undefined][]) {
		const parts: string[] = [];
		const styles: string[] = [];

		entries.forEach(([key, value]) => {
			parts.push(`%c${key}:%c${value}`);
			styles.push('color: white; background: #888; font-weight: bold; padding: 2px 2px; border-radius: 4px; margin-right:8px;', 'color: gray; font-size: 12px; font-style: italic;');
		});

		console.log(parts.join('  '), ...styles);
	}

	static success(message: string) {
		console.log(`%c${message}`, 'color: #03b603ff; font-weight: bold; font-size: 13px;');
	}

	static warn(message: string) {
		console.log(`%c${message}`, 'color: orange; font-weight: bold; font-size: 13px;');
	}

	static error(message: string) {
		console.log(`%c${message}`, 'color: red; font-weight: bold; font-size: 13px;');
	}

	static custom(message: string, css: string) {
		console.log(`%c${message}`, css);
	}

	static group(title: string, callback: () => void) {
		console.group(title);
		callback();
		console.groupEnd();
	}
}
