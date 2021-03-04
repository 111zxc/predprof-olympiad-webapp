import React from "react"
import { useAuth } from "../contexts/AuthContext"
import Chart from "./DrawChart"
export let emailRoute = "";





export default function ChartNav() {
    const { currentUser, logout } = useAuth()
    emailRoute = (currentUser.email).replace(".", "");

    return (
        <Chart />
    );
}
