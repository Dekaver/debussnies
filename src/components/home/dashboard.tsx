import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function ReportScreen() {
	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>Laporan Keuangan</Text>
				<TouchableOpacity style={styles.exportBtn}>
					<Text style={styles.exportText}>📄 Export</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Month Selector */}
				<View style={styles.monthSelector}>
					<Text style={styles.arrow}>◀</Text>
					<Text style={styles.monthText}>Oktober 2026</Text>
					<Text style={styles.arrow}>▶</Text>
				</View>

				{/* Summary Card */}
				<View style={styles.reportCard}>
					<View style={styles.rowBetween}>
						<View>
							<Text style={styles.cardSubLabel}>
								TOTAL KAS MASUK
							</Text>
							<Text style={styles.cardVal}>Rp 6.000.000</Text>
						</View>
						<View>
							<Text
								style={[
									styles.cardSubLabel,
									{ color: "#fca5a5" },
								]}
							>
								TOTAL KAS KELUAR
							</Text>
							<Text style={styles.cardVal}>Rp 1.750.000</Text>
						</View>
					</View>
					<View style={styles.cardLine} />
					<View style={styles.rowBetween}>
						<Text style={styles.cardFootLabel}>
							Arus Kas Bersih (Sisa):
						</Text>
						<Text style={styles.cardFootVal}>+Rp 4.250.000</Text>
					</View>
				</View>

				{/* Section Chart */}
				<Text style={styles.sectionTitle}>
					Pengeluaran per Kategori
				</Text>
				<View style={styles.chartBox}>
					{/* Mockup Pie / Donut Chart */}
					<View style={styles.donutCircle}>
						<Text style={styles.donutText}>100%</Text>
					</View>
					<View style={styles.legendGroup}>
						<View style={styles.legendItem}>
							<View
								style={[
									styles.dot,
									{ backgroundColor: "#e74c3c" },
								]}
							/>
							<Text style={styles.legendText}>Makan (40%)</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[
									styles.dot,
									{ backgroundColor: "#f1c40f" },
								]}
							/>
							<Text style={styles.legendText}>Listrik (35%)</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[
									styles.dot,
									{ backgroundColor: "#3498db" },
								]}
							/>
							<Text style={styles.legendText}>
								Transport (25%)
							</Text>
						</View>
					</View>
				</View>

				{/* Breakdown List */}
				<Text style={styles.sectionTitle}>Rincian Pengeluaran</Text>
				<View style={styles.breakdownList}>
					<View style={styles.breakdownItem}>
						<Text style={{ fontSize: 16 }}>🍔</Text>
						<Text style={styles.breakdownTitle}>Makan & Minum</Text>
						<Text style={styles.breakdownVal}>Rp 700.000</Text>
					</View>
					<View style={styles.breakdownItem}>
						<Text style={{ fontSize: 16 }}>⚡</Text>
						<Text style={styles.breakdownTitle}>
							Tagihan Listrik
						</Text>
						<Text style={styles.breakdownVal}>Rp 600.000</Text>
					</View>
					<View style={styles.breakdownItem}>
						<Text style={{ fontSize: 16 }}>🚗</Text>
						<Text style={styles.breakdownTitle}>Transportasi</Text>
						<Text style={styles.breakdownVal}>Rp 450.000</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#ffffff" },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	title: { fontSize: 16, fontWeight: "bold", color: "#111827" },
	exportBtn: {
		backgroundColor: "#f3f4f6",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	exportText: { fontSize: 10, fontWeight: "bold", color: "#374151" },
	scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
	monthSelector: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		padding: 10,
		borderRadius: 8,
	},
	arrow: { color: "#6b7280", fontSize: 12 },
	monthText: { fontSize: 12, fontWeight: "bold", color: "#1f2937" },
	reportCard: {
		backgroundColor: "#1b4d3e",
		borderRadius: 14,
		padding: 16,
		gap: 10,
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardSubLabel: { fontSize: 9, color: "#a3e635", fontWeight: "bold" },
	cardVal: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#ffffff",
		marginTop: 2,
	},
	cardLine: { height: 1, backgroundColor: "rgba(255,255,255,0.2)" },
	cardFootLabel: { fontSize: 10, color: "#d1d5db" },
	cardFootVal: { fontSize: 12, fontWeight: "bold", color: "#ffffff" },
	sectionTitle: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#111827",
		marginTop: 4,
	},
	chartBox: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		paddingVertical: 10,
	},
	donutCircle: {
		width: 76,
		height: 76,
		borderRadius: 38,
		borderWidth: 12,
		borderColor: "#e74c3c",
		justifyContent: "center",
		alignItems: "center",
	},
	donutText: { fontSize: 10, fontWeight: "bold", color: "#374151" },
	legendGroup: { gap: 6 },
	legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
	dot: { width: 8, height: 8, borderRadius: 4 },
	legendText: { fontSize: 10, color: "#374151" },
	breakdownList: { gap: 8 },
	breakdownItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f9fafb",
		padding: 12,
		borderRadius: 8,
		gap: 10,
	},
	breakdownTitle: {
		flex: 1,
		fontSize: 11,
		fontWeight: "bold",
		color: "#374151",
	},
	breakdownVal: { fontSize: 11, fontWeight: "bold", color: "#111827" },
});
