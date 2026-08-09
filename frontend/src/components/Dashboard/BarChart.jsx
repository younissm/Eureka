import { Box, Text } from "@chakra-ui/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TinyBarChart = ({ data }) => {
  function CustomTooltip({ payload, label, active }) {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <Box
          className="custom-tooltip"
          bg="purple.400"
          color="white"
          w="150px"
          h="100px"
          position="relative"
          rounded="md"
        >
          <Box
            className="label"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            textAlign="center"
          >
            <Text>{label}</Text>
            <Text>العدد:{value}</Text>
          </Box>
        </Box>
      );
    }

    return null;
  }
  return (
    <ResponsiveContainer>
      <BarChart width={150} height={40} data={data}>
        <XAxis
          dataKey="name"
          tick={false} // Hide the x-axis ticks
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="value" fill="#6b46c1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TinyBarChart;
