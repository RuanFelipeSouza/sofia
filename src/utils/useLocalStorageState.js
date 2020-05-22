const useLocalStorageState = (key, initialValue, useState) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log('Error getting value from loca storage', error);
			return initialValue;
		}
	});

	const setValue = value => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log('Error setting value to local storage', error);
		}
	};

	return [storedValue, setValue];
};

const keys = {
	INTELLILOGS_PROJETO: 'INTELLILOGS_PROJETO',
	INTELLILOGS_DATA_INICIO: 'INTELLILOGS_DATA_INICIO',
	INTELLILOGS_DATA_FIM: 'INTELLILOGS_DATA_FIM',
	INTELLILOGS_PAGINA_ATUAL: 'INTELLILOGS_PAGINA_ATUAL',
	INTELLILOGS_TAMANHO_PAGINA: 'INTELLILOGS_TAMANHO_PAGINA',
	JIRA_DATA_REFERENCIA: 'JIRA_DATA_REFERENCIA',
	JIRA_CLIENTES: 'JIRA_CLIENTES',
	JIRA_CLIENTE: 'JIRA_CLIENTE',
};

const localStorageStateHook = {
	useLocalStorageState,
	keys
};

Object.freeze(localStorageStateHook);

export default localStorageStateHook;