import React from 'react'
import {CategoryScale, Chart, defaults as ChartsDefaults, LinearScale, LineElement, PointElement,} from 'chart.js'
import {Line} from 'react-chartjs-2'

import './App.css'

import EntryEditor from "./TurnipsEntryEditor";
import LoadTurnipsData from './LoadTurnipsData'
import TurnipsTable from './TurnipsTable'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement)

export default function App() {
    const dataLoaderRef = React.createRef<LoadTurnipsData>()
    const tableRef = React.createRef<TurnipsTable>()
    const priceChartRef = React.createRef<Chart<"line">>()
    const priceChartContainerRef = React.createRef<HTMLDivElement>()
    const profitChartRef = React.createRef<Chart<"line">>()
    const profitChartContainerRef = React.createRef<HTMLDivElement>()
    const entryEditorRef = React.createRef<EntryEditor>()

    ChartsDefaults.maintainAspectRatio = false
    setupWindowDND(dataLoaderRef)

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
                <Line ref={priceChartRef} data={{datasets: []}}/>
            </div>
            <div ref={profitChartContainerRef} style={{display: 'none', position: 'relative', height: '40vh', width: '95vw'}}>
                <Line ref={profitChartRef} data={{datasets: []}}/>
            </div>
            <TurnipsTable ref={tableRef} visible={false}/>
        </div>
    )
}

function setupWindowDND(dataLoaderRef: React.RefObject<LoadTurnipsData>) {
    window.addEventListener('dragover', event => event.preventDefault())
    window.addEventListener('drop', event => {
        event.preventDefault()
        let file = event.dataTransfer!.files[0]
        if (file) {
            dataLoaderRef.current!.openAndParseJsonFile(file)
        }
    })
}
