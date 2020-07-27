import React from "react";
import {Line as LineChart} from "react-chartjs-2";

import {isSunday} from './helpers'
import {createProfitChartData, createTurnipsNumberChartData, DayHalf} from "./Turnips";

import TurnipsTable from './TurnipsTable'

type EntryEditorProps = {
    tableRef: React.RefObject<TurnipsTable>
    priceChartRef: React.RefObject<LineChart>
    priceChartContainerRef: React.RefObject<HTMLDivElement>
    profitChartRef: React.RefObject<LineChart>
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
        this.state = {
            hidden: props.hidden ?? false,
            formValid: false,
            date: '',
            half: DayHalf.MORNING,
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

    validateForm = () => this.state.date.length !== 0

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.currentTarget
        this.setState({
            [name]: value,
            formValid: this.validateForm()
        } as any)
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
        const entry = isSunday(date) ? {date: date, bought: quantity, price: price} : {date: date, half: half, sold: quantity, price: price}

        const turnipsTable = this.props.tableRef.current!
        turnipsTable.addEntry(entry)
        const entries = turnipsTable.state.entries
        const turnipsPriceChart = this.props.priceChartRef.current!
        turnipsPriceChart.chartInstance.data = createTurnipsNumberChartData(entries)
        turnipsPriceChart.chartInstance.update()
        this.props.priceChartContainerRef.current!.style.removeProperty('display')
        const turnipsProfitChart = this.props.profitChartRef.current!
        turnipsProfitChart.chartInstance.data = createProfitChartData(entries)
        turnipsProfitChart.chartInstance.update()
        this.props.profitChartContainerRef.current!.style.removeProperty('display')
    }
}
