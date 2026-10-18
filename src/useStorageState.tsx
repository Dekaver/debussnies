import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useReducer } from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
	initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
	return useReducer(
		(
			state: [boolean, T | null],
			action: T | null = null,
		): [boolean, T | null] => [false, action],
		initialValue,
	) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
	if (Platform.OS === "web") {
		if (typeof localStorage === "undefined") {
			throw new Error("Local storage is unavailable.");
		}

		if (value === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	} else {
		if (value == null) {
			await SecureStore.deleteItemAsync(key);
		} else {
			await SecureStore.setItemAsync(key, value);
		}
	}
}

export function useStorageState(key: string): UseStateHook<string> {
	// Public
	const [state, setState] = useAsyncState<string>();

	// Get
	useEffect(() => {
		if (Platform.OS === "web") {
			try {
				if (typeof localStorage !== "undefined") {
					setState(localStorage.getItem(key));
				} else {
					setState(null);
				}
			} catch (e) {
				console.error("Local storage is unavailable:", e);
				setState(null);
			}
		} else {
			SecureStore.getItemAsync(key)
				.then((value: string | null) => setState(value))
				.catch((error: unknown) => {
					console.error("Secure storage is unavailable:", error);
					setState(null);
				});
		}
	}, [key]);

	// Set
	const setValue = useCallback(
		async (value: string | null) => {
			await setStorageItemAsync(key, value);
			setState(value);
		},
		[key],
	);

	return [state, setValue];
}
