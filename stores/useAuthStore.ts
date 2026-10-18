// stores/useAuthStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface UserProfile {
	id: string;
	name: string;
	email: string;
}

interface AuthState {
	// --- STATE ---
	user: UserProfile | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean; // 👈 Penting: Menandakan proses cek sesi di awal

	// --- ACTIONS ---
	initializeAuth: () => Promise<void>;
	login: (token: string, userData: UserProfile) => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	// Nilai awal kosong karena data harus diambil secara asinkronus nanti
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isLoading: true, // Default true agar aplikasi tahu sedang memuat data

	// 1. FUNGSI CEK SESI (Dijalankan sekali saat aplikasi pertama kali dibuka)
	initializeAuth: async () => {
		try {
			const token = await SecureStore.getItemAsync("access_token");
			const userRaw = await SecureStore.getItemAsync("user_profile");

			if (token && userRaw) {
				set({
					accessToken: token,
					user: JSON.parse(userRaw),
					isAuthenticated: true,
				});
			}
		} catch (error) {
			console.error("Gagal memuat sesi:", error);
		} finally {
			// Selesai memuat, matikan loading screen
			set({ isLoading: false });
		}
	},

	// 2. ACTION LOGIN
	login: async (token, userData) => {
		try {
			// Simpan ke Secure Store (Otomatis terenkripsi oleh OS)
			await SecureStore.setItemAsync("access_token", token);
			await SecureStore.setItemAsync(
				"user_profile",
				JSON.stringify(userData),
			);

			// Update State
			set({
				accessToken: token,
				user: userData,
				isAuthenticated: true,
			});
		} catch (error) {
			console.error("Gagal menyimpan sesi login:", error);
		}
	},

	// 3. ACTION LOGOUT
	logout: async () => {
		try {
			// Hapus dari Secure Store
			await SecureStore.deleteItemAsync("access_token");
			await SecureStore.deleteItemAsync("user_profile");

			// Reset State
			set({
				accessToken: null,
				user: null,
				isAuthenticated: false,
			});
		} catch (error) {
			console.error("Gagal menghapus sesi:", error);
		}
	},
}));
