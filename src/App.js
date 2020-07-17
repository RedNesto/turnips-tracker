import React from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import {compareDates} from './helpers'
import {defaults as ChartsDefaults, Line as LineChart} from 'react-chartjs-2'
import moment from 'moment'

function App() {
    const tableRef = React.createRef()
    const priceChartRef = React.createRef()
    const profitChartRef = React.createRef()
    const entryEditorRef = React.createRef()
    ChartsDefaults.global.maintainAspectRatio = false
    return (
        <div>
            <LoadTurnipsData tableRef={tableRef} priceChartRef={priceChartRef} profitChartRef={profitChartRef} entryEditorRef={entryEditorRef}/>
            <EntryEditor ref={entryEditorRef} tableRef={tableRef} priceChartRef={priceChartRef} profitChartRef={profitChartRef}/>
            <div style={{display: 'none', position: 'relative', height: '40vh', width: '95vw'}}>
                <LineChart ref={priceChartRef} data={{}}/>
            </div>
            <div style={{display: 'none', position: 'relative', height: '40vh', width: '95vw'}}>
                <LineChart ref={profitChartRef} data={{}}/>
            </div>
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
            priceChartRef: props.priceChartRef,
            profitChartRef: props.profitChartRef,
            entryEditorRef: props.entryEditorRef,
        }

        this.createNewData = this.createNewData.bind(this)
        this.clearData = this.clearData.bind(this)
        this.useSample = this.useSample.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.parseAndOpenJson = this.parseAndOpenJson.bind(this)
        this.reportError = this.reportError.bind(this)
        this.clearError = this.clearError.bind(this)
    }

    render() {
        return (
            <form>
                <button onClick={this.createNewData}>New Turnips Data</button>
                <label htmlFor="turnips-file">Open Turnips Data: </label>
                <input type="file" id="turnips-file" onChange={this.handleChange} title="Open Turnips Data"/>
                <button onClick={this.useSample}>Open Sample</button>
                <button onClick={this.clearData}>Clear</button>
            </form>
        )
    }

    createNewData(event) {
        event.preventDefault()
        this.state.entryEditorRef.current.setState({hidden: false})
    }

    clearData(event) {
        event.preventDefault()
        const turnipsPriceChart = this.state.priceChartRef.current
        const turnipsProfitChart = this.state.profitChartRef.current
        ReactDOM.findDOMNode(turnipsPriceChart).parentNode.style.setProperty('display', 'none')
        ReactDOM.findDOMNode(turnipsProfitChart).parentNode.style.setProperty('display', 'none')
        this.state.tableRef.current.setState({entries: []})
        this.state.entryEditorRef.current.setState({hidden: true})
    }

    useSample(event) {
        fetch("/turnips-tracker/sample.json")
            .then(response => {
                if (!response.ok) {
                    this.reportError(`Could not get sample data: ${response.status} ${response.statusText}`)
                    return
                }

                return response.text()
            }).then(this.parseAndOpenJson)
        event.preventDefault()
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
            this.parseAndOpenJson(text)
        }
        reader.onerror = _ => {
            const error = reader.error
            console.error("Error occurred when reading turnips data file: %s", error)
            turnipsTable.setState({errorMessage: `could not read file: ${error.message}`})
        }
        reader.readAsText(turnipsFile)
        event.preventDefault()
    }

    parseAndOpenJson(text) {
        try {
            const parsed = JSON.parse(text)
            this.openJson(parsed)
        } catch (error) {
            console.error("Error occurred when opening turnips data: %s", error)
            let errorMessage = "more details in the console"
            if (error instanceof SyntaxError) {
                errorMessage = error.message
            }
            this.reportError(errorMessage)
        }
    }

    openJson(json) {
        const turnipsPriceChart = this.state.priceChartRef.current
        const turnipsProfitChart = this.state.profitChartRef.current
        const turnipsTable = this.state.tableRef.current
        turnipsTable.setState({entries: json})
        turnipsPriceChart.chartInstance.data = createTurnipsNumberChartData(json)
        turnipsPriceChart.chartInstance.update()
        ReactDOM.findDOMNode(turnipsPriceChart).parentNode.style.removeProperty('display')
        turnipsProfitChart.chartInstance.data = createProfitChartData(json)
        turnipsProfitChart.chartInstance.update()
        ReactDOM.findDOMNode(turnipsProfitChart).parentNode.style.removeProperty('display')

        this.clearError()
    }

    reportError(errorMessage) {
        const turnipsTable = this.state.tableRef.current
        turnipsTable.setState({errorMessage: errorMessage})
    }

    clearError() {
        const turnipsTable = this.state.tableRef.current
        turnipsTable.setState({errorMessage: null})
    }
}

class EntryEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tableRef: props.tableRef,
            priceChartRef: props.priceChartRef,
            profitChartRef: props.profitChartRef,
            hidden: true,
            formValid: false,
            date: '',
            half: 'morning',
            price: 0,
            quantity: 0,
        }

        this.validateForm = this.validateForm.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    validateForm() {
        return this.state.date.length !== 0
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.type === 'number' ? parseInt(target.value) : target.value
        this.setState({[target.name]: value, formValid: this.validateForm()})
    }

    handleSubmit(event) {
        event.preventDefault()
        if (!this.state.formValid) {
            return
        }

        const date = this.state.date
        const half = this.state.half
        const price = this.state.price
        const quantity = this.state.quantity
        const entry = isSunday(date) ? {date: date, bought: quantity, price: price} : {date: date, half: half, sold: quantity, price: price}

        const turnipsTable = this.state.tableRef.current
        turnipsTable.addEntry(entry)
        const turnipsPriceChart = this.state.priceChartRef.current
        const turnipsProfitChart = this.state.profitChartRef.current
        const entries = turnipsTable.state.entries
        turnipsPriceChart.chartInstance.data = createTurnipsNumberChartData(entries)
        turnipsPriceChart.chartInstance.update()
        ReactDOM.findDOMNode(turnipsPriceChart).parentNode.style.removeProperty('display')
        turnipsProfitChart.chartInstance.data = createProfitChartData(entries)
        turnipsProfitChart.chartInstance.update()
        ReactDOM.findDOMNode(turnipsProfitChart).parentNode.style.removeProperty('display')
    }
}

class TurnipsTable extends React.Component {

    constructor(props) {
        super(props)

        this.addEntry = this.addEntry.bind(this)
    }

    addEntry(entry) {
        const entries = this.state?.entries ?? []

        const key = createTurnipsKey(entry)
        const existingEntryIndex = entries.findIndex(value => createTurnipsKey(value) === key)
        if (existingEntryIndex < 0) {
            entries.push(entry)
        } else {
            entries[existingEntryIndex] = entry
        }
        this.setState({entries: entries})
    }

    render() {
        if (!this.state) {
            return (<p>No Turnips Data Loaded</p>)
        }

        const errorMessage = this.state.errorMessage
        if (errorMessage) {
            return (<p>Error when reading the turnips data: {errorMessage}</p>)
        }

        const turnipsEntries = this.state.entries.sort(turnipsEntriesSort)

        if (turnipsEntries.length === 0) {
            return (<p>No Turnips Data Loaded</p>)
        }
        const turnipsRows = turnipsEntries.map(entry => TurnipsTableRow(entry))
        return (
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
        )
    }
}

function TurnipsTableRow(props) {
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

function createTurnipsKey(entry) {
    return entry.date + '-' + entry.half
}

function turnipsEntriesSort(a, b) {
    if (a.date === b.date) {
        return a.half === "morning" && b.half === "afternoon" ? -1 : 1
    }
    return compareDates(a.date, b.date)
}

function createTurnipsNumberChartData(jsonData) {
    let dayLabels = []
    let sellingPriceData = []
    let buyingPriceData = []
    jsonData.forEach(entry => {
        const price = entry.price
        if (entry.sold != null) {
            const shortHalf = entry.half === 'morning' ? 'am' : 'pm'
            dayLabels.push(entry.date + shortHalf)
            sellingPriceData.push(price)
            buyingPriceData.push(null)
        } else {
            dayLabels.push(entry.date)
            sellingPriceData.push(null)
            buyingPriceData.push(price)
        }
    })

    function dataset(label, data, color) {
        return {
            label: label,
            data: data,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 4,
            spanGaps: true,
            pointBackgroundColor: color,
            backgroundColor: color,
            borderColor: color
        }
    }

    return {
        labels: dayLabels,
        datasets: [
            dataset('Selling Price', sellingPriceData, 'rgba(30, 144, 255, 0.2)'),
            dataset('Buying Price', buyingPriceData, 'rgba(255, 215, 0, 0.2)')
        ],
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    }
}

function createProfitChartData(jsonData) {
    let weekLabels = []
    let weekProfits = []
    let weekBought = 0
    let weekSold = 0
    jsonData.sort(turnipsEntriesSort).forEach(entry => {
        if (entry.sold != null) {
            if (weekLabels.length === 0) {
                // Skip sold values that are not in a cycle (starting sunday)
                return
            }

            weekSold += entry.sold * entry.price
        } else {
            if (weekLabels.length !== 0) {
                weekProfits.push(weekSold - weekBought)
            }

            weekLabels.push(entry.date)
            weekBought = entry.bought * entry.price
            weekSold = 0
        }
    })

    if (weekBought > 0 || weekSold > 0) {
        weekProfits.push(weekSold - weekBought)
    }

    return {
        labels: weekLabels,
        datasets: [{
            label: 'Profit',
            data: weekProfits
        }]
    }
}

function dayForDate(date) {
    return moment(date, 'yyyy-MM-DD').format('dddd')
}

function isSunday(date) {
    return moment(date, 'yyyy-MM-DD').weekday() === 0
}
