import React from 'react'
import './App.css'
import {compareDates} from './helpers'

function App() {
    const tableRef = React.createRef()
    return (
        <div>
            <LoadTurnipsData tableRef={tableRef}/>
            <TurnipsTable ref={tableRef}/>
        </div>
    )
}

export default App

class LoadTurnipsData extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tableRef: props.tableRef,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return (
            <form>
                <label htmlFor="turnips-file">Open Turnips Data: </label>
                <input type="file" id="turnips-file" onChange={this.handleChange} title="Open Turnips Data"/>
            </form>
        )
    }

    handleChange(event) {
        const turnipsFile = event.target.files[0]
        if (!turnipsFile) {
            return
        }
        if (!(turnipsFile instanceof Blob)) {
            console.log("Not a Blob, but a %s", turnipsFile.constructor.name)
            return
        }

        const reader = new FileReader()
        const turnipsTable = this.state.tableRef.current
        reader.onload = _ => {
            const text = reader.result
            console.assert(typeof text === "string", "readAsText did not return a String result but a %s of value %s", text.constructor.name, text)
            try {
                const parsed = JSON.parse(text)
                turnipsTable.setState({entries: parsed})
            } catch (error) {
                console.error("Error occurred when parsing turnips data: %s", error)
                let errorMessage = "more details in the console"
                if (error instanceof SyntaxError) {
                    errorMessage = error.message
                }
                turnipsTable.setState({errorMessage: errorMessage})
            }
        }
        reader.onerror = _ => {
            const error = reader.error
            console.error("Error occurred when reading turnips data file: %s", error)
            turnipsTable.setState({errorMessage: `could not read file: ${error.message}`})
        }
        reader.readAsText(turnipsFile)
        event.preventDefault()
    }
}

class TurnipsTable extends React.Component {

    render() {
        if (!this.state) {
            return (
                <p>No Turnips Data Loaded</p>
            )
        }

        const errorMessage = this.state.errorMessage
        if (errorMessage) {
            return (
                <p>Error when reading the turnips data: {errorMessage}</p>
            )
        }

        const turnipsEntries = this.state.entries.sort(turnipsEntriesSort)

        const listEntries = turnipsEntries.map((entry, _) => TurnipsEntryCell(entry))
        return (
            <ol id="turnips-table">
                {listEntries}
            </ol>
        )
    }
}

function TurnipsEntryCell(props) {
    let detail
    const bought = props.bought
    const sold = props.sold
    const price = props.price
    if (bought != null) {
        if (price != null || price <= 0) {
            detail = (<p>Bought {bought} for {price * bought} ({price}/unit)</p>)
        } else {
            detail = (<p>Bought {bought} for an unknown price</p>)
        }
    } else if (sold != null) {
        if (price != null || price <= 0) {
            detail = (<p>Sold {sold} for {price * sold} ({price}/unit)</p>)
        } else {
            detail = (<p>Sold {sold} for an unknown price</p>)
        }
    } else {
        detail = (<p>No data available</p>)
    }
    return (
        <li key={props.date + '-' + props.half}>
            <p>Turnips of {props.date} {props.half}</p>
            {detail}
        </li>
    )
}

function turnipsEntriesSort(a, b) {
    if (a.date === b.date) {
        return a.half === "morning" && b.half === "afternoon" ? -1 : 1
    }
    return compareDates(a.date, b.date)
}
