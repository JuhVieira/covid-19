import React from "react";
import { Card, CardHeader, CardBody } from "shards-react";

const StatsCard = ({ title, value, color }) => (
  <Card>
    <CardHeader>{title}</CardHeader>
    <CardBody>
      <p style={{ color }}>{value}</p>
    </CardBody>
  </Card>
);

export default StatsCard;
