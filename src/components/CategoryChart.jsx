import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './CategoryChart.module.css';

const CategoryChart = ({ data }) => {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      fullName: name,
      value
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

  if (chartData.length === 0) {
    return <p className={styles.noData}>No data available</p>;
  }

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12, fill: '#fff' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#fff' }} />
          <Tooltip
            formatter={(value, name) => [value, 'Questions']}
            labelFormatter={(label) => {
              const item = chartData.find(d => d.name === label);
              return item ? item.fullName : label;
            }}
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #555',
              borderRadius: '4px',
              padding: '8px',
              color: 'white'
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(CategoryChart);

