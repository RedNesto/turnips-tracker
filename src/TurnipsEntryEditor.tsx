import React from "react";
import {Chart} from "chart.js"

import {formatDate, isSunday} from './helpers'
import {createProfitChartData, createTurnipsNumberChartData, DayHalf, TurnipsEntry} from "./Turnips";

import TurnipsTable from './TurnipsTable'

type EntryEditorProps = {
    tableRef: React.RefObject<TurnipsTable>
    priceChartRef: React.RefObject<Chart<"line">>
    priceChartContainerRef: React.RefObject<HTMLDivElement>
    profitChartRef: React.RefObject<Chart<"line">>
    profitChartContainerRef: React.RefObject<HTMLDivElement>
    hidden?: boolean
}

type EntryEditorState = {
    hidden: boolean
    formValid: boolean
    date: string
    half: DayHalf
    price: number
    quantity: number
}

export default class EntryEditor extends React.Component<EntryEditorProps, EntryEditorState> {

    constructor(props: EntryEditorProps) {
        super(props)
        const now = new Date();
        this.state = {
            hidden: props.hidden ?? false,
            formValid: true,
            date: formatDate(now),
            half: now.getHours() < 12 ? DayHalf.Morning : DayHalf.Afternoon,
            price: 0,
            quantity: 0
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} style={{display: this.state.hidden ? 'none' : 'unset'}}>
                <label>
                    Date:
                    <input name="date" type="date" value={this.state.date} onChange={this.handleInputChange}/>
                </label>
                <label>
                    Half:
                    <select name="half" value={this.state.half} onChange={this.handleInputChange}>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                </label>
                <label>
                    Price:
                    <input name="price" type="number" value={this.state.price} onChange={this.handleInputChange}/>
                </label>
                <label>
                    Quantity:
                    <input name="quantity" type="number" value={this.state.quantity} onChange={this.handleInputChange}/>
                </label>
                <button type="submit" disabled={!this.state.formValid}>Add</button>
            </form>
        )
    }

    validateForm = () => this.setState({formValid: this.state.date.length !== 0})

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.currentTarget
        this.setState({[name]: value} as any, this.validateForm)
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!this.state.formValid) {
            return
        }

        const date = this.state.date
        const half = this.state.half
        const price = this.state.price
        const quantity = this.state.quantity
        let entry: TurnipsEntry
        if (isSunday(date)) {
            entry = {date: date, bought: quantity, price: price};
        } else {
            entry = {date: date, half: half, sold: quantity, price: price};
        }

        const turnipsTable = this.props.tableRef.current!
        turnipsTable.addEntry(entry)
        const entries = turnipsTable.state.entries
        const turnipsPriceChart = this.props.priceChartRef.current!
        turnipsPriceChart.data = createTurnipsNumberChartData(entries)
        turnipsPriceChart.update()
        this.props.priceChartContainerRef.current!.style.removeProperty('display')
        const turnipsProfitChart = this.props.profitChartRef.current!
        turnipsProfitChart.data = createProfitChartData(entries)
        turnipsProfitChart.update()
        this.props.profitChartContainerRef.current!.style.removeProperty('display')
    }
}
