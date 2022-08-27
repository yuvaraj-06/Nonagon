import React, { useState } from "react";
import { Card, CardBody, Row, Col, Input, Label, Tooltip } from "reactstrap";
import CardTitle from "reactstrap/lib/CardTitle";

const ExploreMoreCard = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  let tooltipText = props.data.description;

  const handleCheckBox = (e) => {
    props.handelCheckbox(props.featCode, e.target.checked);
  };

  return (
    <Card className="explr-card">
      <div className="explr-i" id={`explr-tooltip-${props.tooltipID}`}>
        <i className=" fas fa-info" />
      </div>
      <Tooltip
        placement="top-start"
        isOpen={tooltipOpen}
        target={`explr-tooltip-${props.tooltipID}`}
        toggle={toggle}
      >
        {tooltipText}
      </Tooltip>
      <CardTitle className="explr-title">
        <i className={props.data.icon} />
        {props.data.title}
      </CardTitle>
      <CardBody className="explr-body">
        <Row className="">
          <Col className="">
            <Label className="explr-checkbox">
              <Input type="checkbox" onChange={handleCheckBox} />
              Enable
            </Label>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ExploreMoreCard;
