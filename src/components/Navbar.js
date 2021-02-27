import React from "react"
import { Nav, Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Chart from "./DrawChart"
export let startDate;
export let data = [];
export let curDate;
export let emailRoute = "";





export default function ChartNav(){
    curDate = new Date();
    const { currentUser, logout } = useAuth()
    emailRoute = (currentUser.email).replace(".", "");
    let dd = String(curDate.getDate()).padStart(2, '0');
    let mm = String(curDate.getMonth() + 1).padStart(2, '0');
    curDate = 365 + parseInt(dd) + parseInt(mm) * 30;
    startDate = 365 + 85;
    const handleSelect = (eventKey) => {
        if(eventKey == 1) { startDate = curDate - 7; }
        else if(eventKey == 2) { startDate = curDate - 14; }
        else if(eventKey == 3) { startDate = curDate - 30; } 
        else if(eventKey == 4) { startDate = curDate - 123; }
        else if(eventKey == 5) { startDate = curDate - 365; }
        else{ startDate = dd + mm * 30; }
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
        <Chart/>
        </Card>
    );
}