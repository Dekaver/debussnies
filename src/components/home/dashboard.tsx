import { View, StyleSheet, Text } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridItem}>
        <Text style={styles.text1}>1</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.text2}>2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
  },
  text1:{
    backgroundColor: "#fff63c",
    padding: 2,
  },
  text2:{
    backgroundColor: "#5dfbd5"
  }
});
