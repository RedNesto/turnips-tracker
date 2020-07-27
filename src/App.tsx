import React from 'react'
import {defaults as ChartsDefaults, Line as LineChart} from 'react-chartjs-2'

import './App.css'

import EntryEditor from "./TurnipsEntryEditor";
import LoadTurnipsData from './LoadTurnipsData'
import TurnipsTable from './TurnipsTable'

export default function App() {
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
