import React from 'react'
import './App.css'
import {compareDates} from './helpers'
import {defaults as ChartsDefaults, Line as LineChart} from 'react-chartjs-2'
import moment from 'moment'

function App() {
    const dataLoaderRef = React.createRef<LoadTurnipsData>()
    const tableRef = React.createRef<TurnipsTable>()
    const priceChartRef = React.createRef<LineChart>()
    const priceChartContainerRef = React.createRef<HTMLDivElement>()
    const profitChartRef = React.createRef<LineChart>()
    const profitChartContainerRef = React.createRef<HTMLDivElement>()
    const entryEditorRef = React.createRef<EntryEditor>()

    ChartsDefaults.global.maintainAspectRatio = false
    handleWindowDND(dataLoaderRef)

    return (
        <div>
            <LoadTurnipsData ref={dataLoaderRef} tableRef={tableRef}
                             priceChartRef={priceChartRef} priceChartContainerRef={priceChartContainerRef}
                             profitChartRef={profitChartRef} profitChartContainerRef={profitChartContainerRef}
                             entryEditorRef={entryEditorRef}/>
            <EntryEditor ref={entryEditorRef} hidden={true} tableRef={tableRef}
                         priceChartRef={priceChartRef} priceChartContainerRef={priceChartContainerRef}
                         profitChartRef={profitChartRef} profitChartContainerRef={profitChartContainerRef}/>
            <div ref={priceChartContainerRef} style={{display: 'none', position: 'relative', height: '40vh', width: '95vw'}}>
                <LineChart ref={priceChartRef} data={{}}/>
            </div>
            <div ref={profitChartContainerRef} style={{display: 'none', position: 'relative', height: '40vh', width: '95vw'}}>
                <LineChart ref={profitChartRef} data={{}}/>
            </div>
            <TurnipsTable ref={tableRef} visible={false}/>
        </div>
    )
}

function handleWindowDND(dataLoaderRef: React.RefObject<LoadTurnipsData>) {
    window.addEventListener('dragover', event => event.preventDefault())
    window.addEventListener('drop', event => {
        event.preventDefault()
        let file = event.dataTransfer!.files[0]
        if (file) {
            dataLoaderRef.current!.parseAndOpenJsonFile(file)
        }
    })
}

export default App

type LoadTurnipsDataProps = {
    tableRef: React.RefObject<TurnipsTable>
    priceChartContainerRef: React.RefObject<HTMLDivElement>
    priceChartRef: React.RefObject<LineChart>
    profitChartContainerRef: React.RefObject<HTMLDivElement>
    profitChartRef: React.RefObject<LineChart>
    entryEditorRef: React.RefObject<EntryEditor>
}

class LoadTurnipsData extends React.Component<LoadTurnipsDataProps, {}> {
    private turnipsFileInputRef = React.createRef<HTMLInputElement>()

    render() {
        return (
            <form>
                <button onClick={this.createNewData}>New Turnips Data</button>
                <button onClick={this.openDataFileSelection}>Select Turnips Data</button>
                <input type="file" id="turnips-file" onChange={this.handleChange}
                       style={{width: 0, height: 0}} ref={this.turnipsFileInputRef}/>
                <button onClick={this.useSample}>Open Sample</button>
                <button onClick={this.clearData}>Clear</button>
            </form>
        )
    }

    createNewData = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        this.props.entryEditorRef.current!.setState({hidden: false})
    }

    clearData = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        this.props.priceChartContainerRef.current!.style.setProperty('display', 'none')
        this.props.profitChartContainerRef.current!.style.setProperty('display', 'none')
        this.props.tableRef.current!.setState({entries: []})
        this.props.entryEditorRef.current!.setState({hidden: true})
    }

    useSample = (event: React.SyntheticEvent) => {
        event.preventDefault()
        fetch("/turnips-tracker/sample.json")
            .then(response => {
                if (!response.ok) {
                    this.reportError(`Could not get sample data: ${response.status} ${response.statusText}`)
                    return
                }

                return response.text()
            }).then((text: string | undefined) => this.parseAndOpenJson(text as string))
    }

    openDataFileSelection = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const fileInput = this.turnipsFileInputRef.current!
        fileInput.value = ''
        fileInput.click()
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const turnipsFile = event.target?.files?.item(0)
        if (!turnipsFile) {
            return
        }
        if (!(turnipsFile instanceof Blob)) {
            console.log("Not a Blob, but a %s", typeof turnipsFile)
            return
        }
        this.parseAndOpenJsonFile(turnipsFile)
    }

    parseAndOpenJsonFile = (turnipsFile: Blob) => {
        const reader = new FileReader()
        const turnipsTable = this.props.tableRef.current!
        reader.onload = _ => {
            const text = reader.result
            console.assert(typeof text === "string", "readAsText did not return a String result but a %s of value %s", text?.constructor.name, text)
            this.parseAndOpenJson(text as string)
        }
        reader.onerror = _ => {
            const error = reader.error
            console.error("Error occurred when reading turnips data file: %s", error)
            turnipsTable.setState({errorMessage: `could not read file: ${error?.message}`})
        }
        reader.readAsText(turnipsFile)
    }

    parseAndOpenJson = (text: string) => {
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

    openJson = (json: Array<TurnipsEntry>) => {
        this.props.tableRef.current!.setState({entries: json})
        const turnipsPriceChart = this.props.priceChartRef.current!
        turnipsPriceChart.chartInstance.data = createTurnipsNumberChartData(json)
        turnipsPriceChart.chartInstance.update()
        this.props.priceChartContainerRef.current!.style.removeProperty('display')
        const turnipsProfitChart = this.props.profitChartRef.current!
        turnipsProfitChart.chartInstance.data = createProfitChartData(json)
        turnipsProfitChart.chartInstance.update()
        this.props.profitChartContainerRef.current!.style.removeProperty('display')

        this.clearError()
    }

    reportError = (errorMessage: string) => this.props.tableRef.current!.setState({errorMessage: errorMessage})

    clearError = () => this.props.tableRef.current!.setState({errorMessage: undefined})
}

enum DayHalf {
    MORNING = 'morning',
    AFTERNOON = 'afternoon'
}

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

class EntryEditor extends React.Component<EntryEditorProps, EntryEditorState> {

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

type TurnipsEntry = {
    date: string,
    half?: DayHalf,
    bought?: number,
    sold?: number
    price: number
}

type TurnipsTableProps = {
    visible?: boolean
}

type TurnipsTableState = {
    entries: Array<TurnipsEntry>
    errorMessage?: string
    visible: boolean
}

class TurnipsTable extends React.Component<TurnipsTableProps, TurnipsTableState> {

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

function createTurnipsKey(entry: TurnipsEntry) {
    return entry.date + '-' + entry.half
}

function turnipsEntriesSort(a: TurnipsEntry, b: TurnipsEntry) {
    if (a.date === b.date) {
        return a.half === DayHalf.MORNING && b.half === DayHalf.AFTERNOON ? -1 : 1
    }
    return compareDates(a.date, b.date)
}

function createTurnipsNumberChartData(entries: Array<TurnipsEntry>) {
    let dayLabels: Array<string> = []
    let sellingPriceData: Array<number | null> = []
    let buyingPriceData: Array<number | null> = []
    entries.forEach(entry => {
        const price = entry.price
        if (entry.sold != null) {
            const shortHalf = entry.half === DayHalf.MORNING ? 'am' : 'pm'
            dayLabels.push(entry.date + shortHalf)
            sellingPriceData.push(price)
            buyingPriceData.push(null)
        } else {
            dayLabels.push(entry.date)
            sellingPriceData.push(null)
            buyingPriceData.push(price)
        }
    })

    function dataset(label: string, data: Array<number | null>, color: string) {
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

function createProfitChartData(entries: Array<TurnipsEntry>) {
    let weekLabels: Array<string> = []
    let weekProfits: Array<number> = []
    let weekBought = 0
    let weekSold = 0
    entries.sort(turnipsEntriesSort).forEach(entry => {
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

            const bought = entry.bought ?? 0;
            weekLabels.push(entry.date)
            weekBought = bought * entry.price
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

function dayForDate(date: string) {
    return moment(date, 'yyyy-MM-DD').format('dddd')
}

function isSunday(date: string) {
    return moment(date, 'yyyy-MM-DD').weekday() === 0
}
