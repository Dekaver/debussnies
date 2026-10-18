const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export const getApiUrl = () => {
	if (!API_URL) {
		throw new Error("EXPO_PUBLIC_API_URL belum dikonfigurasi.");
	}

	return API_URL;
};

export const authenticatedFetch = (
	accessToken: string,
	path: string,
	init: RequestInit = {},
) => {
	const headers = new Headers(init.headers);
	headers.set("Authorization", `Bearer ${accessToken}`);
	const safePath = path.startsWith("/") ? path : `/${path}`;

	return fetch(`${getApiUrl()}${safePath}`, { ...init, headers });
};
