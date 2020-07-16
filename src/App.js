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
    ChartsDefaults.global.maintainAspectRatio = false
    return (
        <div>
            <LoadTurnipsData tableRef={tableRef} priceChartRef={priceChartRef} profitChartRef={profitChartRef}/>
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
        }
        this.useSample = this.useSample.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.parseAndOpenJson = this.parseAndOpenJson.bind(this)
        this.reportError = this.reportError.bind(this)
    }

    render() {
        return (
            <form>
                <label htmlFor="turnips-file">Open Turnips Data: </label>
                <input type="file" id="turnips-file" onChange={this.handleChange} title="Open Turnips Data"/>
                <button onClick={this.useSample}>Open Sample</button>
            </form>
        )
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
    }

    reportError(errorMessage) {
        const turnipsTable = this.state.tableRef.current
        turnipsTable.setState({errorMessage: errorMessage})
    }
}

class TurnipsTable extends React.Component {

    render() {
        if (!this.state) {
            return (<p>No Turnips Data Loaded</p>)
        }

        const errorMessage = this.state.errorMessage
        if (errorMessage) {
            return (<p>Error when reading the turnips data: {errorMessage}</p>)
        }

        const turnipsEntries = this.state.entries.sort(turnipsEntriesSort)

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
        <tr key={props.date + '-' + props.half}>
            <td>{props.date} ({dayForDate(props.date)}) {props.half}</td>
            <td>{price}</td>
            <td>{formattedCount}</td>
            <td>{detail}</td>
        </tr>
    )
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
