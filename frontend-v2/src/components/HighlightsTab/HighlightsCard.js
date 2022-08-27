import React, { Component } from 'react'

import {
    Card, CardTitle,
    Row,
    Col
} from 'reactstrap'

import { connect } from 'react-redux'
import axios from "axios"
import { nodeBaseURL } from "ApiURL"
import AwardCards from './AwardCards'

const awardsData = {
    "people_count": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "hygiene_index": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "billing_manned": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "mopping": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "covid_protocols": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "electricity_wastage": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "login_streak": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    },
    "open_close_timing": {
        "bronze": null,
        "silver": null,
        "gold": null,
        "bronze_issuance_date": null,
        "silver_issuance_date": null,
        "gold_issuance_date": null
    }
}

const getAwardFuntions = (awardName) => {
    switch (awardName) {
        case 'peopleCount':
            return [
                "Get this award by achieving a score of atleast 50 People Count.",
                "Get this award by achieving a score of atleast 70 People Count.",
                "Get this award by achieving a score of atleast 90 People Count."];
        case "billingCounter":
            return [
                "Get this award by maintaining you billing counter manned, and having the unmanned count less than 4 to 5 during non-consecutive hours of the day",
                "Get this award by maintaining you billing counter manned, and having the unmanned count less than 3 to 4 during non-consecutive hours of the day",
                "Get this award by maintaining you billing counter manned, and having the unmanned count less than 2 during non-consecutive hours of the day"];
        case "mopping":
            return [
                "Get this award by mopping the floors for atleast once a day.",
                "Get this award by mopping the floors for atleast 2 to 3 times a day.",
                "Get this award by mopping the floors for more than 3 times a day."];
        case "electricityWastage":
            return [
                "Get this award if your outlet's lights are kept dim after the operational hours for 3 consecutive days of a week",
                "Get this award if your outlet's lights are kept dim after the operational hours for 4 to 5 consecutive days of a week",
                "Get this award if your outlet's lights are kept dim after the operational hours for more than 5 consecutive days of a week"];
        case "hygiene":
            return [
                "Get this award if the hygiene index is maintained between 3 to 3.5 during the day",
                "Get this award if the hygiene index is maintained between 3.5 to 4 during the day",
                "Get this award if the hygiene index is maintained above 4 for a day",
            ];
        case "covidProtocol":
            return [
                "Get this award if the total social distancing violations and mask deviations for a day is in between 15% - 20% of the total footfall",
                "Get this award if the total social distancing violations and mask deviations for a day is in between 10% - 15%of the total footfall",
                "Get this award if the total social distancing violations and mask deviations for a day is less than 10% of the total footfall"];
        case "dashboardLogin":
            return [
                "Get this award if your outlet's admin/user login  to dashboard for 3 consecutive days",
                "Get this award if your outlet's admin/user login  to dashboard for 5 consecutive days",
                "Get this award if your outlet's admin/user login  to dashboard for 7 consecutive days",];
        case "storeTimings":
            return [
                "Get this award if your store's open and close timings are consistent for 3 days.",
                "Get this award if your store's open and close timings are consistent for 5 days.",
                "Get this award if your store's open and close timings are consistent for 7 days."];
        default:
            return "None";

    }
}

const getAwardDetails = (featureJSON, awardName, awardTitle) => {
    let awardDetails = {
        awardCategory: 'notAchieved',
        awardDate: null,
        awardName,
        awardTitle,
        img: '',
        awardFormula: {
            category: '',
            text: ''
        }
    }
    if (featureJSON.gold === !null) {
        awardDetails.awardCategory = 'gold'
        awardDetails.awardDate = featureJSON.gold_issuance_date
        awardDetails.awardFormula.category = 'None'
        awardDetails.awardFormula.text = "You have already achieved this award."
    } else if (featureJSON.silver === !null) {
        awardDetails.awardCategory = 'silver'
        awardDetails.awardDate = featureJSON.silver_issuance_date
        awardDetails.awardFormula.category = "gold"
        awardDetails.awardFormula.text = getAwardFuntions(awardName)[2]
    } else if (featureJSON.bronze === !null) {
        awardDetails.awardCategory = 'bronze'
        awardDetails.awardDate = featureJSON.bronze_issuance_date
        awardDetails.awardFormula.category = "silver"
        awardDetails.awardFormula.text = getAwardFuntions(awardName)[1]
    }
    else {
        awardDetails.awardFormula.category = "bronze"
        awardDetails.awardFormula.text = getAwardFuntions(awardName)[0]
    }
    return getAwardImage(awardDetails);
}

const getAwardImage = (awardDetails) => {
    if (awardDetails.awardCategory !== null) {
        // `https://raw.githubusercontent.com/hyperform-tech/required-digital-asset/main/awards/${awardDetails.awardName}/${awardDetails.awardCategory}.png`
        awardDetails.img = `https://raw.githubusercontent.com/hyperform-tech/required-digital-asset/main/awards/${awardDetails.awardName}/${awardDetails.awardCategory}.png`
        // `assets/img/awards/${awardDetails.awardName}/${awardDetails.awardCategory}.png`
    }
    return awardDetails;
}

const mapStateToProps = (state) => {
    return {
        outletCode: state.outletCode.outletCode,
        companyServices: state.services.companyServices,
    };
}

class HighlightsCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: awardsData,
        }
        this._ismounted = true
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `awards/${nextProps.outletCode}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                this._ismounted && this.setState({
                    data: res.data
                })
            })
            .catch(err => {

            })
    }

    componentDidMount() {
        this._ismounted && this.fetchData(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this._ismounted && this.fetchData(nextProps)
    }

    componentWillUnmount() {
        this._ismounted = false
    }

    getOutletTimeZone = () => {
        if (this.props.companyServices[this.props.outletCode]) {
            return this.props.companyServices[this.props.outletCode].timezone
        } else {
            return null
        }
    }

    render() {
        return (
            <Card>
                <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                    Your Badges for {this.props.companyServices[this.props.outletCode]
                        ? this.props.companyServices[this.props.outletCode].outlet_location
                        : 'Loading...'} Outlet
                </CardTitle>

                <div>
                    <Row className='ml-4 mr-4'>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.billing_manned, 'billingCounter', 'Billing Counter')} BadgeDesc="Keep your billing counter manned to unlock this badge for your store." /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.covid_protocols, 'covidProtocol', 'Covid Safety')} BadgeDesc="Follow Covid-19 protocols to unlock this badge for your store." /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.login_streak, 'dashboardLogin', 'Dashboard Login Streak')} BadgeDesc="Make sure you login to Nonagon Dashboard to unlock this badge." /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.electricity_wastage, 'electricityWastage', 'Electricity Saved')} BadgeDesc="Make sure not to turn off lights after hours to unlock this badge." /></Col>
                    </Row>
                    <Row className='ml-4 mr-4'>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.hygiene_index, 'hygiene', 'Cleanliness and Hygiene')} BadgeDesc="Maintain cleanliness and hygiene to unlock this badge. " /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.people_count, 'peopleCount', 'People Count')} BadgeDesc="Maintain coequal people limit in your store's rooms to unlock next level of this badge" /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.mopping, 'mopping', 'Floor Mopping')} BadgeDesc="Continuously mop the floor to maintain hygiene and unlock this badge." /></Col>
                        <Col sm="12" md="6" lg="3"><AwardCards timeZone={this.getOutletTimeZone()} awardDetails={getAwardDetails(this.state.data.open_close_timing, 'storeTimings', 'Open and Close Timings')} BadgeDesc="Open and close your store timely to unlock this badge." /></Col>
                    </Row>
                </div>
            </Card>
        )
    }
}

export default connect(
    mapStateToProps,
)(HighlightsCard);
