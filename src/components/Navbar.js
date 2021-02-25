import React from "react"
import { Nav, Form, Card } from "react-bootstrap"

export default function ChartNav(){

    let curDate = new Date();
    let dd = String(curDate.getDate()).padStart(2, '0');
    let mm = String(curDate.getMonth() + 1).padStart(2, '0');

    const handleSelect = (eventKey) => {
        let startDate = "";
        if(eventKey == 1) {startDate = (dd-7) + mm;}
        else if(eventKey == 2) {startDate = (dd-14) + mm;}
        else if(eventKey == 3) {startDate = dd + "0" + (mm - 1);} 
        else{ startDate = dd + mm; }
        console.log(startDate);
    }

    return(
        <Card>
        <Nav onSelect={handleSelect}  bg = "primary" className = "justify-content-center" variant="pills" defaultActiveKey="#first">
            <Nav.Item>
              <Nav.Link eventKey = "1">Неделя</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey = "2">Две недели</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey = "3">Месяц</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey = "4">Полгода</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey = "5">Год</Nav.Link>
            </Nav.Item>
        </Nav>
        </Card>
    )
}