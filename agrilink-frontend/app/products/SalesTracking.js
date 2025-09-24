import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import { PRODUCTS_URL, API_BASE_URL } from "../../lib/api";
import { colors, radius, spacing, shadows } from "../../lib/theme";

const API_URL = `${API_BASE_URL}/api/products/sales/plot`;

export default function SalesTracking() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("month");
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  const fetchSalesData = async () => {
    try {
      const res = await axios.get(`${API_URL}?filter=${filter}`);
      setData(res.data);
      processData(res.data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const processData = (sales) => {
    // Group by product
    const productSales = {};
    sales.forEach(item => {
      const product = item._id.product;
      const sold = item.totalSold;
      if (productSales[product]) {
        productSales[product] += sold;
      } else {
        productSales[product] = sold;
      }
    });

    const labels = Object.keys(productSales);
    const dataPoints = Object.values(productSales);

    setChartData({
      labels,
      datasets: [{ data: dataPoints }],
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Sales Overview</Text>
        <Text style={styles.subtitle}>Visualize your product performance</Text>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Group by</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filter}
              onValueChange={(itemValue) => setFilter(itemValue)}
              style={styles.picker}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Day" value="day" />
              <Picker.Item label="Week" value="week" />
              <Picker.Item label="Month" value="month" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        {chartData.labels.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width - spacing.lg * 2}
            height={300}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(27, 94, 32, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,
              barPercentage: 0.6,
              propsForBackgroundLines: { stroke: colors.border },
            }}
            style={styles.chart}
            yAxisSuffix=""
            fromZero
            showBarTops
          />
        ) : (
          <Text style={styles.empty}>No sales data available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.surface },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 22, fontWeight: "bold", color: colors.primary },
  subtitle: { color: colors.muted, marginTop: 4 },
  filterRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  filterLabel: { marginRight: spacing.md, color: colors.text },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  picker: { height: 44, width: "100%" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chart: { marginVertical: spacing.sm, borderRadius: radius.md },
  empty: { textAlign: "center", color: colors.muted, padding: spacing.lg },
});