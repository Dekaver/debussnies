import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { AuthTokens } from "./type.api";

// const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

if (!API_URL) {
	throw new Error("EXPO_PUBLIC_API_URL not declare in environment variable");
}

// Fungsi bantuan untuk melakukan refresh token
async function handleRefreshToken() {
	try {
		const refreshToken = await SecureStore.getItemAsync("refreshToken");

		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) throw new Error("Refresh token kedaluwarsa");

		const data = await response.json();
		// Simpan token baru yang didapat
		await SecureStore.setItemAsync("accessToken", data.accessToken);
		return data.accessToken;
	} catch (error) {
		// Jika refresh token juga gagal/expired, paksa user logout
		await SecureStore.deleteItemAsync("accessToken");
		await SecureStore.deleteItemAsync("refreshToken");
		// Tambahkan logika navigasi ke layar Login di sini
		throw error;
	}
}

// INI ADALAH CUSTOM FETCH WRAPPER ANDA
export async function appFetch(endpoint: string, options: RequestInit = {}) {
	let storedTokens: string | null = null;

	if (Platform.OS === "web") {
		if (typeof localStorage !== "undefined") {
			storedTokens = localStorage.getItem("authTokens");
		}
	} else {
		try {
			storedTokens = await SecureStore.getItemAsync("authTokens");
		} catch (e) {
			console.error("Gagal mengambil secure store:", e);
		}
	}

	const accessToken: AuthTokens = storedTokens
		? JSON.parse(storedTokens)
		: null;

	// const accessToken = await SecureStore.getItemAsync("accessToken");

	// Atur header default
	options.headers = {
		"Content-Type": "application/json",
		...options.headers,
	} as Record<string, string>;

	if (accessToken) {
		options.headers.Authorization = `Bearer ${accessToken}`;
	}

	// 1. Lakukan request pertama
	let response = await fetch(`${API_URL}${endpoint}`, options);

	// 2. Jika terkena error 401 (Unauthorized)
	if (response.status === 401) {
		try {
			// 3. Jalankan fungsi refresh token
			const newToken = await handleRefreshToken();

			// 4. Update header dengan token baru
			options.headers["Authorization"] = `Bearer ${newToken}`;

			// 5. Ulangi kembali request yang gagal tadi (Re-request)
			response = await fetch(`${API_URL}${endpoint}`, options);
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	}

	return response;
}
