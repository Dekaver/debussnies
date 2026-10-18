import { createContext, use, type PropsWithChildren } from "react";
import { authApi } from "./services/auth.api";
import { AuthTokens } from "./services/type.api";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
	signIn: (tokens: AuthTokens) => Promise<void>;
	signOut: () => Promise<void>;
	refreshSession: () => Promise<string>;
	session?: string | null;
	refreshToken?: string | null;
	isLoading: boolean;
} | null>(null);

// Use this hook to access the user info.
export function useSession() {
	const value = use(AuthContext);
	if (!value) {
		throw new Error("useSession must be wrapped in a <SessionProvider />");
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, storedTokens], setStoredTokens] =
		useStorageState("authTokens");
	const tokens: AuthTokens | null = storedTokens
		? JSON.parse(storedTokens)
		: null;

	return (
		<AuthContext.Provider
			value={{
				signIn: async (authTokens) => {
					if (!authTokens.accessToken || !authTokens.refreshToken) {
						throw new Error("Token autentikasi tidak lengkap.");
					}
					setStoredTokens(JSON.stringify(authTokens));
				},
				signOut: async () => {
					setStoredTokens(null);
				},
				refreshSession: async () => {
					if (!tokens?.refreshToken) {
						throw new Error(
							"Refresh token tidak tersedia. Silakan masuk kembali.",
						);
					}

					const refreshedTokens = await authApi.refreshTokens(
						tokens.refreshToken,
					);
					setStoredTokens(JSON.stringify(refreshedTokens));
					return refreshedTokens.accessToken;
				},
				session: tokens?.accessToken ?? null,
				refreshToken: tokens?.refreshToken ?? null,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
