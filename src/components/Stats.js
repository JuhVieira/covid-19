import React from "react";
import { Row, Col } from "shards-react";
import StatsCard from "./StatsCard";

const Stats = ({ confirmed, recovered, deaths }) => (
  <Row style={{ marginTop: "2rem" }}>
    <Col>
      <StatsCard title="Confirmed" value={confirmed} color={"black"} />
    </Col>
    <Col>
      <StatsCard title="Recovered" value={recovered} color={"green"} />
    </Col>
    <Col>
      <StatsCard title="Deaths" value={deaths} color={"red"} />
    </Col>
  </Row>
);

export default Stats;
