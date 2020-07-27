import React from "react";

import {dayForDate} from "./helpers";
import {createTurnipsKey, turnipsEntriesSort, TurnipsEntry} from "./Turnips";

type TurnipsTableProps = {
    visible?: boolean
}

type TurnipsTableState = {
    entries: Array<TurnipsEntry>
    errorMessage?: string
    visible: boolean
}

export default class TurnipsTable extends React.Component<TurnipsTableProps, TurnipsTableState> {

    constructor(props: TurnipsTableProps) {
        super(props);
        this.state = {
            entries: [],
            visible: props.visible ?? true
        }
    }

    addEntry = (entry: TurnipsEntry) => {
        const entries = this.state.entries

        const key = createTurnipsKey(entry)
        const existingEntryIndex = entries.findIndex(value => createTurnipsKey(value) === key)
        if (existingEntryIndex < 0) {
            entries.push(entry)
        } else {
            entries[existingEntryIndex] = entry
        }
        this.setState({entries: entries.sort(turnipsEntriesSort)})
    }

    render() {
        if (!this.state) {
            return (<p>No Turnips Data Loaded</p>)
        }

        const errorMessage = this.state.errorMessage
        if (errorMessage) {
            return (<p>Error when reading the turnips data: {errorMessage}</p>)
        }

        const isVisible = this.state.visible;
        if (this.state.entries.length === 0) {
            return isVisible ? (<p>No Turnips Data Loaded</p>) : (<div/>)
        }

        const visibilityToggle = (
            <label>
                <input type={"checkbox"} name={"visible"} onChange={this.handleVisibilityCheckbox} checked={isVisible}/>
                Show Detailed Table
            </label>
        )

        if (!isVisible) {
            // No need to compute the table content if it is not visible
            return (<div>{visibilityToggle}</div>)
        }

        const turnipsEntries = this.state.entries.sort(turnipsEntriesSort)
        const turnipsRows = turnipsEntries.map(entry => TurnipsTableRow(entry))
        return (
            <div>
                {visibilityToggle}
                <table id="turnips-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Bought / Sold</th>
                        <th>Detail</th>
                    </tr>
                    </thead>
                    <tbody>
                    {turnipsRows}
                    </tbody>
                </table>
            </div>
        )
    }

    handleVisibilityCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({visible: event.target.checked})
}

function TurnipsTableRow(props: TurnipsEntry) {
    let detail
    let formattedCount
    const bought = props.bought
    const sold = props.sold
    const price = props.price
    if (bought != null) {
        formattedCount = bought.toLocaleString()
        if (bought <= 0) {
            detail = `Bought none`
        } else if (price != null && price > 0) {
            const formattedTotal = (price * bought).toLocaleString()
            detail = `Bought ${formattedCount} for ${formattedTotal} (${price}/unit)`
        } else {
            detail = `Bought ${formattedCount} for an unknown price`
        }
    } else if (sold != null) {
        formattedCount = sold.toLocaleString()
        if (sold <= 0) {
            detail = `Sold none`
        } else if (price != null && price > 0) {
            const formattedTotal = (price * sold).toLocaleString()
            detail = `Sold ${formattedCount} for ${formattedTotal} (${price}/unit)`
        } else {
            detail = `Sold ${formattedCount} for an unknown price`
        }
    } else {
        formattedCount = 'unknown'
        detail = 'No data available'
    }
    return (
        <tr key={createTurnipsKey(props)}>
            <td>{props.date} ({dayForDate(props.date)}) {props.half}</td>
            <td>{price}</td>
            <td>{formattedCount}</td>
            <td>{detail}</td>
        </tr>
    )
}
