import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { authApi } from "./api";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export async function getGoogleIdToken(): Promise<string | null> {
	if (!GOOGLE_CLIENT_ID) {
		throw new Error(
			"EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID belum dikonfigurasi.",
		);
	}

	const state = await authApi.createGoogleChallenge();
	const redirectUri = Linking.createURL("auth/callback");
	const authorizationUrl = new URL(
		"https://accounts.google.com/o/oauth2/v2/auth",
	);
	authorizationUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
	authorizationUrl.searchParams.set("redirect_uri", redirectUri);
	authorizationUrl.searchParams.set("response_type", "id_token");
	authorizationUrl.searchParams.set("scope", "openid email profile");
	authorizationUrl.searchParams.set("state", state);
	authorizationUrl.searchParams.set("nonce", state);
	authorizationUrl.searchParams.set("prompt", "select_account");

	const result = await WebBrowser.openAuthSessionAsync(
		authorizationUrl.toString(),
		redirectUri,
	);
	if (result.type !== "success") {
		return null;
	}

	const callbackUrl = new URL(result.url);
	const responseParameters = new URLSearchParams(
		callbackUrl.hash.slice(1) || callbackUrl.search.slice(1),
	);

	if (responseParameters.get("state") !== state) {
		throw new Error("Respons autentikasi Google tidak valid.");
	}

	const oauthError = responseParameters.get("error");
	if (oauthError) {
		throw new Error(
			responseParameters.get("error_description") ?? oauthError,
		);
	}

	const idToken = responseParameters.get("id_token");
	if (!idToken) {
		throw new Error("Google tidak mengembalikan ID token.");
	}

	return idToken;
}
