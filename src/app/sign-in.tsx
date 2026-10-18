import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/ctx";
import { authApi } from "@/services/api";
import { getGoogleIdToken } from "@/services/google-auth";

type PendingAction = "email" | "google" | null;

const googleConfigured = Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

export default function SignInScreen() {
	const { signIn } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [pending, setPending] = useState<PendingAction>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const passwordInput = useRef<TextInput>(null);

	const handleEmailSignIn = async () => {
		setErrorMessage(null);
		setPending("email");

		try {
			const tokens = await authApi.signIn(email.trim(), password);
			await signIn(tokens);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Terjadi kesalahan. Silakan coba lagi.",
			);
		} finally {
			setPending(null);
		}
	};

	const handleGoogleSignIn = async () => {
		setErrorMessage(null);
		setPending("google");

		try {
			const idToken = await getGoogleIdToken();
			if (!idToken) {
				return;
			}

			const tokens = await authApi.signInWithGoogle(idToken);
			await signIn(tokens);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Login Google gagal. Silakan coba lagi.",
			);
		} finally {
			setPending(null);
		}
	};

	const isPending = pending !== null;

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
			<StatusBar style="dark" />
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.container}>
						<View style={styles.brandMark}>
							<Ionicons
								name="wallet-outline"
								size={27}
								color="#174b3b"
							/>
						</View>
						<Text style={styles.brandName}>Debussnies</Text>

						<View style={styles.heading}>
							<Text style={styles.title}>Selamat datang</Text>
							<Text style={styles.subtitle}>
								Masuk untuk mengelola keuangan bisnis Anda.
							</Text>
						</View>

						<View style={styles.form}>
							<Text style={styles.label}>Email</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="mail-outline"
									size={19}
									color="#829087"
								/>
								<TextInput
									accessibilityLabel="Email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect={false}
									keyboardType="email-address"
									onChangeText={setEmail}
									onSubmitEditing={() =>
										passwordInput.current?.focus()
									}
									placeholder="nama@email.com"
									placeholderTextColor="#a0aaa4"
									returnKeyType="next"
									style={styles.input}
									textContentType="emailAddress"
									value={email}
								/>
							</View>

							<View style={styles.passwordLabelRow}>
								<Text style={styles.label}>Kata sandi</Text>
								<Text style={styles.passwordHint}>
									Minimal 6 karakter
								</Text>
							</View>
							<View style={styles.inputContainer}>
								<Ionicons
									name="lock-closed-outline"
									size={19}
									color="#829087"
								/>
								<TextInput
									accessibilityLabel="Kata sandi"
									autoCapitalize="none"
									autoComplete="password"
									onChangeText={setPassword}
									onSubmitEditing={handleEmailSignIn}
									placeholder="Masukkan kata sandi"
									placeholderTextColor="#a0aaa4"
									returnKeyType="go"
									ref={passwordInput}
									secureTextEntry={!showPassword}
									style={styles.input}
									textContentType="password"
									value={password}
								/>
								<Pressable
									accessibilityLabel={
										showPassword
											? "Sembunyikan kata sandi"
											: "Tampilkan kata sandi"
									}
									accessibilityRole="button"
									hitSlop={10}
									onPress={() =>
										setShowPassword((visible) => !visible)
									}
								>
									<Ionicons
										name={
											showPassword
												? "eye-off-outline"
												: "eye-outline"
										}
										size={20}
										color="#829087"
									/>
								</Pressable>
							</View>

							{errorMessage ? (
								<View
									accessibilityRole="alert"
									style={styles.errorBox}
								>
									<Ionicons
										name="alert-circle-outline"
										size={18}
										color="#b42318"
									/>
									<Text style={styles.errorText}>
										{errorMessage}
									</Text>
								</View>
							) : null}

							<Pressable
								accessibilityRole="button"
								disabled={
									isPending || !email.trim() || !password
								}
								onPress={handleEmailSignIn}
								style={({ pressed }) => [
									styles.submitButton,
									pressed && styles.buttonPressed,
									(isPending || !email.trim() || !password) &&
										styles.buttonDisabled,
								]}
							>
								{pending === "email" ? (
									<ActivityIndicator color="#ffffff" />
								) : (
									<>
										<Text style={styles.submitButtonText}>
											Masuk
										</Text>
										<Ionicons
											name="arrow-forward"
											size={18}
											color="#ffffff"
										/>
									</>
								)}
							</Pressable>

							<View style={styles.divider}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>
									atau masuk dengan
								</Text>
								<View style={styles.dividerLine} />
							</View>

							<Pressable
								accessibilityRole="button"
								disabled={isPending || !googleConfigured}
								onPress={handleGoogleSignIn}
								style={({ pressed }) => [
									styles.googleButton,
									pressed && styles.googleButtonPressed,
									(isPending || !googleConfigured) &&
										styles.buttonDisabled,
								]}
							>
								{pending === "google" ? (
									<ActivityIndicator color="#25342c" />
								) : (
									<>
										<Ionicons
											name="logo-google"
											size={19}
											color="#25342c"
										/>
										<Text style={styles.googleButtonText}>
											Lanjutkan dengan Google
										</Text>
									</>
								)}
							</Pressable>
							{!googleConfigured ? (
								<Text style={styles.configurationHint}>
									Login Google memerlukan konfigurasi OAuth.
								</Text>
							) : null}
						</View>

						<Text style={styles.footer}>
							Aman dan praktis untuk bisnis Anda.
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f6f8f5",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
	},
	container: {
		width: "100%",
		maxWidth: 460,
		alignSelf: "center",
		paddingHorizontal: 28,
		paddingTop: 28,
		paddingBottom: 24,
	},
	brandMark: {
		width: 56,
		height: 56,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		backgroundColor: "#e5efe9",
		marginBottom: 12,
	},
	brandName: {
		color: "#174b3b",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.3,
		textAlign: "center",
	},
	heading: {
		marginTop: 38,
		marginBottom: 28,
	},
	title: {
		color: "#17211c",
		fontSize: 30,
		fontWeight: "700",
		letterSpacing: -0.6,
		textAlign: "center",
	},
	subtitle: {
		color: "#718078",
		fontSize: 15,
		lineHeight: 22,
		marginTop: 9,
		textAlign: "center",
	},
	form: {
		width: "100%",
	},
	label: {
		color: "#2d3932",
		fontSize: 13,
		fontWeight: "600",
		marginBottom: 9,
	},
	inputContainer: {
		height: 54,
		borderWidth: 1,
		borderColor: "#e0e6e1",
		borderRadius: 13,
		backgroundColor: "#ffffff",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		gap: 11,
		marginBottom: 21,
	},
	input: {
		flex: 1,
		color: "#17211c",
		fontSize: 15,
		height: "100%",
	},
	passwordLabelRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	passwordHint: {
		color: "#9aa49e",
		fontSize: 12,
		marginBottom: 9,
	},
	errorBox: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#fff1f0",
		borderRadius: 10,
		padding: 12,
		marginTop: -5,
		marginBottom: 16,
	},
	errorText: {
		color: "#a32118",
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
	submitButton: {
		height: 54,
		borderRadius: 13,
		backgroundColor: "#174b3b",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		marginTop: 4,
	},
	submitButtonText: {
		color: "#ffffff",
		fontSize: 15,
		fontWeight: "700",
	},
	buttonPressed: {
		backgroundColor: "#103b2e",
		opacity: 0.92,
	},
	buttonDisabled: {
		opacity: 0.55,
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginVertical: 24,
	},
	dividerLine: {
		height: 1,
		flex: 1,
		backgroundColor: "#e3e8e4",
	},
	dividerText: {
		color: "#8a958e",
		fontSize: 12,
	},
	googleButton: {
		height: 54,
		borderWidth: 1,
		borderColor: "#dfe5e0",
		borderRadius: 13,
		backgroundColor: "#ffffff",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 11,
	},
	googleButtonPressed: {
		backgroundColor: "#f1f4f2",
	},
	googleButtonText: {
		color: "#25342c",
		fontSize: 14,
		fontWeight: "600",
	},
	configurationHint: {
		color: "#8a958e",
		fontSize: 12,
		textAlign: "center",
		marginTop: 10,
	},
	footer: {
		color: "#9aa49e",
		fontSize: 12,
		textAlign: "center",
		marginTop: 34,
	},
});
