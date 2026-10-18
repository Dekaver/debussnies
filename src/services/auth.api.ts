import { appFetch } from "./api";
import { AuthTokens } from "./type.api";

const isAuthTokens = (value: unknown): value is AuthTokens => {
	return (
		typeof value === "object" &&
		value !== null &&
		"accessToken" in value &&
		typeof value.accessToken === "string" &&
		"refreshToken" in value &&
		typeof value.refreshToken === "string"
	);
};

export const requestTokens = async (
	path: string,
	body: Record<string, string>,
): Promise<AuthTokens> => {
	const response = await appFetch(`/auth/${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	const result: unknown = await response.json();
	if (!response.ok) {
		const message =
			typeof result === "object" &&
			result !== null &&
			"message" in result &&
			typeof result.message === "string"
				? result.message
				: "Tidak dapat masuk. Silakan coba lagi.";
		throw new Error(message);
	}

	if (!isAuthTokens(result)) {
		throw new Error("Respons autentikasi dari server tidak valid.");
	}

	return result;
};

export const authApi = {
	async createGoogleChallenge() {
		const response = await appFetch(`/auth/google/challenge`, {
			method: "POST",
		});
		const result: unknown = await response.json();

		if (!response.ok) {
			throw new Error(
				"Tidak dapat memulai login Google. Silakan coba lagi.",
			);
		}
		if (
			typeof result !== "object" ||
			result === null ||
			!("state" in result) ||
			typeof result.state !== "string"
		) {
			throw new Error(
				"Respons autentikasi Google dari server tidak valid.",
			);
		}

		return result.state;
	},

	signIn(email: string, password: string) {
		return requestTokens("sign-in", { email, password });
	},

	signInWithGoogle(idToken: string) {
		return requestTokens("google", { idToken });
	},

	refreshTokens(refreshToken: string) {
		return requestTokens("refresh-token", { refreshToken });
	},
};
