import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { productAPI } from "../../lib/api";
import { colors, radius, spacing, shadows } from "../../lib/theme";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";

export default function SalesTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("month");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [0] }],
  });

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getSalesAnalytics({ filter });
      
      if (response.success) {
        setData(response.data);
        processData(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processData = (sales) => {
    if (!sales || sales.length === 0) {
      setChartData({
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      });
      return;
    }

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

    const labels = Object.keys(productSales).map(name => 
      name.length > 10 ? name.substring(0, 10) + '...' : name
    );
    const dataPoints = Object.values(productSales);

    setChartData({
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [{ data: dataPoints.length > 0 ? dataPoints : [0] }],
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, [filter]);

  if (loading) {
    return <LoadingSpinner message="Loading sales data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSalesData} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Sales Overview</Text>
            <Text style={styles.subtitle}>Track your product performance</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="bar-chart" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Filter Selector */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Group by:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filter}
              onValueChange={(value) => setFilter(value)}
              style={styles.picker}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Daily" value="day" />
              <Picker.Item label="Weekly" value="week" />
              <Picker.Item label="Monthly" value="month" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartCard}>
        {chartData.labels.length > 0 && chartData.labels[0] !== 'No Data' ? (
          <>
            <Text style={styles.chartTitle}>Sales by Product</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={chartData}
                width={Math.max(Dimensions.get("window").width - 40, chartData.labels.length * 60)}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: colors.card,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(27, 94, 32, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.7,
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: colors.border,
                    strokeWidth: 1,
                  },
                  propsForLabels: {
                    fontSize: 12,
                  },
                }}
                style={styles.chart}
                fromZero
                showBarTops={false}
                withInnerLines={true}
              />
            </ScrollView>
          </>
        ) : (
          <EmptyState
            icon="analytics-outline"
            title="No Sales Data"
            message="Start selling products to see analytics here"
          />
        )}
      </View>

      {/* Sales Summary */}
      {data.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quick Stats</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Ionicons name="cube-outline" size={24} color={colors.primary} />
              <Text style={styles.summaryNumber}>
                {data.reduce((sum, item) => sum + item.totalSold, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Units Sold</Text>
            </View>

            <View style={styles.summaryItem}>
              <Ionicons name="basket-outline" size={24} color={colors.success} />
              <Text style={styles.summaryNumber}>
                {new Set(data.map(item => item._id.product)).size}
              </Text>
              <Text style={styles.summaryLabel}>Products Sold</Text>
            </View>

            <View style={styles.summaryItem}>
              <Ionicons name="trending-up-outline" size={24} color={colors.info} />
              <Text style={styles.summaryNumber}>
                {data.length}
              </Text>
              <Text style={styles.summaryLabel}>Total Sales</Text>
            </View>
          </View>
        </View>
      )}

      {/* Top Products List */}
      {data.length > 0 && (
        <View style={styles.topProductsCard}>
          <Text style={styles.topProductsTitle}>Top Selling Products</Text>
          {data
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5)
            .map((item, index) => (
              <View key={index} style={styles.productRow}>
                <View style={styles.productRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item._id.product}</Text>
                  <Text style={styles.productCategory}>{item._id.category}</Text>
                </View>
                <View style={styles.productStats}>
                  <Text style={styles.productSold}>{item.totalSold}</Text>
                  <Text style={styles.productLabel}>units</Text>
                </View>
              </View>
            ))}
        </View>
      )}

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
  },
  picker: {
    height: 44,
  },
  chartCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: radius.md,
  },
  summaryCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.xs,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  topProductsCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  topProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  productStats: {
    alignItems: 'flex-end',
  },
  productSold: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  productLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});